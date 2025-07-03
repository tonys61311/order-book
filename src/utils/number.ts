/**
 * 格式化數字：加入千分位逗號
 * @param value 可以是 string 或 number
 * @param options 可選 Intl.NumberFormat options
 * @returns string e.g. 123456 => '123,456'
 */
const formatter = new Intl.NumberFormat('en-US')   // en-US 千分位為「,」

export function formatNumber(
  value: number | string,
  options?: Intl.NumberFormatOptions
): string {
  const num = Number(value)

  // 先擋掉 NaN、Infinity 或 -Infinity
  if (!Number.isFinite(num)) return String(value)
    
  // 若需要自訂小數位，可透過 options override
  if (options) {
    return new Intl.NumberFormat('en-US', options).format(Number(value))
  }
  return formatter.format(Number(value))
}
