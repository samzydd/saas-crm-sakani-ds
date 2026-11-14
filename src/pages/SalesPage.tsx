import { useState } from 'react';
import { IconEye as Eye, IconPackage as Package, IconShoppingCart as ShoppingCart, IconCreditCard as CreditCard, IconCircleCheck as CheckCircle2, IconCash, IconWallet, IconReceiptRefund, IconShoppingCart, IconDiscount, IconUpload as Upload, IconTrendingUp as TrendingUp } from '@sakaniui/react/icons';
import { StatCard, AreaChart, DonutChart, Badge, Button, Table, Avatar, type TableColumn } from '@sakaniui/react';
import { Panel } from '../components/Panel';
import { LegendRow } from '../components/LegendRow';
import { MetricRow } from '../components/MetricRow';
import { PeriodDropdown } from '../components/PeriodDropdown';
import { randomSales } from '../lib/randomChartData';
import { withFillPercent } from '../lib/withFillPercent';
import styles from './Page.module.css';

/* Net revenue by month, in $K. June is the figure in the KPI row. */
const INITIAL_SALES = [
  { label: 'Jan', value: 868 },
  { label: 'Feb', value: 944 },
  { label: 'Mar', value: 1007 },
  { label: 'Apr', value: 1080 },
  { label: 'May', value: 1173 },
  { label: 'Jun', value: 1249 },
];

const channels = [
  { label: 'Website', value: 48 },
  { label: 'Mobile app', value: 27 },
  { label: 'Marketplace', value: 18 },
  { label: 'Retail', value: 7 },
];

const funnel = [
  { icon: Eye, label: 'Visitors', value: '248,900' },
  { icon: Package, label: 'Product view', value: '118,700' },
  { icon: ShoppingCart, label: 'Added to cart', value: '43,600' },
  { icon: CreditCard, label: 'Checkout started', value: '26,900' },
  { icon: CheckCircle2, label: 'Purchases', value: '12,100' },
];

const countries = [
  { label: 'United States', value: '$486,500', flag: '/flags/us.png' },
  { label: 'Canada', value: '$324,700', flag: '/flags/ca.png' },
  { label: 'England', value: '$268,400', flag: '/flags/gb.png' },
  { label: 'Portugal', value: '$89,749', flag: '/flags/pt.png' },
  { label: 'Spain', value: '$58,150', flag: '/flags/es.png' },
  { label: 'Nigeria', value: '$23,040', flag: '/flags/ng.png' },
];

const payments = [
  { label: 'Credit card', value: '52%' },
  { label: 'PayPal', value: '24%' },
  { label: 'Apple Pay', value: '16%' },
  { label: 'Bank transfer', value: '8%' },
];

const refundReasons = [
  { label: 'Wrong size', value: '32%' },
  { label: 'Changed mind', value: '24%' },
  { label: 'Product defect', value: '18%' },
  { label: 'Not as described', value: '14%' },
  { label: 'Other', value: '12%' },
];

interface ProductRow {
  product: string;
  category: string;
  image: string;
  units: string;
  revenue: string;
  change: number;
}

const products: ProductRow[] = [
  { product: 'Wireless Headphones Pro', category: 'Audio', image: '/products/headphones.png', units: '3,122', revenue: '$248,700', change: 12 },
  { product: 'Smart Fitness Watch', category: 'Wearables', image: '/products/fitness-watch.png', units: '2,061', revenue: '$184,299', change: 8 },
  { product: 'Mechanical Keyboard', category: 'Accessories', image: '/products/keyboard.jpg', units: '2,745', revenue: '$139,459', change: 5 },
  { product: 'Premium Backpack', category: 'Lifestyle', image: '/products/backpack.jpg', units: '1,895', revenue: '$124,800', change: -3 },
];


