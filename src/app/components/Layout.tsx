import { Outlet, Link, useLocation } from 'react-router';
import { LayoutDashboard, Target, BookOpen, MessageSquare, GraduationCap, Bell, User } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { path: '/app', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/app/skill-gap', icon: Target, label: 'Skill Gap' },
  { path: '/app/roadmap', icon: BookOpen, label: 'Learning Roadmap' },
  { path: '/app/interview-prep', icon: GraduationCap, label: 'Interview Prep' },
  { path: '/app/ai-mentor', icon: MessageSquare, label: 'AI Mentor' },
];

export default function Layout() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/app') {
      return location.pathname === '/app';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-sidebar-border bg-sidebar/95 backdrop-blur-xl flex flex-col fixed h-full z-50">
        <div className="p-6 border-b border-sidebar-border">
          <Link to="/app" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Target className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-sidebar-foreground">LakshyaSetu AI</h1>
              <p className="text-xs text-muted-foreground">Career Intelligence</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  active
                    ? 'bg-sidebar-accent text-sidebar-primary'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-2">
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-sm text-sidebar-foreground">Theme</span>
            <ThemeToggle />
          </div>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-200">
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-200">
            <User className="w-5 h-5" />
            <span>Profile</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <Outlet />
      </main>
    </div>
  );
}
