import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../../src/components/ui/input';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'search', 'tel', 'url', 'date', 'time', 'file'],
    },
    disabled: {
      control: 'boolean',
    },
    placeholder: {
      control: 'text',
    },
    required: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text here...',
    type: 'text',
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'email@example.com',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password...',
  },
};

export const Number: Story = {
  args: {
    type: 'number',
    placeholder: '0',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <label htmlFor="input-with-label" className="text-sm font-medium">Email</label>
      <Input id="input-with-label" placeholder="Email address" {...args} />
    </div>
  ),
};

export const WithHelperText: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <label htmlFor="input-with-text" className="text-sm font-medium">Username</label>
      <Input id="input-with-text" placeholder="Username" {...args} />
      <p className="text-sm text-muted-foreground">This will be your public display name.</p>
    </div>
  ),
};

export const File: Story = {
  args: {
    type: 'file',
    className: 'cursor-pointer',
  },
};

export const WithError: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <label htmlFor="input-with-error" className="text-sm font-medium">Email</label>
      <Input 
        id="input-with-error" 
        placeholder="Email address" 
        aria-invalid="true" 
      />
      <p className="text-sm text-destructive">Please enter a valid email address.</p>
    </div>
  ),
};