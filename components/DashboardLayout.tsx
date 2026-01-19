'use client';

import { ReactNode, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
  CreditCard,
  ClipboardList,
  Menu,
  X,
  Package,
  HelpCircle,
  Receipt
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

interface NavItem {
  label: string;
  icon: any;
  path: string;
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
      { label: 'User Management', icon: Users, path: '/admin/user-management' },
      { label: 'Documents', icon: FileText, path: '/documents' },
      { label: 'Reports & Analytics', icon: BarChart3, path: '/admin/reports' },
      { label: 'System Settings', icon: Settings, path: '/admin/system-settings' },
      { label: 'Content Management', icon: Folder, path: '/admin/content-management' }
    ],
    'admin': [
      ...commonItems,
      { label: 'User Management', icon: Users, path: '/admin/user-management' },
      { label: 'Documents', icon: FileText, path: '/documents' },
      { label: 'Reports', icon: BarChart3, path: '/admin/reports' },
      { label: 'Content Management', icon: Folder, path: '/admin/content-management' }
    ],
    'student': [
      ...commonItems,
      { label: 'My Courses', icon: BookOpen, path: '/student/my-courses' },
      { label: 'Assignments', icon: CheckSquare, path: '/student/assignments' },
      { label: 'Grades', icon: Award, path: '/student/grades' },
      { label: 'Resources', icon: Folder, path: '/student/resources' },
      { label: 'Certificates', icon: Award, path: '/student/certificates' }
    ],
    'instructor': [
      ...commonItems,
      { label: 'My Classes', icon: GraduationCap, path: '/instructor/classes' },
      { label: 'Students', icon: Users, path: '/instructor/students' },
      { label: 'Assignments', icon: CheckSquare, path: '/instructor/assignments' },
      { label: 'Grades', icon: BarChart3, path: '/instructor/grades' },
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
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
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
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="w-full px-4 lg:px-8 py-4 max-w-[1920px] mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Toggle */}
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
              <div className="text-sm text-gray-600">
                <span className="hidden sm:inline">Welcome, </span>
                <span className="text-[#1A2BC2] font-medium">{user?.name}</span>
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

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <div className="w-full px-4 lg:px-8 py-8 max-w-[1920px] mx-auto">
        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar */}
          <aside
            className={`
              fixed lg:relative inset-y-0 left-0 z-40 lg:z-auto
              transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              lg:translate-x-0 transition-transform duration-300 ease-in-out
              lg:col-span-1 w-72 lg:w-auto
            `}
          >
            <div className="bg-white rounded-lg shadow-sm p-6 lg:sticky lg:top-24 h-screen lg:h-auto overflow-y-auto">
              {/* Mobile Header */}
              <div className="lg:hidden flex items-center justify-between mb-6 pb-4 border-b">
                <span className="font-semibold text-gray-900">Menu</span>
                <button onClick={toggleSidebar}>
                  <X className="w-5 h-5 text-gray-500" />
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
                        <Icon className="w-4 h-4 mr-2" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#1A2BC2]/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-[#1A2BC2]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{user?.name}</div>
                    <div className="text-xs text-gray-500 capitalize truncate">
                      {user?.role.replace(/[-_]/g, ' ')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 min-w-0">
            {title && (
              <div className="mb-6">
                <h1 className="text-3xl text-[#1B1C1E]">{title}</h1>
              </div>
            )}
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

