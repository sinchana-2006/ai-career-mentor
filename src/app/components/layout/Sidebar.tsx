import { NavLink } from 'react-router';
import { LayoutDashboard, Target, BookOpen, MessageSquare, ClipboardList, Sparkles, LogOut } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Skill Gap', href: '/skill-gap', icon: Target },
  { name: 'Learning Path', href: '/roadmap', icon: BookOpen },
  { name: 'Interview Prep', href: '/interview', icon: ClipboardList },
  { name: 'AI Mentor', href: '/mentor', icon: MessageSquare },
];

export function Sidebar() {
  return (
    <div className="w-64 h-screen border-r border-white/5 backdrop-blur-xl bg-sidebar/90 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-sidebar-foreground">LakshyaSetu AI</h1>
            <p className="text-xs text-muted-foreground">Career Intelligence</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-lg shadow-blue-500/10'
                    : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-500' : 'group-hover:text-blue-400'}`} />
                  <span className="font-medium">{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-card/40 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
            JS
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground truncate">John Smith</div>
            <div className="text-xs text-muted-foreground truncate">john@example.com</div>
          </div>
        </div>
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all">
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Sign out</span>
        </button>
      </div>
    </div>
  );
}
