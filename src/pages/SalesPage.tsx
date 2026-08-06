import { Eye, Package, ShoppingCart, CreditCard, CheckCircle2, Flag } from 'lucide-react';
import { StatCard, LineChart, DonutChart, Badge, Button, Table, type TableColumn } from 'sakani-design-system';
import { Panel } from '../components/Panel';
import { LegendRow } from '../components/LegendRow';
import { MetricRow } from '../components/MetricRow';
import styles from './Page.module.css';

const growth = [
  { label: 'Jan', Acquisition: 3800, Retention: 3200 },
  { label: 'Feb', Acquisition: 4100, Retention: 3400 },
  { label: 'Mar', Acquisition: 3950, Retention: 3550 },
  { label: 'Apr', Acquisition: 4400, Retention: 3700 },
  { label: 'May', Acquisition: 4700, Retention: 3900 },
  { label: 'Jun', Acquisition: 5100, Retention: 4150 },
];

const channels = [
  { label: 'Website', value: 48 },
  { label: 'Mobile app', value: 27 },
  { label: 'Marketplace', value: 18 },
  { label: 'Retail', value: 7 },
];

const devices = [
  { label: 'Desktop', value: 54 },
  { label: 'Mobile', value: 34 },
  { label: 'Tablet', value: 12 },
];

const payments = [
  { label: 'Credit card', value: 52 },
  { label: 'Paypal', value: 24 },
  { label: 'Apple pay', value: 16 },
  { label: 'Bank transfer', value: 8 },
];

const funnel = [
  { icon: Eye, label: 'Visitors', value: '248,900' },
  { icon: Package, label: 'Product view', value: '118,700' },
  { icon: ShoppingCart, label: 'Added to cart', value: '43,600' },
  { icon: CreditCard, label: 'Checkout started', value: '26,900' },
  { icon: CheckCircle2, label: 'Purchases', value: '12,100' },
];

const countries = [
  { label: 'United States', value: '$486,500' },
  { label: 'Canada', value: '$324,700' },
  { label: 'England', value: '$268,400' },
  { label: 'Portugal', value: '$89,749' },
  { label: 'Spain', value: '$58,150' },
  { label: 'Nigeria', value: '$23,040' },
];

const refundReasons = [
  { label: 'Wrong size', value: '32%' },
  { label: 'Changed mind', value: '24%' },
  { label: 'Product defect', value: '18%' },
  { label: 'Not as described', value: '14%' },
  { label: 'Other', value: '12%' },
];

interface ProductRow {
  order: string;
  revenue: string;
  unitsSold: string;
}

const products: ProductRow[] = [
  { order: 'Wireless Earbuds Pro', revenue: '$84,200', unitsSold: '2,140' },
  { order: 'Classic Leather Wallet', revenue: '$61,540', unitsSold: '3,920' },
  { order: 'Smart Fitness Band', revenue: '$58,910', unitsSold: '1,860' },
  { order: 'Ceramic Pour-Over Set', revenue: '$41,300', unitsSold: '2,510' },
  { order: 'Canvas Weekender Bag', revenue: '$36,780', unitsSold: '1,240' },
];

