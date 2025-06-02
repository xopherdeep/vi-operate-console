// filepath: /Users/xopher/www/vi/operate/vi-operate-console/src/hooks/index.ts
// Feature-specific hooks from app directories

// Utility hooks from lib/hooks
export { useApiContent } from '../lib/hooks/useApiContent';
export { useDataContent } from '../lib/hooks/useDataContent';
export { useIsMobile } from '../lib/hooks/useIsMobile';
export { useFastRefreshState } from '../lib/hooks/useFastRefreshState';

// Component-specific hooks
export { useAppLauncher } from '../components/common/navigation/app-launcher/hooks/useAppLauncher';

// App-specific hooks that remain in the hooks directory
export { useAutomationTabs } from './useAutomations';
