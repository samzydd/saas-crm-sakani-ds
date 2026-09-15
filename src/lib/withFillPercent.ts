/** Figma "List Item" -> "Progress": a bg/subtle fill sized to each row's
 * value relative to the largest in its group, capped so the biggest bar
 * doesn't crowd the value text (matches Figma's ~60% max-width ratio). */
const MAX_FILL_PERCENT = 60;

export function withFillPercent<T extends { value: string }>(rows: T[]): (T & { fillPercent: number })[] {
  const nums = rows.map((r) => parseFloat(r.value.replace(/[^0-9.]/g, '')));
  const max = Math.max(...nums);
  return rows.map((r, i) => ({ ...r, fillPercent: (nums[i] / max) * MAX_FILL_PERCENT }));
}

/** Same "Progress" fill, but for a group whose values aren't the same unit
 * (a 0-5 rating next to an NPS score next to percentages, e.g. Customer
 * Satisfaction) -- withFillPercent's relative-to-group-max would size each
 * bar by which number happens to be biggest, not by how strong that metric
 * actually is. Each row instead gets its own `max` (the top of its scale),
 * so a 4.8/5 rating and a 71/100 NPS both fill proportionally to their own
 * range rather than competing against each other's raw digits. */
export function withFillPercentByMax<T extends { value: string; max: number }>(
  rows: T[]
): (T & { fillPercent: number })[] {
  return rows.map((r) => {
    const num = parseFloat(r.value.replace(/[^0-9.]/g, ''));
    return { ...r, fillPercent: (num / r.max) * MAX_FILL_PERCENT };
  });
}
