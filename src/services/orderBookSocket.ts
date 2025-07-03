// src/services/orderBookSocket.ts
import { BaseSocket } from '@/utils/baseSocket';

export class OrderBookSocket extends BaseSocket {
  constructor(url: string) {
    super(url);
  }

  /**
   *  訂閱 topic；若帶 listener 會自動綁定並回傳 off()
   *  用法：
   *    const off = socket.subscribe<OrderBookData>('update:BTCPFC_0', cb);
   *    // 只訂閱不監聽：
   *    socket.subscribe('tradeHistoryApi:BTCPFC');
   */
  async subscribe<T>(topic: string, listener?: (payload: T) => void): Promise<void | (() => void)> {
    await this.send({ op: 'subscribe', args: [topic] });
    if (listener) {
      return this.on<T>(topic, listener);
    }
  }

  /** 取消訂閱並清掉所有綁在此 topic 的 listener */
  async unsubscribe(topic: string) {
    await this.send({ op: 'unsubscribe', args: [topic] });
    this.removeTopicListeners(topic);
  }

  /** 重新訂閱（先刪後加）；若有 listener 一起重綁 */
  async resubscribe<T>(topic: string, listener?: (payload: T) => void): Promise<void | (() => void)> {
    await this.unsubscribe(topic);
    return this.subscribe<T>(topic, listener);
  }
}
