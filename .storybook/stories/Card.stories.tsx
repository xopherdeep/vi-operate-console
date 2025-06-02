import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent } from '../../src/components/ui/card';
import { Button } from '../../src/components/ui/button';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Simple: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the main content area of the card.</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card with Action</CardTitle>
        <CardDescription>This card has an action button</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">Action</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>Content with an action button in the header.</p>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Submit</Button>
      </CardFooter>
    </Card>
  ),
};

export const ImageCard: Story = {
  render: () => (
    <Card className="w-[350px] overflow-hidden">
      <div className="h-[200px] bg-muted flex items-center justify-center">
        <span className="text-muted-foreground">Image placeholder</span>
      </div>
      <CardHeader>
        <CardTitle>Image Card</CardTitle>
        <CardDescription>A card with an image at the top</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card has an image placeholder above the header.</p>
      </CardContent>
    </Card>
  ),
};

export const Borderless: Story = {
  render: () => (
    <Card className="w-[350px] border-0 bg-transparent shadow-none">
      <CardHeader>
        <CardTitle>Borderless Card</CardTitle>
        <CardDescription>A card without borders or background</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card has no borders or background.</p>
      </CardContent>
    </Card>
  ),
};