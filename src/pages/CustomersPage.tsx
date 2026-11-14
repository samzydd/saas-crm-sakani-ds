import { useState } from 'react';
import { IconUsers, IconUserPlus, IconRepeat, IconHeart, IconUserMinus, IconUpload as Upload, IconTrendingUp as TrendingUp } from '@sakaniui/react/icons';
import { StatCard, AreaChart, DonutChart, Badge, Button, Table, Avatar, type BadgeVariant, type TableColumn } from '@sakaniui/react';
import { Panel } from '../components/Panel';
import { LegendRow } from '../components/LegendRow';
import { MetricRow } from '../components/MetricRow';
import { PeriodDropdown } from '../components/PeriodDropdown';
import { randomCustomers } from '../lib/randomChartData';
import { withFillPercent, withFillPercentByMax } from '../lib/withFillPercent';
import styles from './Page.module.css';

/* New and returning customers by month. */
const INITIAL_GROWTH = [
  { label: 'Jan', value: 940, value2: 2680 },
  { label: 'Feb', value: 1010, value2: 2810 },
  { label: 'Mar', value: 1075, value2: 2960 },
  { label: 'Apr', value: 1130, value2: 3120 },
  { label: 'May', value: 1210, value2: 3290 },
  { label: 'Jun', value: 1280, value2: 3470 },
];

/* The share of the 43,150 customers in each segment (so 43.2K in the middle). */
const segments = [
  { label: 'New', value: 38 },
  { label: 'Returning', value: 34 },
  { label: 'VIP', value: 16 },
  { label: 'At risk', value: 12 },
];

const channels = [
  { label: 'Organic search', value: '38%' },
  { label: 'Referral', value: '22%' },
  { label: 'Paid ads', value: '18%' },
  { label: 'Social', value: '14%' },
  { label: 'Email', value: '8%' },
];

/** `max` is each metric's own scale top (a 5-star rating, a 0-100 score, a rate out of 100), so a bar shows how strong
 * that metric is on its own scale, not how big its digits are next to the others. */
const satisfaction = [
  { label: 'Average rating', value: '4.8', max: 5 },
  { label: 'NPS score', value: '71', max: 100 },
  { label: 'Support CSAT', value: '92%', max: 100 },
  { label: 'Repeat purchase rate', value: '42%', max: 100 },
];

interface Person { name: string; email: string; avatar?: string; initials: string }

const people: Record<string, Person> = {
  sarah: { name: 'Sarah Williams', email: 'sarah.williams@example.com', avatar: '/avatars/sarah-williams.png', initials: 'SW' },
  michael: { name: 'Michael Evans', email: 'michael.evans@example.com', avatar: '/avatars/michael-evans.png', initials: 'ME' },
  emily: { name: 'Emily Johnson', email: 'emily.johnson@example.com', avatar: '/avatars/emily-johnson.png', initials: 'EJ' },
  liam: { name: 'Liam Carter', email: 'liam.carter@example.com', initials: 'LC' },
  olivia: { name: 'Olivia Carter', email: 'olivia.carter@example.com', initials: 'OC' },
  noah: { name: 'Noah Kim', email: 'noah.kim@example.com', initials: 'NK' },
  sophia: { name: 'Sophia Lee', email: 'sophia.lee@example.com', initials: 'SL' },
  ethan: { name: 'Ethan Walker', email: 'ethan.walker@example.com', initials: 'EW' },
};

const topCustomers = [
  { who: people.sarah, orders: '64 orders', value: '$18,450' },
  { who: people.michael, orders: '58 orders', value: '$16,980' },
  { who: people.emily, orders: '51 orders', value: '$15,630' },
  { who: people.liam, orders: '47 orders', value: '$14,820' },
];

type Segment = 'VIP' | 'New' | 'Returning' | 'At risk';
type Status = 'Active' | 'Inactive' | 'Churned';

interface RecentCustomer {
  customer: string;
  segment: Segment;
  orders: string;
  lifetimeValue: string;
  lastPurchase: string;
  status: Status;
}

const recentCustomers: RecentCustomer[] = [
  { customer: 'olivia', segment: 'VIP', orders: '38', lifetimeValue: '$9,482', lastPurchase: 'Today', status: 'Active' },
  { customer: 'noah', segment: 'New', orders: '2', lifetimeValue: '$248', lastPurchase: 'Yesterday', status: 'Active' },
  { customer: 'sophia', segment: 'Returning', orders: '11', lifetimeValue: '$2,318', lastPurchase: '3 days ago', status: 'Active' },
  { customer: 'ethan', segment: 'At risk', orders: '9', lifetimeValue: '$1,748', lastPurchase: '41 days ago', status: 'Inactive' },
  { customer: 'liam', segment: 'VIP', orders: '47', lifetimeValue: '$14,820', lastPurchase: '2 days ago', status: 'Active' },
  { customer: 'emily', segment: 'Returning', orders: '51', lifetimeValue: '$15,630', lastPurchase: '5 days ago', status: 'Active' },
];

const SEGMENT_VARIANT: Record<Segment, BadgeVariant> = { VIP: 'accent', New: 'info', Returning: 'neutral', 'At risk': 'warning' };
const STATUS_VARIANT: Record<Status, BadgeVariant> = { Active: 'success', Inactive: 'neutral', Churned: 'danger' };

const Who = ({ p }: { p: Person }) => (
  <span className={styles.identity}>
    <Avatar size="md" src={p.avatar} initials={p.avatar ? undefined : p.initials} alt={p.avatar ? p.name : undefined} />
    <span className={styles.identityText}>
      <span className={styles.identityName}>{p.name}</span>
      <span className={styles.identitySub}>{p.email}</span>
    </span>
  </span>
);

