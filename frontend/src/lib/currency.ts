export const yenCurrency = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
});

export const formatYen = (value: number | string) =>
  yenCurrency.format(Number(value));
