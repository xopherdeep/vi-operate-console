'use client';

import { useAgents } from './hooks/useAgents';
import { useApiContent, useDataContent } from '@/hooks';
import { useCronJobs } from './hooks/useCronJobs';
import { useEvents } from './hooks/useEvents';
import { useWorkflows } from './hooks/useWorkflows';

import { CardIcon } from '@/components/common/patterns/cards/card-icon';
import { Cog, Flower, Calendar, Layers, Cpu, Link2, Grid } from 'lucide-react';
import CardList, { mapCardIcon } from '@/components/common/patterns/lists/card-list';
import { useRouter } from 'next/navigation';


export function WorkflowsList() {
  const router = useRouter();
  const { workflows } = useWorkflows();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {workflows.map(mapCardIcon(<Flower />))}

      <CardIcon
        title="Create New Workflow"
        icon={<Flower />}
        onClick={() => router.push('/console/automations/create')}
        className="border-dashed border-2 cursor-pointer hover:shadow-md transition-all"
      >
        Build a custom workflow to automate your processes
      </CardIcon>
    </div>
  );
}

export function AgentsList() {
  const { agents } = useAgents();
  return <CardList icon={<Cpu />} data={agents} />;
}

export function CronsList() {
  const { cronJobs } = useCronJobs();
  const router = useRouter();
  return <CardList icon={<Calendar />} data={cronJobs} />;
}

export function EventsList() {
  const { events } = useEvents();
  return <CardList icon={<Layers />} data={events} />;
}

export function DataList() {
  const { dataContent } = useDataContent();
  return <CardList icon={<Grid />} data={dataContent} />;
}

export function ApiList() {
  const { apiContent } = useApiContent();
  return <CardList icon={<Cog />} data={apiContent} />;
}
