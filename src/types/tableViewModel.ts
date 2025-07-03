export interface TableCellModel {
    value: number | string
    /** 文字顏色 class（Tailwind） */
    textClass?: string
    /** 數量變動量；有傳就播放紅/綠 flash */
    delta?: number
    /** 若要畫背景長條（Total 欄）就傳入百分比字串，如 '65%' */
    barPercent?: string
    /** 長條顏色 */
    barColor?: string
    /** 數字格式化選項 */
    formatOptions?: Intl.NumberFormatOptions
}

export interface TableRowModel {
    /** 資料列的唯一識別碼 */
    id: string | number
    rows: TableCellModel[]
    /** 是否為新資料列（新增或更新） */
    isNew?: boolean
    highlightColor?: string
}