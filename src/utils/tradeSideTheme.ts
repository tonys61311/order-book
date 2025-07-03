import { TradeSide } from "@/types/trade"

/** 每種買/賣盤需要的外觀設定 */
export abstract class TradeSideTheme {
  /** 價格字色（上漲/下跌） */
  abstract priceTextClass: string
  /** 左側累積量 bar 的背景色 */
  abstract barBgColor: string
  /** 新增/更新時閃動的列背景色 */
  abstract highlightColor: string
  /** 方便給 template 判斷用 */
  constructor(public readonly side: TradeSide) {}
}

/** 買盤 Theme */
export class BuyTheme extends TradeSideTheme {
  priceTextClass  = 'text-price-up'
  barBgColor      = 'bg-bar-buy'
  highlightColor  = 'bg-flash-up'
  constructor() { super(TradeSide.BUY) }
}

/** 賣盤 Theme */
export class SellTheme extends TradeSideTheme {
  priceTextClass  = 'text-price-down'
  barBgColor      = 'bg-bar-sell'
  highlightColor  = 'bg-flash-down'
  constructor() { super(TradeSide.SELL) }
}

/** 直接匯出一張對照表 */
export const tradeSideThemeMap: Record<TradeSide, TradeSideTheme> = {
  [TradeSide.BUY] : new BuyTheme(),
  [TradeSide.SELL]: new SellTheme(),
}
