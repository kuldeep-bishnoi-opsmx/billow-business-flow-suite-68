import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart, 
  Package, 
  DollarSign, 
  TrendingUp,
  Users,
  FileText,
  Plus,
  Eye
} from 'lucide-react';

const BusinessOwnerDashboard = () => {
  const stats = [
    {
      title: 'Today\'s Sales',
      value: '₹25,450',
      description: '+15% from yesterday',
      icon: ShoppingCart,
      color: 'text-green-600'
    },
    {
      title: 'Monthly Revenue',
      value: '₹6,75,000',
      description: '+22% from last month',
      icon: DollarSign,
      color: 'text-emerald-600'
    },
    {
      title: 'Stock Value',
      value: '₹3,25,000',
      description: '450 items in stock',
      icon: Package,
      color: 'text-blue-600'
    },
    {
      title: 'Active Customers',
      value: '89',
      description: '+12 this month',
      icon: Users,
      color: 'text-purple-600'
    }
  ];

  const recentTransactions = [
    { invoice: 'INV-2024-001', customer: 'ABC Enterprises', amount: '₹15,750', date: '2024-01-15', status: 'Paid' },
    { invoice: 'INV-2024-002', customer: 'XYZ Traders', amount: '₹8,500', date: '2024-01-15', status: 'Pending' },
    { invoice: 'INV-2024-003', customer: 'Global Corp', amount: '₹22,300', date: '2024-01-14', status: 'Paid' },
  ];

  const quickActions = [
    { name: 'Create Invoice', icon: FileText, description: 'Generate new GST invoice', color: 'bg-blue-500' },
    { name: 'Add Product', icon: Package, description: 'Add new product/service', color: 'bg-green-500' },
    { name: 'Record Expense', icon: DollarSign, description: 'Add business expense', color: 'bg-orange-500' },
    { name: 'View Reports', icon: TrendingUp, description: 'Check business reports', color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Business Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>
        </div>
        <Button variant="business" className="shadow-lg" onClick={() => window.location.href = '/billing'}>
          <Plus className="mr-2 h-4 w-4" />
          New Invoice
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
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to manage your business efficiently</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 hover:shadow-md transition-all duration-200"
                onClick={() => {
                  switch(action.name) {
                    case 'Create Invoice': window.location.href = '/billing'; break;
                    case 'Add Product': window.location.href = '/products'; break;
                    case 'Record Expense': window.location.href = '/expenses'; break;
                    case 'View Reports': window.location.href = '/reports'; break;
                  }
                }}
              >
                <div className={`p-2 rounded-lg ${action.color}`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm">{action.name}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-business-primary" />
                Recent Invoices
              </span>
              <Button variant="ghost" size="sm" onClick={() => window.location.href = '/sales'}>
                <Eye className="mr-1 h-4 w-4" />
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{transaction.invoice}</p>
                    <p className="text-xs text-muted-foreground">{transaction.customer}</p>
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{transaction.amount}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.status === 'Paid' 
                        ? 'bg-success/10 text-success' 
                        : 'bg-warning/10 text-warning'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* GST Summary */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-business-primary" />
              GST Summary (This Month)
            </CardTitle>
            <CardDescription>Your GST tax collection and liability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">CGST Collected</span>
                <span className="text-sm font-bold">₹12,150</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">SGST Collected</span>
                <span className="text-sm font-bold">₹12,150</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">IGST Collected</span>
                <span className="text-sm font-bold">₹8,450</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold">Total GST Liability</span>
                  <span className="text-sm font-bold text-business-primary">₹32,750</span>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = '/reports'}>
              View GST Returns
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessOwnerDashboard;