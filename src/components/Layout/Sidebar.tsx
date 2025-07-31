import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  ShoppingCart, 
  Package, 
  DollarSign, 
  BarChart3, 
  Users, 
  Settings,
  Building,
  UserCog,
  Receipt
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  roles: string[];
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['super_admin', 'business_owner', 'operator']
  },
  {
    name: 'Business Setup',
    href: '/business-setup',
    icon: Building,
    roles: ['business_owner']
  },
  {
    name: 'User Management',
    href: '/users',
    icon: Users,
    roles: ['super_admin', 'business_owner']
  },
  {
    name: 'Products/Services',
    href: '/products',
    icon: Package,
    roles: ['business_owner', 'operator']
  },
  {
    name: 'Customers/Suppliers',
    href: '/customers',
    icon: Users,
    roles: ['business_owner', 'operator']
  },
  {
    name: 'Billing',
    href: '/billing',
    icon: Receipt,
    roles: ['business_owner', 'operator']
  },
  {
    name: 'Sales',
    href: '/sales',
    icon: ShoppingCart,
    roles: ['business_owner', 'operator']
  },
  {
    name: 'Purchase',
    href: '/purchase',
    icon: Package,
    roles: ['business_owner', 'operator']
  },
  {
    name: 'Expenses',
    href: '/expenses',
    icon: DollarSign,
    roles: ['business_owner', 'operator']
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: BarChart3,
    roles: ['super_admin', 'business_owner', 'operator']
  },
  {
    name: 'Businesses',
    href: '/businesses',
    icon: Building,
    roles: ['super_admin']
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['super_admin', 'business_owner', 'operator']
  },
];

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role || '')
  );

  return (
    <div className="w-64 bg-card border-r border-border h-screen flex flex-col shadow-card">
      {/* Logo & Brand */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <Building className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">GST Billing</h1>
            <p className="text-xs text-muted-foreground">Business Management</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <UserCog className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.username}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {user?.role?.replace('_', ' ')}
            </p>
            {user?.businessName && (
              <p className="text-xs text-business-primary font-medium truncate">
                {user.businessName}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {filteredNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link key={item.name} to={item.href}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start h-10 px-3',
                  isActive && 'bg-primary text-primary-foreground hover:bg-primary/90'
                )}
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          © 2024 GST Billing System
        </div>
      </div>
    </div>
  );
};

export default Sidebar;