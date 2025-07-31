import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  Users, 
  TrendingUp, 
  DollarSign,
  Activity,
  Plus,
  AlertTriangle,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const stats = [
    {
      title: 'Total Businesses',
      value: '12',
      description: '+2 from last month',
      icon: Building,
      color: 'text-blue-600'
    },
    {
      title: 'Active Users',
      value: '156',
      description: '+18 from last month',
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'System Revenue',
      value: '₹2,45,000',
      description: '+12% from last month',
      icon: DollarSign,
      color: 'text-emerald-600'
    },
    {
      title: 'System Health',
      value: '99.9%',
      description: 'Uptime this month',
      icon: Activity,
      color: 'text-green-500'
    }
  ];

  const businesses = [
    { 
      id: 'business-1',
      name: 'Demo Business Ltd.', 
      owner: 'Rajesh Kumar', 
      status: 'Active', 
      date: '2024-01-15',
      licenseExpiry: new Date('2024-02-08'),
      plan: 'Premium'
    },
    { 
      id: 'business-2',
      name: 'Tech Solutions Pvt Ltd', 
      owner: 'Priya Sharma', 
      status: 'Active', 
      date: '2024-01-14',
      licenseExpiry: new Date('2024-02-15'),
      plan: 'Enterprise'
    },
    { 
      id: 'business-3',
      name: 'Global Traders', 
      owner: 'Amit Patel', 
      status: 'Expired', 
      date: '2024-01-13',
      licenseExpiry: new Date('2024-01-25'),
      plan: 'Basic'
    },
  ];

  const getDaysUntilExpiry = (expiryDate: Date) => {
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusBadge = (business: any) => {
    const daysUntilExpiry = getDaysUntilExpiry(business.licenseExpiry);
    
    if (business.status === 'Expired' || daysUntilExpiry < 0) {
      return <Badge variant="destructive">Expired</Badge>;
    } else if (daysUntilExpiry <= 8) {
      return <Badge variant="outline" className="border-warning text-warning">Expiring Soon</Badge>;
    } else {
      return <Badge variant="default">Active</Badge>;
    }
  };

  const getExpiryAlert = (business: any) => {
    const daysUntilExpiry = getDaysUntilExpiry(business.licenseExpiry);
    
    if (daysUntilExpiry <= 0) {
      return (
        <div className="flex items-center gap-1 text-destructive">
          <AlertTriangle className="h-3 w-3" />
          <span className="text-xs">Expired {Math.abs(daysUntilExpiry)} days ago</span>
        </div>
      );
    } else if (daysUntilExpiry <= 8) {
      return (
        <div className="flex items-center gap-1 text-warning">
          <AlertTriangle className="h-3 w-3" />
          <span className="text-xs">Expires in {daysUntilExpiry} days</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Super Admin Dashboard</h1>
          <p className="text-muted-foreground">System overview and business management</p>
        </div>
        <Button variant="business" className="shadow-lg" onClick={() => navigate('/business-setup')}>
          <Plus className="mr-2 h-4 w-4" />
          Register Business
        </Button>
        <Button variant="outline" onClick={() => navigate('/business-management')}>
          <Building className="mr-2 h-4 w-4" />
          Manage Businesses
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-card hover:shadow-elevated transition-all duration-200 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Businesses */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="mr-2 h-5 w-5 text-business-primary" />
              Business Licenses & Status
            </CardTitle>
            <CardDescription>Business license status and expiry alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {businesses.map((business, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{business.name}</p>
                      {getStatusBadge(business)}
                    </div>
                    <p className="text-xs text-muted-foreground">Owner: {business.owner}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Expires: {business.licenseExpiry.toLocaleDateString()}
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {business.plan}
                      </Badge>
                    </div>
                    {getExpiryAlert(business)}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/business-management')}
                    >
                      Manage
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Overview */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-business-primary" />
              System Performance
            </CardTitle>
            <CardDescription>Key system metrics and performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Server Load</span>
                <span className="text-sm text-success">12%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-success h-2 rounded-full" style={{width: '12%'}}></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Database Performance</span>
                <span className="text-sm text-success">95%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-success h-2 rounded-full" style={{width: '95%'}}></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">User Satisfaction</span>
                <span className="text-sm text-success">98%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-success h-2 rounded-full" style={{width: '98%'}}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;