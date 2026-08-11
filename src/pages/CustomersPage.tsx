import { useState } from 'react';
import { Search, Eye, ShoppingCart, CheckCircle2, TrendingUp, Upload } from 'lucide-react';
import { StatCard, LineChart, DonutChart, Badge, Button, Table, type TableColumn } from 'sakani-design-system';
import { Panel } from '../components/Panel';
import { LegendRow } from '../components/LegendRow';
import { MetricRow } from '../components/MetricRow';
import { PeriodDropdown } from '../components/PeriodDropdown';
import { randomGrowth } from '../lib/randomChartData';
import styles from './Page.module.css';

const INITIAL_GROWTH = [
  { label: 'Jan', Acquisition: 3200, Retention: 2900 },
  { label: 'Feb', Acquisition: 3450, Retention: 3050 },
  { label: 'Mar', Acquisition: 3600, Retention: 3200 },
  { label: 'Apr', Acquisition: 3900, Retention: 3400 },
  { label: 'May', Acquisition: 4150, Retention: 3650 },
  { label: 'Jun', Acquisition: 4400, Retention: 3900 },
];

const segments = [
  { label: 'New', value: 38 },
  { label: 'Returning', value: 34 },
  { label: 'VIP', value: 16 },
  { label: 'At risk', value: 12 },
];

const funnel = [
  { icon: Search, label: 'Organic search', value: '248,900' },
  { icon: Eye, label: 'Product view', value: '118,700' },
  { icon: ShoppingCart, label: 'Added to cart', value: '43,600' },
  { icon: CheckCircle2, label: 'Checkout started', value: '26,900' },
  { icon: CheckCircle2, label: 'Purchases', value: '12,100' },
];

const satisfaction = [
  { label: 'Average rating', value: '4.8' },
  { label: 'NPS score', value: '71' },
  { label: 'Response rate', value: '18%' },
  { label: 'Reviews', value: '14%' },
];

const topCustomers = [
  { label: 'Sarah Wilson', value: '$18,450' },
  { label: 'Noah Smith', value: '$16,980' },
  { label: 'Emma Davis', value: '$15,630' },
  { label: 'Liam Carter', value: '$14,820' },
];

interface RecentCustomer {
  order: string;
  customer: string;
  spend: string;
  latestPurchase: string;
  status: string;
}

const recentCustomers: RecentCustomer[] = [
  { order: 'ORD-2481', customer: 'Olivia Carter', spend: '$482', latestPurchase: 'Visa', status: 'Active' },
  { order: 'ORD-2482', customer: 'Noah Kim', spend: '$124', latestPurchase: 'Paypal', status: 'Active' },
  { order: 'ORD-2483', customer: 'Sophia Lee', spend: '$318', latestPurchase: 'Mastercard', status: 'Active' },
  { order: 'ORD-2484', customer: 'Ethan Walker', spend: '$1,248', latestPurchase: 'Apple Pay', status: 'Active' },
  { order: 'ORD-2485', customer: 'Amelia Brown', spend: '$86', latestPurchase: 'Visa', status: 'Active' },
  { order: 'ORD-2486', customer: 'Lucas Wilson', spend: '$212', latestPurchase: 'Paypal', status: 'Active' },
];

export function CustomersPage() {
  const [growth, setGrowth] = useState(INITIAL_GROWTH);
  const columns: TableColumn<RecentCustomer>[] = [
    { key: 'order', header: 'Order' },
    { key: 'customer', header: 'Customer' },
    { key: 'spend', header: 'Spend', align: 'right' },
    {
      key: 'latestPurchase', header: 'Latest purchase', align: 'center',
      render: (r) => <Badge variant="neutral" emphasis="subtle">{r.latestPurchase}</Badge>,
    },
    {
      key: 'status', header: 'Status', align: 'center',
      render: (r) => <Badge variant="neutral" emphasis="subtle">{r.status}</Badge>,
    },
  ];

  return (
    <>
      <div className={styles.pageHeaderRow}>
        <p className={styles.pageHeaderDesc}>Understand customer growth, engagement, and lifetime value.</p>
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

      <div className={styles.kpiRow}>
        <StatCard title="Total customers" value="43,150" delta="8.3%" trend="up" description="vs last month" />
        <StatCard title="New customers" value="1,280" delta="12.3%" trend="up" description="vs last month" />
        <StatCard title="Returning customers" value="68.2%" delta="3.8%" trend="flat" description="vs last month" />
        <StatCard title="Avg lifetime value" value="$1,482" delta="4.5%" trend="up" description="vs last month" />
        <StatCard title="Churn rate" value="2.3%" delta="0.7%" trend="up" description="vs last month" />
      </div>

      <div className={`${styles.chartsRow2} ${styles['chartsRow2--customers']}`}>
        <Panel
          title="Customer growth"
          description="Monitor customer growth over time."
          actions={<>
            <Badge variant="success" emphasis="subtle" rightIcon={<TrendingUp size={12} strokeWidth={2} />}>6.4% up this month</Badge>
            <PeriodDropdown onChange={() => setGrowth(randomGrowth())} />
          </>}
        >
          <LineChart data={growth} series={['Acquisition', 'Retention']} size="md" />
          <div className={styles.legendRowInline}>
            <span className={styles.legendItem}><span className={styles.dot} style={{ background: 'var(--color-chart-1)' }} />Acquisition</span>
            <span className={styles.legendItem}><span className={styles.dot} style={{ background: 'var(--color-chart-2)' }} />Retention</span>
          </div>
        </Panel>

        <Panel
          title="Customer segments"
          description="Distribution of customer types."
          actions={<>
            <Badge variant="success" emphasis="subtle" rightIcon={<TrendingUp size={12} strokeWidth={2} />}>1.4% this month</Badge>
            <PeriodDropdown
              variant="outline"
              defaultValue="This month"
              options={['This month', 'Last month', 'This quarter', 'This year']}
              formatLabel={(v) => v}
            />
          </>}
        >
          <div className={styles.chartLegendRow}>
            <div className={styles.chartFixed} style={{ width: 200 }}>
              <DonutChart data={segments} size="md" centerValue="400.1K" centerCaption="total customers" />
            </div>
            <div className={styles.legendList}>
              {segments.map((s, i) => (
                <LegendRow key={s.label} colorIndex={i + 1} label={s.label} value={`${s.value}%`} />
              ))}
            </div>
          </div>
        </Panel>
      </div>

      <div className={styles.threeCol}>
        <Panel title="Customer acquisition" description="Customer progression from visit to purchase.">
          <div className={styles.metricPanel}>
            {funnel.map((f) => (
              <MetricRow key={f.label} icon={<f.icon size={16} strokeWidth={1.5} />} label={f.label} value={f.value} />
            ))}
          </div>
          <Badge variant="info" emphasis="subtle" className={`${styles.hugContent} ${styles.conversionBadge}`}>4.8% Conversion rate</Badge>
        </Panel>

        <Panel title="Customer Satisfaction" description="Customer feedback and loyalty metrics.">
          <div className={styles.metricPanel}>
            {satisfaction.map((s) => (
              <MetricRow key={s.label} label={s.label} value={s.value} />
            ))}
          </div>
        </Panel>

        <Panel title="Top Customers" description="Highest-value customers by total spend.">
          <div className={styles.metricPanel}>
            {topCustomers.map((c) => (
              <MetricRow key={c.label} label={c.label} value={c.value} valueMuted />
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Recent customers" description="Recently active customer accounts">
        <Table<RecentCustomer> columns={columns} rows={recentCustomers} rowKey={(r) => r.order} />
      </Panel>
    </>
  );
}
