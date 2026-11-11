export function toDateInput(value) {
  if (!value) return '';
  const match = String(value).match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : '';
}

export function formatWhen(item) {
  if (item.period) return item.period;
  return toDateInput(item.completion);
}