export function SalesPage() {
  const columns: TableColumn<ProductRow>[] = [
    { key: 'order', header: 'Order' },
    { key: 'revenue', header: 'Revenue', align: 'right' },
    { key: 'unitsSold', header: 'Unit sold', align: 'right' },
  ];

  return (
    <>
      <div className={styles.kpiRow}>
        <StatCard title="Gross Sales" value="$1,472,310" delta="10.2%" trend="up" description="vs last month" />
        <StatCard title="Net Revenue" value="$1,248,950" delta="14.8%" trend="up" description="vs last month" />
        <StatCard title="Refunds" value="$42,380" delta="9.8%" trend="up" description="vs last month" />
        <StatCard title="Avg Order" value="$82.34" delta="1.5%" trend="up" description="vs last month" />
        <StatCard title="Discounts" value="$68,950" delta="4.1%" trend="up" description="vs last month" />
      </div>

      <div className={styles.chartsRow2}>
        <Panel title="Acquisition vs retention" description="Track visitor acquisition and retention trends over time.">
          <div className={styles.panelActionsRow}>
            <Badge variant="success" emphasis="subtle">This month</Badge>
            <Button variant="ghost" size="sm">Last 6 months</Button>
          </div>
          <LineChart data={growth} series={['Acquisition', 'Retention']} size="md" />
          <div className={styles.legendRowInline}>
            <span className={styles.legendItem}><span className={styles.dot} style={{ background: 'var(--color-chart-1)' }} />Acquisition</span>
            <span className={styles.legendItem}><span className={styles.dot} style={{ background: 'var(--color-chart-2)' }} />Retention</span>
          </div>
        </Panel>

        <Panel title="Channel breakdown" description="Where this month's revenue is coming from.">
          <div className={styles.panelActionsRow}>
            <Badge variant="neutral" emphasis="subtle">This month</Badge>
            <Button variant="ghost" size="sm">View report</Button>
          </div>
          <DonutChart data={channels} size="md" />
          <div className={styles.legendList}>
            {channels.map((c, i) => (
              <LegendRow key={c.label} colorIndex={i + 1} label={c.label} value={`${c.value}%`} />
            ))}
          </div>
        </Panel>
      </div>

      <div className={styles.threeCol}>
        <Panel title="Conversion funnel" description="From first visit to completed purchase.">
          <div className={styles.metricPanel}>
            {funnel.map((f) => (
              <MetricRow key={f.label} icon={<f.icon size={16} strokeWidth={1.5} />} label={f.label} value={f.value} />
            ))}
          </div>
          <Badge variant="accent" emphasis="subtle">4.9% overall conversion</Badge>
        </Panel>

        <Panel title="Device breakdown" description="Sessions split across device types.">
          <DonutChart data={devices} size="sm" />
          <div className={styles.legendList}>
            {devices.map((d, i) => (
              <LegendRow key={d.label} colorIndex={i + 1} label={d.label} value={`${d.value}%`} />
            ))}
          </div>
        </Panel>

        <Panel title="Top countries" description="Revenue by customer location.">
          <div className={styles.metricPanel}>
            {countries.map((c) => (
              <MetricRow key={c.label} icon={<Flag size={14} strokeWidth={1.5} />} label={c.label} value={c.value} />
            ))}
          </div>
        </Panel>
      </div>

      <div className={styles.threeCol}>
        <Panel title="Payment methods" description="How customers are paying.">
          <DonutChart data={payments} size="sm" />
          <div className={styles.legendList}>
            {payments.map((p, i) => (
              <LegendRow key={p.label} colorIndex={i + 1} label={p.label} value={`${p.value}%`} />
            ))}
          </div>
        </Panel>

        <Panel title="Top products" description="Best-selling products this month.">
          <Table<ProductRow> columns={columns} rows={products} rowKey={(r) => r.order} />
        </Panel>

        <Panel title="Refund reasons" description="Why customers are requesting refunds.">
          <div className={styles.miniStatsRow}>
            <div className={styles.miniStat}>
              <span className={styles.miniStatLabel}>Refund rate</span>
              <span className={styles.miniStatValue}>3.2%</span>
            </div>
            <div className={styles.miniStat}>
              <span className={styles.miniStatLabel}>Refund orders</span>
              <span className={styles.miniStatValue}>186</span>
            </div>
            <div className={styles.miniStat}>
              <span className={styles.miniStatLabel}>Avg refund amt</span>
              <span className={styles.miniStatValue}>$54</span>
            </div>
          </div>
          <div className={styles.metricPanel}>
            {refundReasons.map((r) => (
              <MetricRow key={r.label} label={r.label} value={r.value} />
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
