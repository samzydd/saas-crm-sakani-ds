import { ShoppingBag, UserPlus, MessageSquare, RefreshCw, TrendingUp } from 'lucide-react';
import { StatCard, BarChart, LineChart, DonutChart, Badge, Button, Table, Avatar, type TableColumn } from 'sakani-design-system';
import { Panel } from '../components/Panel';
import { LegendRow } from '../components/LegendRow';
import { PeriodDropdown } from '../components/PeriodDropdown';
import styles from './Page.module.css';

const revenue = [
  { label: 'Jan', revenue: 320000 },
  { label: 'Feb', revenue: 356000 },
  { label: 'Mar', revenue: 341000 },
  { label: 'Apr', revenue: 398000 },
  { label: 'May', revenue: 412000 },
  { label: 'Jun', revenue: 452000 },
];

const growth = [
  { label: 'Jan', Acquisition: 4200, Retention: 3800 },
  { label: 'Feb', Acquisition: 4600, Retention: 3950 },
  { label: 'Mar', Acquisition: 4400, Retention: 4100 },
  { label: 'Apr', Acquisition: 5100, Retention: 4300 },
  { label: 'May', Acquisition: 5400, Retention: 4550 },
  { label: 'Jun', Acquisition: 5900, Retention: 4800 },
];

const channels = [
  { label: 'Website', value: 48 },
  { label: 'Mobile app', value: 27 },
  { label: 'Marketplace', value: 18 },
  { label: 'Retail', value: 7 },
];

interface Order {
  order: string;
  customer: string;
  amount: string;
  payment: string;
  status: 'Active' | 'Failed' | 'Pending' | 'Completed';
}

const orders: Order[] = [
  { order: 'ORD-2481', customer: 'Olivia Carter', amount: '$482', payment: 'Visa', status: 'Active' },
  { order: 'ORD-2482', customer: 'Noah Kim', amount: '$124', payment: 'Paypal', status: 'Failed' },
  { order: 'ORD-2483', customer: 'Sophia Lee', amount: '$318', payment: 'Mastercard', status: 'Pending' },
  { order: 'ORD-2484', customer: 'Ethan Walker', amount: '$1,248', payment: 'Apple Pay', status: 'Completed' },
  { order: 'ORD-2485', customer: 'Amelia Brown', amount: '$86', payment: 'Visa', status: 'Active' },
  { order: 'ORD-2486', customer: 'Lucas Wilson', amount: '$212', payment: 'Mastercard', status: 'Completed' },
];

const STATUS_VARIANT = {
  Active: 'success', Failed: 'danger', Pending: 'warning', Completed: 'neutral',
} as const;

const activity = [
  { name: 'Emily Johnson', text: 'created a new product.', icon: ShoppingBag },
  { name: 'Noah Kim', text: 'signed up as a new customer.', icon: UserPlus },
  { name: 'Sophia Lee', text: 'left a review on Order #2483.', icon: MessageSquare },
  { name: 'Ethan Walker', text: 'requested a refund for Order #2484.', icon: RefreshCw },
];

export function DashboardPage() {
  const columns: TableColumn<Order>[] = [
    { key: 'order', header: 'Order' },
    { key: 'customer', header: 'Customer' },
    { key: 'amount', header: 'Amount', align: 'right' },
    { key: 'payment', header: 'Payment' },
    {
      key: 'status', header: 'Status',
      render: (r) => <Badge variant={STATUS_VARIANT[r.status]} emphasis="subtle">{r.status}</Badge>,
    },
  ];

  return (
    <>
      <div className={styles.kpiRow}>
        <StatCard title="Total revenue" value="$2,483,920" delta="18.2%" trend="up" description="vs last month" />
        <StatCard title="Net profit" value="$712,480" delta="12.2%" trend="up" description="vs last month" />
        <StatCard title="Orders today" value="18,432" delta="9.8%" trend="up" description="vs last month" />
        <StatCard title="Active customers" value="24,981" delta="1.5%" trend="up" description="vs last month" />
      </div>

      <div className={styles.threeCol}>
        <Panel title="Revenue trend" description="Track monthly revenue growth and identify sales trends." className={styles.panelCanvas}>
          <div className={styles.panelActionsRow}>
            <span className={styles.trendIndicator}>
              <TrendingUp size={14} strokeWidth={2} />
              6.4% up this month
            </span>
            <PeriodDropdown />
          </div>
          <div className={styles.chartH176}>
            <BarChart data={revenue.map((r) => ({ label: r.label, value: r.revenue }))} size="sm" />
          </div>
        </Panel>

        <Panel title="Customer growth" description="Measures customer acquisition, retention, and overall audience growth over time." className={styles.panelCanvas}>
          <div className={styles.panelActionsRow}>
            <span className={styles.trendIndicator}>
              <TrendingUp size={14} strokeWidth={2} />
              1.4% this month
            </span>
            <PeriodDropdown />
          </div>
          <div className={styles.chartH176}>
            <LineChart data={growth} series={['Acquisition', 'Retention']} size="sm" />
          </div>
          <div className={styles.legendRowInline}>
            <span className={styles.legendItem}><span className={styles.dot} style={{ background: 'var(--color-chart-1)' }} />Acquisition</span>
            <span className={styles.legendItem}><span className={styles.dot} style={{ background: 'var(--color-chart-2)' }} />Retention</span>
          </div>
        </Panel>

        <Panel title="Sales channel" description="Compare revenue contribution across your primary sales channels." className={styles.panelCanvas}>
          <div className={styles.panelActionsRow}>
            <Badge variant="neutral" emphasis="subtle">This month</Badge>
          </div>
          <div className={styles.chartLegendRow}>
            <div className={styles.chartFixed} style={{ width: 160 }}>
              <DonutChart data={channels} size="sm" centerValue="$2.44M" centerCaption="of revenue" />
            </div>
            <div className={styles.legendList}>
              {channels.map((c, i) => (
                <LegendRow key={c.label} colorIndex={i + 1} label={c.label} value={`${c.value}%`} />
              ))}
            </div>
          </div>
        </Panel>
      </div>

      <div className={styles.ordersActivityRow}>
      <Panel title="Recent orders" description="Track recent customer purchases and order progress.">
        <div className={styles.panelActionsRow}>
          <span />
          <Button variant="ghost" size="sm">View all</Button>
        </div>
        <Table<Order> columns={columns} rows={orders} rowKey={(r) => r.order} />
      </Panel>

      <Panel title="Recent activity" description="Latest system and team activity.">
        <div className={styles.activityList}>
          {activity.map((a, i) => {
            const Icon = a.icon;
            return (
              <div key={i} className={styles.activityRow}>
                <Avatar size="sm" initials={a.name.split(' ').map((n) => n[0]).join('')} />
                <p className={styles.activityText}>
                  <strong>{a.name}</strong> <span className={styles.activityMuted}>{a.text}</span>
                </p>
                <Icon size={18} strokeWidth={1.5} className={styles.activityIcon} />
              </div>
            );
          })}
        </div>
      </Panel>
      </div>
    </>
  );
}
