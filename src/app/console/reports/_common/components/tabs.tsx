import BigButtonTabs from '@/components/common/patterns/tabs/big-button-tabs';
import { useReportTabs } from '@/hooks';

export default function ReportTabs() {
  const { tabs } = useReportTabs();

  return <BigButtonTabs tabs={tabs} />;
}
