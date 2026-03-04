import { UserMenu } from '@/components/user-menu';
import { Sidebar } from '@/components/sidebar';
import { MobileNav } from '@/components/mobile-nav';
import { SidebarProvider } from '@/components/sidebar-context';
import { Breadcrumbs } from '@/components/breadcrumbs';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex flex-1 flex-col">
          {/* Top bar */}
          <header className="flex h-14 items-center justify-between border-b px-4 md:px-6">
            <div className="flex items-center gap-3">
              <MobileNav />
              <Breadcrumbs />
            </div>
            <div className="flex items-center gap-2">
              <UserMenu />
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
