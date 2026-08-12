import type { Meta, StoryObj } from '@storybook/react-vite';
import { Eye } from 'lucide-react';
import { MetricRow } from './MetricRow';

const meta = {
  title: 'App/MetricRow',
  component: MetricRow,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { label: 'Product view', value: '118,700' },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}><Story /></div>],
} satisfies Meta<typeof MetricRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithIcon: Story = {
  args: { icon: <Eye size={16} strokeWidth={1.5} /> },
};

export const WithFill: Story = {
  args: { icon: <Eye size={16} strokeWidth={1.5} />, fillPercent: 45 },
};

export const MutedValue: Story = {
  args: { label: 'Sarah Wilson', value: '$18,450', valueMuted: true },
};

export const List: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <MetricRow icon={<Eye size={16} strokeWidth={1.5} />} label="Visitors" value="248,900" fillPercent={60} />
      <MetricRow icon={<Eye size={16} strokeWidth={1.5} />} label="Product view" value="118,700" fillPercent={29} />
      <MetricRow icon={<Eye size={16} strokeWidth={1.5} />} label="Added to cart" value="43,600" fillPercent={11} />
    </div>
  ),
};
