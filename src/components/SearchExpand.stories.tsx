import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchExpand } from './SearchExpand';

const meta = {
  title: 'App/SearchExpand',
  component: SearchExpand,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SearchExpand>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Ghost/sm icon button (32x32) that expands into a 240px text input on
 * click, collapsing back once it loses focus with nothing typed. */
export const Default: Story = {};
