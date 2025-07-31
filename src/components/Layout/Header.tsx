import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Bell, 
  Search, 
  Settings, 
  LogOut, 
  User,
  ChevronDown
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import NotificationCenter from '@/components/Notifications/NotificationCenter';

const Header = () => {
  const { user, logout } = useAuth();
  const { notifications, markAsRead, markAllAsRead, dismissNotification } = useNotifications();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shadow-sm">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search..." 
            className="pl-10 bg-background"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        <NotificationCenter 
          notifications={notifications}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          onDismiss={dismissNotification}
        />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 h-10">
              <div className="p-1 bg-primary/10 rounded-full">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{user?.username}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user?.role?.replace('_', ' ')}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.username}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user?.role?.replace('_', ' ')}
                </p>
                {user?.businessName && (
                  <p className="text-xs text-business-primary font-medium">
                    {user.businessName}
                  </p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;