export function SalesPage() {
  const [sales, setSales] = useState(INITIAL_SALES);

  const columns: TableColumn<ProductRow>[] = [
    {
      key: 'product', header: 'Product',
      render: (r) => (
        <span className={styles.identity}>
          <Avatar size="md" src={r.image} alt="" />
          <span className={styles.identityText}>
            <span className={styles.identityName}>{r.product}</span>
            <span className={styles.identitySub}>{r.category}</span>
          </span>
        </span>
      ),
    },
    { key: 'units', header: 'Units', width: '84px', align: 'right', render: (r) => <span className={styles.num}>{r.units}</span> },
    { key: 'revenue', header: 'Revenue', width: '104px', align: 'right', render: (r) => <span className={styles.num}>{r.revenue}</span> },
    {
      key: 'change', header: 'Change', width: '84px', align: 'right',
      render: (r) => <Badge variant={r.change < 0 ? 'warning' : 'success'} emphasis="subtle">{r.change > 0 ? '+' : '-'}{Math.abs(r.change)}%</Badge>,
    },
  ];

  return (
    <>
      <div className={styles.pageHeaderRow}>
        <p className={styles.pageHeaderDesc}>Track revenue performance, identify trends and optimize conversions.</p>
        <div className={styles.pageHeaderActions}>
          <PeriodDropdown
            variant="outline"
            defaultValue="30 days"
            options={['7 days', '30 days', '90 days']}
            formatLabel={(v) => `Last ${v}`}
          />
          <Button variant="outline" size="sm" leftIcon={<Upload size={14} strokeWidth={1.5} />}>Export data</Button>
        </div>
      </div>

      {/* A rise in refunds or discounts is not good news, so those two deltas are amber, not green. */}
      <div className={styles.kpiRow}>
        <StatCard variant="icon" icon={IconCash} title="Gross sales" value="$1,472,310" delta="10.2%" trend="up" description="vs last month" />
        <StatCard variant="icon" icon={IconWallet} title="Net revenue" value="$1,248,950" delta="14.8%" trend="up" description="vs last month" />
        <StatCard variant="icon" icon={IconReceiptRefund} title="Refunds" value="$42,380" delta="9.8%" trend="up" badgeVariant="warning" description="vs last month" />
        <StatCard variant="icon" icon={IconShoppingCart} title="Avg order" value="$82.34" delta="1.5%" trend="up" description="vs last month" />
        <StatCard variant="icon" icon={IconDiscount} title="Discounts" value="$68,950" delta="4.1%" trend="up" badgeVariant="warning" description="vs last month" />
      </div>

      <div className={styles.row2to1}>
        <Panel
          title="Revenue overview"
          description="Net revenue by month, in $K."
          actions={<>
            <Badge variant="success" emphasis="subtle" rightIcon={<TrendingUp size={12} strokeWidth={2} />}>6.4% up this month</Badge>
            <PeriodDropdown onChange={() => setSales(randomSales())} />
          </>}
        >
          <AreaChart data={sales} seriesLabels={['Net revenue']} size="lg" height={320} appearance="rich" />
        </Panel>

        <Panel
          title="Sales by channel"
          description="Where this month's revenue is coming from."
          actions={<Button variant="outline" size="sm">View report</Button>}
        >
          <div className={styles.donutBlock}>
            <DonutChart data={channels} size="md" centerValue="$1.47M" centerCaption="gross sales" appearance="rich" />
            <div className={styles.legendList}>
              {channels.map((c, i) => <LegendRow key={c.label} colorIndex={i + 1} label={c.label} value={`${c.value}%`} />)}
            </div>
          </div>
        </Panel>
      </div>

      <div className={styles.row3}>
        <Panel title="Conversion funnel" description="From first visit to completed purchase.">
          <div className={styles.list}>
            {withFillPercent(funnel).map((f) => (
              <MetricRow key={f.label} icon={<f.icon size={16} strokeWidth={1.5} />} label={f.label} value={f.value} fillPercent={f.fillPercent} />
            ))}
          </div>
          <Badge variant="info" emphasis="subtle" className={styles.footBadge}>4.9% overall conversion</Badge>
        </Panel>

        <Panel title="Top countries" description="Revenue by customer location.">
          <div className={styles.list}>
            {withFillPercent(countries).map((c) => (
              <MetricRow key={c.label} icon={<img className={styles.flag} src={c.flag} alt="" />} label={c.label} value={c.value} fillPercent={c.fillPercent} />
            ))}
          </div>
        </Panel>

        <Panel title="Payment methods" description="How customers are paying.">
          <div className={styles.list}>
            {payments.map((p, i) => (
              <MetricRow key={p.label} label={p.label} value={p.value} fillPercent={parseFloat(p.value)} color={`var(--color-chart-${i + 1})`} />
            ))}
          </div>
        </Panel>
      </div>

      <div className={styles.row2to1}>
        <Panel
          title="Top performing products"
          description="Products generating the highest revenue."
          actions={<Button variant="outline" size="sm">View all</Button>}
        >
          <Table<ProductRow> columns={columns} rows={products} rowKey={(r) => r.product} bordered={false} />
        </Panel>

        <Panel title="Refunds" description="Why customers are sending products back.">
          <div className={styles.miniStatsRow}>
            <div className={styles.miniStat}><span className={styles.miniStatLabel}>Refund rate</span><span className={styles.miniStatValue}>3.2%</span></div>
            <div className={styles.miniStat}><span className={styles.miniStatLabel}>Orders</span><span className={styles.miniStatValue}>186</span></div>
            <div className={styles.miniStat}><span className={styles.miniStatLabel}>Avg amount</span><span className={styles.miniStatValue}>$54</span></div>
          </div>
          <div className={styles.list}>
            {refundReasons.map((r) => (
              <MetricRow key={r.label} label={r.label} value={r.value} fillPercent={(parseFloat(r.value) / 32) * 100} color="var(--color-warning-solid)" />
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
