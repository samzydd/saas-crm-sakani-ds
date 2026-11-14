const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

/** Random bar values around a base, roughly trending like the original data. */
export function randomSeries(base: number, spread: number): { label: string; value: number }[] {
  return MONTHS.map((label) => ({ label, value: Math.round(base + Math.random() * spread) }));
}

export function randomRevenue(): { label: string; revenue: number }[] {
  return MONTHS.map((label) => ({ label, revenue: Math.round(300000 + Math.random() * 200000) }));
}

export function randomGrowth(): { label: string; Acquisition: number; Retention: number }[] {
  return MONTHS.map((label) => ({
    label,
    Acquisition: Math.round(3800 + Math.random() * 2500),
    Retention: Math.round(3400 + Math.random() * 2000),
  }));
}

/** Keeps the same labels, randomizes values so they sum to ~100 (percentages). */
export function randomShares<T extends { label: string }>(data: T[]): (T & { value: number })[] {
  const raw = data.map(() => Math.random());
  const sum = raw.reduce((a, b) => a + b, 0);
  let remaining = 100;
  return data.map((d, i) => {
    const value = i === data.length - 1 ? remaining : Math.max(1, Math.round((raw[i] / sum) * 100));
    remaining -= value;
    return { ...d, value };
  });
}

/** Net revenue by month, in $K, for the Sales page's period menu. */
export function randomSales(): { label: string; value: number }[] {
  return MONTHS.map((label, i) => ({ label, value: Math.round(820 + i * 80 + Math.random() * 140) }));
}

/** New and returning customers by month, for the Customers page's period menu. */
export function randomCustomers(): { label: string; value: number; value2: number }[] {
  return MONTHS.map((label, i) => ({
    label,
    value: Math.round(900 + i * 70 + Math.random() * 220),
    value2: Math.round(2600 + i * 160 + Math.random() * 360),
  }));
}
