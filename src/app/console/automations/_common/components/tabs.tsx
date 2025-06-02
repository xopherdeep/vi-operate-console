
import BigButtonTabs from '@/components/common/patterns/tabs/big-button-tabs';
import { useAutomationTabs } from '@/app/console/automations/_common/hooks/useAutomations';

export default function AutomationTabs() {
  const { tabs } = useAutomationTabs();

  return <BigButtonTabs tabs={tabs} />;
}
