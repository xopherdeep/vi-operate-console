import BigButtonTabs from '@/components/common/patterns/tabs/big-button-tabs';
import { useAutomationTabs } from '@/hooks';

export default function AutomationTabs() {
  const { tabs } = useAutomationTabs();

  return <BigButtonTabs tabs={tabs} />;
}
