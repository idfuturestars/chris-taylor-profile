import { cn } from "@/lib/utils";
import { 
  Brain, 
  Calculator, 
  Rocket, 
  BarChart3, 
  Settings,
  Trophy,
  Globe
} from "lucide-react";

interface CondensedSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function CondensedSidebar({ activeSection, onSectionChange }: CondensedSidebarProps) {
  const menuItems = [
    { id: "dashboard", icon: BarChart3, label: "Home" },
    { id: "baseline-test", icon: Rocket, label: "Quick Test", badge: "45m" },
    { id: "comprehensive-test", icon: Brain, label: "Full Test", badge: "3h45m" },
    { id: "talent-match", icon: Calculator, label: "Scores" },
    { id: "ml-insights", icon: Globe, label: "Global" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <aside className="hidden lg:block w-16 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-800" title="EIQ™ Powered by SikatLabs™ and IDFS Pathway™">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center relative">
            <Brain className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 text-yellow-400 text-xs">✦</span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-2 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 group",
                activeSection === item.id
                  ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900"
              )}
              title={item.label}
            >
              <item.icon className="w-5 h-5" />
              
              {/* Badge */}
              {item.badge && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                  {item.badge}
                </span>
              )}

              {/* Active indicator */}
              {activeSection === item.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 dark:bg-blue-400 rounded-r-full" />
              )}

              {/* Tooltip */}
              <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                {item.label}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 dark:bg-gray-100 rotate-45" />
              </div>
            </button>
          ))}
        </nav>

        {/* Current Score Display */}
        <div className="p-2 border-t border-gray-200 dark:border-gray-800">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-blue-500 flex flex-col items-center justify-center text-white text-xs font-bold">
            <Trophy className="w-4 h-4 mb-1" />
            <span>580</span>
          </div>
        </div>
      </div>
    </aside>
  );
}