import { cn } from "@/lib/utils";
import { 
  Brain, 
  Calculator, 
  Rocket, 
  BarChart3, 
  Settings,
  Trophy,
  Globe,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EiQLogo from "@/components/common/EiQLogo";

interface ModernTopNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  user: any;
}

export default function ModernTopNav({ activeSection, onSectionChange, user }: ModernTopNavProps) {
  const menuItems = [
    { id: "dashboard", label: "Home", icon: BarChart3 },
    { id: "baseline-test", label: "Quick Test", icon: Rocket, badge: "45m" },
    { id: "comprehensive-test", label: "Full Test", icon: Brain, badge: "3h45m" },
    { id: "talent-match", label: "My Scores", icon: Calculator },
    { id: "ml-insights", label: "Global", icon: Globe },
  ];

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* EiQ Logo */}
          <EiQLogo variant="full" size="sm" showText={true} className="cursor-pointer" />

          {/* Main Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "relative flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all",
                  activeSection === item.id
                    ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
                {item.badge && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          {/* User Profile & Score */}
          <div className="flex items-center gap-3">
            {/* Current EiQ Score */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-950 rounded-full">
              <Trophy className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-semibold text-green-700 dark:text-green-300 relative">
                580 E<span className="relative">i<span className="absolute -top-1 left-1/2 -translate-x-1/2 text-yellow-400 text-xs">✦</span></span>Q™
              </span>
            </div>

            {/* Settings */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSectionChange("settings")}
              className="p-2"
            >
              <Settings className="w-4 h-4" />
            </Button>

            {/* User Avatar */}
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-gray-500" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200 dark:border-gray-800">
        <div className="flex overflow-x-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-3 text-xs font-medium whitespace-nowrap transition-colors min-w-0",
                activeSection === item.id
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950"
                  : "text-gray-600 dark:text-gray-400"
              )}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
              {item.badge && (
                <Badge variant="secondary" className="text-xs">
                  {item.badge}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}