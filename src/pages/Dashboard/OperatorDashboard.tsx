import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Receipt, 
  Package, 
  ShoppingCart, 
  DollarSign,
  Clock,
  CheckCircle,
  Plus,
  Eye
} from 'lucide-react';

const OperatorDashboard = () => {
  const stats = [
    {
      title: 'Today\'s Bills',
      value: '24',
      description: '8 bills since 9 AM',
      icon: Receipt,
      color: 'text-blue-600'
    },
    {
      title: 'Today\'s Sales',
      value: '₹18,750',
      description: 'From 24 transactions',
      icon: ShoppingCart,
      color: 'text-green-600'
    },
    {
      title: 'Pending Payments',
      value: '₹5,450',
      description: '3 pending invoices',
      icon: Clock,
      color: 'text-orange-600'
    },
    {
      title: 'Stock Alerts',
      value: '12',
      description: 'Low stock items',
      icon: Package,
      color: 'text-red-600'
    }
  ];

  const recentBills = [
    { billNo: 'GST-001', customer: 'Ramesh Kumar', amount: '₹2,450', time: '2:30 PM', status: 'Completed' },
    { billNo: 'GST-002', customer: 'Priya Enterprises', amount: '₹8,750', time: '1:45 PM', status: 'Completed' },
    { billNo: 'GST-003', customer: 'Tech Solutions', amount: '₹15,200', time: '12:30 PM', status: 'Completed' },
  ];

  const quickTasks = [
    { name: 'New Bill', icon: Receipt, description: 'Create GST invoice', color: 'bg-blue-500' },
    { name: 'Stock Entry', icon: Package, description: 'Update inventory', color: 'bg-green-500' },
    { name: 'Expense Entry', icon: DollarSign, description: 'Record expense', color: 'bg-orange-500' },
    { name: 'Payment Receipt', icon: CheckCircle, description: 'Record payment', color: 'bg-purple-500' },
  ];

  const lowStockItems = [
    { name: 'Notebook A4', current: 5, minimum: 20, unit: 'pcs' },
    { name: 'Printer Ink Black', current: 2, minimum: 10, unit: 'pcs' },
    { name: 'USB Cable', current: 8, minimum: 25, unit: 'pcs' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Operator Dashboard</h1>
          <p className="text-muted-foreground">Manage daily operations and billing tasks</p>
        </div>
        <Button variant="business" className="shadow-lg" onClick={() => window.location.href = '/billing'}>
          <Plus className="mr-2 h-4 w-4" />
          New Bill
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

      {/* Quick Tasks */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Quick Tasks</CardTitle>
          <CardDescription>Common daily operations and billing tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickTasks.map((task, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 hover:shadow-md transition-all duration-200"
                onClick={() => {
                  switch(task.name) {
                    case 'New Bill': window.location.href = '/billing'; break;
                    case 'Stock Entry': window.location.href = '/products'; break;
                    case 'Expense Entry': window.location.href = '/expenses'; break;
                    case 'Payment Receipt': window.location.href = '/sales'; break;
                  }
                }}
              >
                <div className={`p-2 rounded-lg ${task.color}`}>
                  <task.icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm">{task.name}</div>
                  <div className="text-xs text-muted-foreground">{task.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bills */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Receipt className="mr-2 h-5 w-5 text-business-primary" />
                Recent Bills
              </span>
              <Button variant="ghost" size="sm" onClick={() => window.location.href = '/billing'}>
                <Eye className="mr-1 h-4 w-4" />
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBills.map((bill, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{bill.billNo}</p>
                    <p className="text-xs text-muted-foreground">{bill.customer}</p>
                    <p className="text-xs text-muted-foreground">{bill.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{bill.amount}</p>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                      {bill.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stock Alerts */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5 text-business-primary" />
              Low Stock Alerts
            </CardTitle>
            <CardDescription>Items that need restocking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Current: {item.current} {item.unit} | Min: {item.minimum} {item.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                      Low Stock
                    </span>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" onClick={() => window.location.href = '/products'}>
                Update Stock
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OperatorDashboard;