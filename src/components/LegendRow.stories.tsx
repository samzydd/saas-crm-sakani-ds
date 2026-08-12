import type { Meta, StoryObj } from '@storybook/react-vite';
import { LegendRow } from './LegendRow';

const meta = {
  title: 'App/LegendRow',
  component: LegendRow,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { colorIndex: 1, label: 'Website', value: '48%' },
} satisfies Meta<typeof LegendRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const List: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <LegendRow colorIndex={1} label="Website" value="48%" />
      <LegendRow colorIndex={2} label="Mobile app" value="27%" />
      <LegendRow colorIndex={3} label="Marketplace" value="18%" />
      <LegendRow colorIndex={4} label="Retail" value="7%" />
    </div>
  ),
};
