'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Briefcase, 
  BookOpen, 
  LogOut,
  Home,
  User,
  FileText,
  Users,
  Settings,
  BarChart3,
  Calendar,
  CheckSquare,
  Award,
  MessageSquare,
  Folder,
  Package,
  HelpCircle,
  Receipt,
  Menu,
  X,
  Building2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ImpersonationBanner from '@/components/ImpersonationBanner';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  role?: string;
}

interface NavItem {
  label: string;
  icon: any;
  path: string;
}

type IcmsTenantLink = {
  role: string
  adminPath: string
  tenant: { shortName: string; slug: string }
}

// Role-based navigation configuration
const getRoleNavigation = (role: string): NavItem[] => {
  const commonItems: NavItem[] = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Home', icon: Home, path: '/' }
  ];

  const roleSpecificItems: Record<string, NavItem[]> = {
    'super_admin': [
      ...commonItems,
      { label: 'Analytics', icon: BarChart3, path: '/dashboard/analytics' },
      { label: 'Users', icon: Users, path: '/dashboard/users' },
      { label: 'Roles', icon: Settings, path: '/dashboard/roles' },
      { label: 'Settings', icon: Settings, path: '/dashboard/settings' },
      { label: 'CMS', icon: Folder, path: '/dashboard/cms' },
      { label: 'LMS', icon: GraduationCap, path: '/dashboard/lms' },
      { label: 'ICMS Platform', icon: Building2, path: '/icms/platform' },
      { label: 'Audit Trail', icon: FileText, path: '/dashboard/audit' },
      { label: 'Payload Admin', icon: Settings, path: '/admin' },
      { label: 'Documents', icon: FileText, path: '/documents' },
    ],
    'admin': [
      ...commonItems,
      { label: 'Analytics', icon: BarChart3, path: '/dashboard/analytics' },
      { label: 'Users', icon: Users, path: '/dashboard/users' },
      { label: 'CMS', icon: Folder, path: '/dashboard/cms' },
      { label: 'LMS', icon: GraduationCap, path: '/dashboard/lms' },
      { label: 'ICMS Platform', icon: Building2, path: '/icms/platform' },
      { label: 'Audit Trail', icon: FileText, path: '/dashboard/audit' },
      { label: 'Documents', icon: FileText, path: '/documents' },
    ],
    'student': [
      ...commonItems,
      { label: 'Browse Courses', icon: BookOpen, path: '/courses' },
      { label: 'My learning', icon: BookOpen, path: '/student/my-courses' },
      { label: 'Assignments', icon: CheckSquare, path: '/student/assignments' },
      { label: 'Grades', icon: Award, path: '/student/grades' },
      { label: 'Resources', icon: Folder, path: '/student/resources' },
      { label: 'Certificates', icon: Award, path: '/student/certificates' }
    ],
    'instructor': [
      ...commonItems,
      { label: 'My Courses', icon: GraduationCap, path: '/instructor/courses' },
      { label: 'Students', icon: Users, path: '/instructor/students' },
      { label: 'Analytics', icon: BarChart3, path: '/instructor/analytics' },
      { label: 'Course Materials', icon: Folder, path: '/instructor/materials' }
    ],
    'consultant': [
      ...commonItems,
      { label: 'My Projects', icon: Briefcase, path: '/consultant/projects' },
      { label: 'Clients', icon: Users, path: '/consultant/clients' },
      { label: 'Appointments', icon: Calendar, path: '/consultant/appointments' },
      { label: 'Reports', icon: BarChart3, path: '/consultant/reports' },
      { label: 'Resources', icon: Folder, path: '/consultant/resources' }
    ],
    'subscriber': [
      ...commonItems,
      { label: 'My Subscriptions', icon: Package, path: '/subscriber/subscriptions' },
      { label: 'Resources', icon: Folder, path: '/subscriber/resources' },
      { label: 'Support', icon: HelpCircle, path: '/subscriber/support' }
    ],
    'client': [
      ...commonItems,
      { label: 'My Projects', icon: Briefcase, path: '/client/projects' },
      { label: 'Invoices', icon: Receipt, path: '/client/invoices' },
      { label: 'Documents', icon: FileText, path: '/client/documents' },
      { label: 'Support Tickets', icon: MessageSquare, path: '/client/support' },
      { label: 'Schedule Consultation', icon: Calendar, path: '/consultation' }
    ]
  };

  return roleSpecificItems[role] || commonItems;
};

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [icmsTenants, setIcmsTenants] = useState<IcmsTenantLink[]>([]);

  useEffect(() => {
    if (!user) {
      setIcmsTenants([])
      return
    }
    void (async () => {
      try {
        const res = await fetch('/api/icms/my-tenants', { credentials: 'include' })
        if (!res.ok) return
        const data = await res.json()
        setIcmsTenants(data.tenants || [])
      } catch {
        // ignore
      }
    })()
  }, [user])

  useEffect(() => {
    setIsSidebarOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!isSidebarOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isSidebarOpen])

  const handleLogout = () => {
    logout();
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navigationItems = user ? getRoleNavigation(user.role) : [];

  const isActivePath = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ImpersonationBanner />
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="w-full px-4 lg:px-8 py-4 max-w-[1920px] mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                aria-label="Toggle menu"
              >
                {isSidebarOpen ? (
                  <X className="w-6 h-6 text-gray-600" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600" />
                )}
              </button>

              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/assets/img/hth-logo.svg"
                  alt="Hyperion Tech Hub"
                  width={140}
                  height={40}
                  className="h-8 w-auto"
                />
              </Link>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              {icmsTenants[0] && (
                <Link
                  href={icmsTenants[0].adminPath}
                  className="hidden text-sm font-medium text-[#1A2BC2] hover:underline sm:inline"
                >
                  ICMS · {icmsTenants[0].tenant.shortName}
                </Link>
              )}
              <div className="text-sm text-gray-600">
                <span className="hidden sm:inline">Welcome, </span>
                <span className="text-[#1A2BC2] font-medium">{user?.fullName}</span>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-[#1A2BC2] text-[#1A2BC2] hover:bg-[#1A2BC2] hover:text-white"
              >
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 lg:hidden"
          onClick={toggleSidebar}
          aria-hidden
        />
      )}

      <div className="mx-auto w-full max-w-[1920px] px-4 py-4 sm:py-6 lg:px-8 lg:py-8">
        <div className="grid gap-6 lg:grid-cols-4 lg:gap-8">
          <aside
            className={`
              fixed inset-y-0 left-0 z-[70] w-[min(18rem,88vw)]
              transform transition-transform duration-300 ease-in-out
              lg:relative lg:inset-auto lg:z-auto lg:col-span-1 lg:w-auto
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
          >
            <div className="flex h-full flex-col overflow-y-auto bg-white p-6 shadow-lg lg:sticky lg:top-24 lg:h-auto lg:max-h-[calc(100vh-7rem)] lg:rounded-lg lg:shadow-sm">
              <div className="mb-6 flex items-center justify-between border-b pb-4 lg:hidden">
                <span className="font-semibold text-gray-900">Menu</span>
                <button type="button" onClick={toggleSidebar} aria-label="Close menu">
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActivePath(item.path);
                  
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        className={`w-full justify-start ${
                          active
                            ? 'bg-[#1A2BC2]/10 text-[#1A2BC2] hover:bg-[#1A2BC2]/20'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}

                {icmsTenants.length > 0 && (
                  <div className="mt-2 border-t border-gray-100 pt-4">
                    <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      ICMS tenants
                    </p>
                    {icmsTenants.map((t) => (
                      <Link
                        key={t.adminPath}
                        href={t.adminPath}
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start hover:bg-gray-100"
                        >
                          <Building2 className="mr-2 h-4 w-4" />
                          {t.tenant.shortName}
                        </Button>
                      </Link>
                    ))}
                  </div>
                )}
              </nav>

              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1A2BC2]/10">
                    <User className="h-5 w-5 text-[#1A2BC2]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{user?.fullName}</div>
                    <div className="truncate text-xs capitalize text-gray-500">
                      {user?.role.replace(/[-_]/g, ' ')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <main className="min-w-0 lg:col-span-3">
            {title && (
              <div className="mb-4 sm:mb-6">
                <h1 className="text-2xl text-[#1B1C1E] sm:text-3xl">{title}</h1>
              </div>
            )}
            <div className="min-w-0 overflow-x-auto">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
