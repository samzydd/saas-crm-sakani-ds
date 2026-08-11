import { useState } from 'react';
import { Search, Eye, ShoppingCart, CheckCircle2, Star, Gauge, MessageCircle } from 'lucide-react';
import { StatCard, LineChart, DonutChart, Badge, Button, Table, Avatar, type TableColumn } from 'sakani-design-system';
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
  { icon: Star, label: 'Average rating', value: '4.8' },
  { icon: Gauge, label: 'NPS score', value: '71' },
  { icon: MessageCircle, label: 'Response rate', value: '18%' },
  { icon: Star, label: 'Reviews', value: '14%' },
];

const topCustomers = [
  { label: 'Sarah Wilson', value: '$18,450' },
  { label: 'Noah Smith', value: '$16,980' },
  { label: 'Emma Davis', value: '$15,630' },
  { label: 'Liam Carter', value: '$14,820' },
];

interface Customer {
  name: string;
  email: string;
  segment: 'New' | 'Returning' | 'VIP' | 'At risk';
  lifetimeValue: string;
  lastOrder: string;
}

const SEGMENT_VARIANT = {
  New: 'info', Returning: 'accent', VIP: 'success', 'At risk': 'warning',
} as const;

const customers: Customer[] = [
  { name: 'Sarah Wilson', email: 'sarah.wilson@example.com', segment: 'VIP', lifetimeValue: '$18,450', lastOrder: '2 days ago' },
  { name: 'Noah Smith', email: 'noah.smith@example.com', segment: 'Returning', lifetimeValue: '$16,980', lastOrder: '5 days ago' },
  { name: 'Emma Davis', email: 'emma.davis@example.com', segment: 'VIP', lifetimeValue: '$15,630', lastOrder: '1 day ago' },
  { name: 'Liam Carter', email: 'liam.carter@example.com', segment: 'Returning', lifetimeValue: '$14,820', lastOrder: '1 week ago' },
  { name: 'Olivia Martin', email: 'olivia.martin@example.com', segment: 'New', lifetimeValue: '$2,140', lastOrder: '3 days ago' },
  { name: 'James Anderson', email: 'james.anderson@example.com', segment: 'At risk', lifetimeValue: '$4,920', lastOrder: '2 months ago' },
];

export function CustomersPage() {
  const [growth, setGrowth] = useState(INITIAL_GROWTH);
  const columns: TableColumn<Customer>[] = [
    {
      key: 'name', header: 'Customer',
      render: (r) => (
        <span className={styles.customerCell}>
          <Avatar size="sm" initials={r.name.split(' ').map((n) => n[0]).join('')} />
          <span>
            <div className={styles.customerName}>{r.name}</div>
            <div className={styles.customerEmail}>{r.email}</div>
          </span>
        </span>
      ),
    },
    {
      key: 'segment', header: 'Segment',
      render: (r) => <Badge variant={SEGMENT_VARIANT[r.segment]} emphasis="subtle">{r.segment}</Badge>,
    },
    { key: 'lifetimeValue', header: 'Lifetime value', align: 'right' },
    { key: 'lastOrder', header: 'Last order' },
  ];

  return (
    <>
      <div className={styles.kpiRow}>
        <StatCard title="Total customers" value="43,150" delta="8.3%" trend="up" description="vs last month" />
        <StatCard title="New customers" value="1,280" delta="12.3%" trend="up" description="vs last month" />
        <StatCard title="Returning customers" value="68.2%" delta="3.8%" trend="flat" description="vs last month" />
        <StatCard title="Avg lifetime value" value="$1,482" delta="4.5%" trend="up" description="vs last month" />
        <StatCard title="Churn rate" value="2.3%" delta="0.7%" trend="up" description="vs last month" />
      </div>

      <div className={styles.chartsRow2}>
        <Panel
          title="Customer growth"
          description="Monitor customer growth over time."
          actions={<>
            <Badge variant="success" emphasis="subtle">This month</Badge>
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
          description="Breakdown of customers by lifecycle stage."
          actions={<>
            <Badge variant="neutral" emphasis="subtle">This month</Badge>
            <Button variant="outline" size="sm">View report</Button>
          </>}
        >
          <div className={styles.chartLegendRow}>
            <div className={styles.chartFixed} style={{ width: 200 }}>
              <DonutChart data={segments} size="md" />
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
        <Panel title="Acquisition funnel" description="From first touch to completed purchase.">
          <div className={styles.metricPanel}>
            {funnel.map((f) => (
              <MetricRow key={f.label} icon={<f.icon size={16} strokeWidth={1.5} />} label={f.label} value={f.value} />
            ))}
          </div>
          <Badge variant="info" emphasis="subtle" className={`${styles.hugContent} ${styles.conversionBadge}`}>4.9% overall conversion</Badge>
        </Panel>

        <Panel title="Customer satisfaction" description="Feedback and support performance.">
          <div className={styles.metricPanel}>
            {satisfaction.map((s) => (
              <MetricRow key={s.label} icon={<s.icon size={16} strokeWidth={1.5} />} label={s.label} value={s.value} />
            ))}
          </div>
        </Panel>

        <Panel title="Top customers" description="Highest lifetime spend this period.">
          <div className={styles.metricPanel}>
            {topCustomers.map((c) => (
              <MetricRow key={c.label} label={c.label} value={c.value} />
            ))}
          </div>
        </Panel>
      </div>

      <Panel
        title="All customers"
        description="Complete customer directory."
        actions={<Button variant="outline" size="sm">View all</Button>}
        actionsInline
      >
        <Table<Customer> columns={columns} rows={customers} rowKey={(r) => r.email} />
      </Panel>
    </>
  );
}
