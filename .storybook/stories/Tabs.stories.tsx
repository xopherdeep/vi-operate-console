import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../tabs';

const meta: Meta<typeof Tabs> = {
  title: 'UI/Tabs',
  component: Tabs,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="p-4">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Account Settings</h3>
          <p className="text-sm text-muted-foreground">
            Update your account settings. Set your preferred language and timezone.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="password" className="p-4">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Password Settings</h3>
          <p className="text-sm text-muted-foreground">
            Change your password here. After saving, you'll be logged out.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="settings" className="p-4">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">App Settings</h3>
          <p className="text-sm text-muted-foreground">
            Configure your app settings. Manage your notifications and data preferences.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings" disabled>Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="p-4">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Account Settings</h3>
          <p className="text-sm text-muted-foreground">
            This tab is active. The Settings tab is disabled.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="password" className="p-4">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Password Settings</h3>
          <p className="text-sm text-muted-foreground">
            Change your password here. After saving, you'll be logged out.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="settings" className="p-4">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">App Settings</h3>
          <p className="text-sm text-muted-foreground">
            This content won't be visible because the tab is disabled.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const VerticalTabs: Story = {
  render: () => (
    <Tabs defaultValue="dashboard" orientation="vertical" className="w-[400px] flex">
      <TabsList className="flex-col h-auto p-1">
        <TabsTrigger value="dashboard" className="justify-start">Dashboard</TabsTrigger>
        <TabsTrigger value="analytics" className="justify-start">Analytics</TabsTrigger>
        <TabsTrigger value="reports" className="justify-start">Reports</TabsTrigger>
      </TabsList>
      <div className="grow pl-4">
        <TabsContent value="dashboard" className="p-4 h-full">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Dashboard</h3>
            <p className="text-sm text-muted-foreground">
              View your dashboard metrics and key performance indicators.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="p-4 h-full">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Analytics</h3>
            <p className="text-sm text-muted-foreground">
              View detailed analytics and trends for your data.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="reports" className="p-4 h-full">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Reports</h3>
            <p className="text-sm text-muted-foreground">
              View and generate reports based on your data.
            </p>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  ),
};