import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, Button } from 'sakani-design-system';
import { Panel } from './Panel';

const meta = {
  title: 'App/Panel',
  component: Panel,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    title: 'Panel title',
    description: 'A short supporting description of this panel.',
  },
  decorators: [(Story) => <div style={{ maxWidth: 420 }}><Story /></div>],
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <p style={{ margin: 0, color: 'var(--color-fg-muted)' }}>Panel content goes here.</p>,
  },
};

export const WithActions: Story = {
  args: {
    actions: <>
      <Badge variant="success" emphasis="subtle">This month</Badge>
      <Button variant="outline" size="sm">View report</Button>
    </>,
    children: <p style={{ margin: 0, color: 'var(--color-fg-muted)' }}>Panel content goes here.</p>,
  },
};

/** Title + actions share one top-aligned row, description drops to its own
 * full-width line below — used by list/table panels. */
export const ActionsInline: Story = {
  args: {
    actionsInline: true,
    actions: <Button variant="outline" size="sm">View all</Button>,
    children: <p style={{ margin: 0, color: 'var(--color-fg-muted)' }}>Panel content goes here.</p>,
  },
};
