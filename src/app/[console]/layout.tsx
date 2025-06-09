'use client';

import { Analytics } from '@vercel/analytics/react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import Providers from './dashboards/_common/components/providers';
import { DynamicBreadcrumb } from '@/components/common/navigation/dynamic-breadcrumb';
import { AppLauncher } from '@/components/common/navigation/app-launcher/app-launcher';

// Dynamically imported components
const User = dynamic(() => import('./dashboards/_common/components/user').then(mod => mod.ClientUser));
const DesktopNav = dynamic(() => import('@/components/common/navigation/desktop-nav'));
const MobileNav = dynamic(() => import('@/components/common/navigation/mobile-nav'));

// Header component extracted for cleaner layout
const Header = () => (
  <header className="header">
    <MobileNav />
    <DynamicBreadcrumb />
    <div className="flex flex-grow" />
    <div className="flex items-center gap-2">
      <User />
      <AppLauncher />
    </div>
  </header>
);

export default function ConsoleLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isConsolePage = pathname === '/console';
  
  // Simplified class assignment
  const mainClasses = `grid flex-1 items-start ${
    isConsolePage ? '' : 'gap-2 p-4 sm:px-12 sm:py-12 md:gap-4'
  } bg-muted/40`;

  return (
    <Providers>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <DesktopNav />
        <div className="flex flex-col gap-0 sm:ml-24">
          {!isConsolePage && <Header />}
          <main className={mainClasses}>
            {children}
          </main>
        </div>
        <Analytics />
      </div>
    </Providers>
  );
}
