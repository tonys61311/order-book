// src/utils/baseSocket.ts
import type { WsEnvelope } from '@/types/wsPayload';

type AnyListener = (payload: unknown) => void;

/**
 * 雙層責任：
 * 1. 與伺服器維持單一 WebSocket 連線（心跳 / 自動重連）
 * 2. 依 topic 將訊息分流給呼叫端 listener
 */
export abstract class BaseSocket {
  private ws?: WebSocket;
  private readonly url: string;

  /* 連線狀態管理 */
  private openPromise: Promise<void> | null = null;
  private reconnectMs = 5_000;

  /* 心跳 */
  private heartbeatHandle?: number;

  /* topic -> listeners */
  private topicMap = new Map<string, Set<AnyListener>>();

  protected constructor(url: string) {
    this.url = url;
  }

  /* ──────────────── PUBLIC API ──────────────── */

  /** 確保連線 OPEN，若已連或正在 CONNECTING 會重用同一 Promise */
  connect(): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN) return Promise.resolve();
    if (this.openPromise) return this.openPromise;

    this.ws = new WebSocket(this.url);

    /* 將 open 事件包成 Promise，以便 await */
    this.openPromise = new Promise<void>((resolve) => {
      this.ws!.addEventListener(
        'open',
        () => {
          this.onOpen();
          resolve();
        },
        { once: true }
      );

      this.ws!.addEventListener('message', this.onMessage);
      this.ws!.addEventListener('close', () => this.onClose());
      this.ws!.addEventListener('error', () => this.onError());
    });

    return this.openPromise;
  }

  disconnect(): void {
    this.heartbeatStop();
    this.ws?.close();
    this.ws = undefined;
    this.openPromise = null;
  }

  /** 確保連線已開，才 send JSON */
  async send(data: unknown): Promise<void> {
    await this.connect(); // 保證握手完成
    this.ws!.send(JSON.stringify(data));
  }

  /**
   * 監聽特定 topic；回傳 off() 方便解除
   * 用法：off = socket.on<OrderBookData>('update:BTCPFC_0', cb)
   */
  on<T>(topic: string, fn: (payload: T) => void): () => void {
    if (!this.topicMap.has(topic)) this.topicMap.set(topic, new Set());
    this.topicMap.get(topic)!.add(fn as AnyListener);
    return () => this.topicMap.get(topic)?.delete(fn as AnyListener);
  }

  /** 單行 helper：清掉 topic 內所有 listener */
  protected removeTopicListeners(topic: string) {
    console.info('[WS] Removing listeners for topic →', topic);
    console.info('[WS] Remaining topics →', this.topicMap);
    this.topicMap.delete(topic);
  }

  /* ──────────────── INTERNAL ──────────────── */

  /** 發生新訊息時，解析並分流到對應 listeners */
  private dispatch(raw: string): void {
    let env: WsEnvelope;
    try {
      env = JSON.parse(raw);
      console.log('Received', env);
    } catch {
      return; // 非 JSON 直接略過
    }

    /* --- 訂閱 & 退訂確認 ---------------- */
    if ('event' in env) {
        if (env.event === 'subscribe') {                 // ←新增
        console.info('[WS] Subscribed →', env.channel?.[0]);
        }
        if (env.event === 'unsubscribe') {               // ←新增
        console.info('[WS] Unsubscribed →', env.channel?.[0]);
        }
    }

     /* --- 正常分流 ----------------------- */
     /* --- 正常分流 ----------------------- */
    let fullTopic = env.topic;

    /* 若只有 base topic，嘗試用 data[0].symbol 補完整 */
    if (
      !this.topicMap.has(fullTopic) &&
      Array.isArray(env.data) &&
      env.data[0]?.symbol
    ) {
      fullTopic = `${env.topic}:${env.data[0].symbol}`;
    }
    const listeners = this.topicMap.get(fullTopic);
    if (!listeners?.size) return;

    listeners.forEach((fn) => fn(env.data));
  }

  /** 可被子類覆寫：重連成功後要做的事（如重新訂閱） */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected onReconnect(): void {}

  /* ──────────────── SOCKET EVENTS ──────────────── */

  private onOpen() {
    console.info('[WS] Connected', this.url); 
    /* 心跳：每 25 秒送一次 ping */
    this.heartbeatHandle = window.setInterval(() => this.send({ op: 'ping' }), 25_000);
    this.onReconnect();
  }

  private onMessage = (ev: MessageEvent): void => {
    /* 先將 Blob / ArrayBuffer 轉成字串 */
    const toText = async (): Promise<string> => {
      if (typeof ev.data === 'string') return ev.data;
      if (ev.data instanceof Blob) return ev.data.text();
      if (ev.data instanceof ArrayBuffer) return new TextDecoder().decode(ev.data);
      return '';
    };

    toText().then((raw) => {
      if (!raw) return;

      /* 'ping' → 回 'pong' */
      if (raw === 'ping') {
        this.ws?.send('pong');
        return;
      }

      /* 其餘交給 dispatch */
      this.dispatch(raw);
    });
  };

  private onClose() {
    this.heartbeatStop();
    /* 自動重連 */
    setTimeout(() => {
      this.openPromise = null;
      this.connect().then(() => this.onReconnect());
    }, this.reconnectMs);
  }

  private onError() {
    this.ws?.close(); // 觸發 onClose → 重連
  }

  private heartbeatStop() {
    if (this.heartbeatHandle) clearInterval(this.heartbeatHandle);
  }
}
