/** Figma "List Item" -> "Progress": a bg/subtle fill sized to each row's
 * value relative to the largest in its group, capped so the biggest bar
 * doesn't crowd the value text (matches Figma's ~60% max-width ratio). */
const MAX_FILL_PERCENT = 60;

export function withFillPercent<T extends { value: string }>(rows: T[]): (T & { fillPercent: number })[] {
  const nums = rows.map((r) => parseFloat(r.value.replace(/[^0-9.]/g, '')));
  const max = Math.max(...nums);
  return rows.map((r, i) => ({ ...r, fillPercent: (nums[i] / max) * MAX_FILL_PERCENT }));
}