export function CustomersPage() {
  const [growth, setGrowth] = useState(INITIAL_GROWTH);

  const columns: TableColumn<RecentCustomer>[] = [
    { key: 'customer', header: 'Customer', render: (r) => <Who p={people[r.customer]} /> },
    { key: 'segment', header: 'Segment', width: '112px', render: (r) => <Badge variant={SEGMENT_VARIANT[r.segment]} emphasis="subtle">{r.segment}</Badge> },
    { key: 'orders', header: 'Orders', width: '80px', align: 'right', render: (r) => <span className={styles.num}>{r.orders}</span> },
    { key: 'lifetimeValue', header: 'Lifetime value', width: '128px', align: 'right', render: (r) => <span className={styles.num}>{r.lifetimeValue}</span> },
    { key: 'lastPurchase', header: 'Last purchase', width: '128px', render: (r) => <span className={styles.muted}>{r.lastPurchase}</span> },
    { key: 'status', header: 'Status', width: '96px', render: (r) => <Badge variant={STATUS_VARIANT[r.status]} emphasis="subtle">{r.status}</Badge> },
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

      {/* The delta's colour says whether the change is good: fewer returning customers is amber, a falling churn rate is green. */}
      <div className={styles.kpiRow}>
        <StatCard variant="icon" icon={IconUsers} title="Total customers" value="43,150" delta="8.3%" trend="up" description="vs last month" />
        <StatCard variant="icon" icon={IconUserPlus} title="New customers" value="1,280" delta="12.3%" trend="up" description="vs last month" />
        <StatCard variant="icon" icon={IconRepeat} title="Returning rate" value="68.2%" delta="3.8%" trend="down" badgeVariant="warning" description="vs last month" />
        <StatCard variant="icon" icon={IconHeart} title="Avg lifetime value" value="$1,482" delta="4.5%" trend="up" description="vs last month" />
        <StatCard variant="icon" icon={IconUserMinus} title="Churn rate" value="2.3%" delta="0.7%" trend="down" badgeVariant="success" description="vs last month" />
      </div>

      <div className={styles.row2to1}>
        <Panel
          title="Customer growth"
          description="New and returning customers by month."
          actions={<>
            <Badge variant="success" emphasis="subtle" rightIcon={<TrendingUp size={12} strokeWidth={2} />}>6.4% up this month</Badge>
            <PeriodDropdown onChange={() => setGrowth(randomCustomers())} />
          </>}
        >
          <AreaChart data={growth} variant="stacked" seriesLabels={['New customers', 'Returning']} size="lg" height={320} appearance="rich" />
          {/* the chart draws "value" in chart 5 and "value2" in chart 2: the legend uses the same tokens */}
          <div className={styles.chartLegend}>
            <span className={styles.chartLegendItem}><i style={{ background: 'var(--color-chart-5)' }} />New customers</span>
            <span className={styles.chartLegendItem}><i style={{ background: 'var(--color-chart-2)' }} />Returning</span>
          </div>
        </Panel>

        <Panel
          title="Customer segments"
          description="How the customer base breaks down."
          actions={
            <PeriodDropdown
              variant="outline"
              defaultValue="This month"
              options={['This month', 'Last month', 'This quarter', 'This year']}
              formatLabel={(v) => v}
            />
          }
        >
          <div className={styles.donutBlock}>
            <DonutChart data={segments} size="md" centerValue="43.2K" centerCaption="customers" appearance="rich" />
            <div className={styles.legendList}>
              {segments.map((s, i) => <LegendRow key={s.label} colorIndex={i + 1} label={s.label} value={`${s.value}%`} />)}
            </div>
          </div>
        </Panel>
      </div>

      <div className={styles.row3}>
        <Panel title="Acquisition channels" description="Where new customers find you.">
          <div className={styles.list}>
            {withFillPercent(channels).map((c, i) => (
              <MetricRow key={c.label} label={c.label} value={c.value} fillPercent={c.fillPercent} color={`var(--color-chart-${i + 1})`} />
            ))}
          </div>
          <Badge variant="info" emphasis="subtle" className={styles.footBadge}>4.8% visit-to-customer rate</Badge>
        </Panel>

        <Panel title="Customer satisfaction" description="Feedback and loyalty metrics.">
          <div className={styles.list}>
            {withFillPercentByMax(satisfaction).map((s) => (
              <MetricRow key={s.label} label={s.label} value={s.value} fillPercent={s.fillPercent} color="var(--color-success-solid)" />
            ))}
          </div>
        </Panel>

        <Panel title="Top customers" description="Highest-value customers by total spend.">
          <div className={styles.list}>
            {topCustomers.map((c) => (
              <div key={c.who.name} className={styles.rank}>
                <span className={styles.identity}>
                  <Avatar size="md" src={c.who.avatar} initials={c.who.avatar ? undefined : c.who.initials} alt={c.who.avatar ? c.who.name : undefined} />
                  <span className={styles.identityText}>
                    <span className={styles.identityName}>{c.who.name}</span>
                    <span className={styles.identitySub}>{c.orders}</span>
                  </span>
                </span>
                <span className={styles.rankValue}>{c.value}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel
        title="Recent customers"
        description="Recently active customer accounts."
        actions={<Button variant="outline" size="sm">View all</Button>}
      >
        <Table<RecentCustomer> columns={columns} rows={recentCustomers} rowKey={(r) => r.customer} bordered={false} />
      </Panel>
    </>
  );
}
