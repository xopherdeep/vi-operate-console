import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from '../../src/components/ui/checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    checked: false,
  },
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" {...args} />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Accept terms and conditions
      </label>
    </div>
  ),
};

export const WithHelperText: Story = {
  render: (args) => (
    <div className="grid gap-1.5">
      <div className="flex items-center space-x-2">
        <Checkbox id="marketing" {...args} />
        <label
          htmlFor="marketing"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Marketing emails
        </label>
      </div>
      <p className="text-sm text-muted-foreground">
        Receive emails about new products, features, and more.
      </p>
    </div>
  ),
};

export const FormGroup: Story = {
  render: () => (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <label className="text-base font-medium">Notify me about...</label>
        <div className="grid gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="all-updates" />
            <label
              htmlFor="all-updates"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              All updates
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="mentions" defaultChecked />
            <label
              htmlFor="mentions"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Mentions & replies
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="direct-messages" />
            <label
              htmlFor="direct-messages"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Direct messages
            </label>
          </div>
        </div>
      </div>
    </div>
  ),
};