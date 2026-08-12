import type { Meta, StoryObj } from '@storybook/react-vite';
import { PeriodDropdown } from './PeriodDropdown';

const meta = {
  title: 'App/PeriodDropdown',
  component: PeriodDropdown,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['ghost', 'outline'] },
  },
} satisfies Meta<typeof PeriodDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Ghost trigger — used inside chart panels (e.g. "Last 6 months"). */
export const Ghost: Story = { args: { variant: 'ghost' } };

/** Outline trigger — Figma's page-header filter button. */
export const Outline: Story = {
  args: {
    variant: 'outline',
    defaultValue: '30 days',
    options: ['7 days', '30 days', '90 days'],
    formatLabel: (v) => `Last ${v}`,
  },
};

/** Full label strings as options, rendered verbatim (no "Last {value}" prefix). */
export const CustomLabels: Story = {
  args: {
    variant: 'outline',
    defaultValue: 'This month',
    options: ['This month', 'Last month', 'This quarter', 'This year'],
    formatLabel: (v) => v,
  },
};
