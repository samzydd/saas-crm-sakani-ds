/** Each row's bar, as a share of the biggest value in the group (the biggest runs the full track). */
export function withFillPercent<T extends { value: string }>(rows: T[]): (T & { fillPercent: number })[] {
  const nums = rows.map((r) => parseFloat(r.value.replace(/[^0-9.]/g, '')));
  const max = Math.max(...nums);
  return rows.map((r, i) => ({ ...r, fillPercent: (nums[i] / max) * 100 }));
}

/** For a group whose values are not the same unit (a 0-5 rating next to a 0-100 score), each row carries its own `max`
 * and the bar shows how far along its own scale it is. */
export function withFillPercentByMax<T extends { value: string; max: number }>(rows: T[]): (T & { fillPercent: number })[] {
  return rows.map((r) => {
    const num = parseFloat(r.value.replace(/[^0-9.]/g, ''));
    return { ...r, fillPercent: (num / r.max) * 100 };
  });
}
