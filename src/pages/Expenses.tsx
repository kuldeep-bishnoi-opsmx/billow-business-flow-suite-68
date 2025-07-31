import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import {
  DollarSign,
  Plus,
  CalendarIcon,
  Download,
  Filter,
  Search,
  TrendingUp,
  Receipt,
  Car,
  Home,
  Zap,
  Phone,
  ShoppingBag,
  Users
} from 'lucide-react';

const Expenses = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const expenseCategories = [
    { id: 'office', name: 'Office Supplies', icon: ShoppingBag },
    { id: 'travel', name: 'Travel & Transport', icon: Car },
    { id: 'rent', name: 'Rent & Utilities', icon: Home },
    { id: 'electricity', name: 'Electricity', icon: Zap },
    { id: 'communication', name: 'Communication', icon: Phone },
    { id: 'staff', name: 'Staff Expenses', icon: Users },
    { id: 'other', name: 'Other', icon: Receipt },
  ];

  const expenses = [
    {
      id: 1,
      date: '2024-01-15',
      category: 'Office Supplies',
      vendor: 'ABC Stationery',
      description: 'Office stationery and supplies',
      amount: 2500,
      gstAmount: 450,
      status: 'Approved',
      paymentMethod: 'UPI'
    },
    {
      id: 2,
      date: '2024-01-14',
      category: 'Travel & Transport',
      vendor: 'Uber India',
      description: 'Client meeting transportation',
      amount: 850,
      gstAmount: 153,
      status: 'Pending',
      paymentMethod: 'Card'
    },
    {
      id: 3,
      date: '2024-01-13',
      category: 'Electricity',
      vendor: 'State Electricity Board',
      description: 'Monthly electricity bill',
      amount: 3200,
      gstAmount: 576,
      status: 'Approved',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 4,
      date: '2024-01-12',
      category: 'Communication',
      vendor: 'Airtel Business',
      description: 'Internet and phone bills',
      amount: 1800,
      gstAmount: 324,
      status: 'Approved',
      paymentMethod: 'Auto Debit'
    },
  ];

  const stats = [
    {
      title: 'Total Expenses (This Month)',
      value: '₹28,350',
      description: '+12% from last month',
      icon: DollarSign,
      color: 'text-red-600'
    },
    {
      title: 'Pending Approvals',
      value: '₹850',
      description: '1 expense pending',
      icon: Receipt,
      color: 'text-orange-600'
    },
    {
      title: 'Tax Deductible',
      value: '₹25,200',
      description: '89% of total expenses',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Average per Day',
      value: '₹1,890',
      description: 'Based on 15 days',
      icon: CalendarIcon,
      color: 'text-blue-600'
    }
  ];

  const handleAddExpense = () => {
    toast({
      title: "Expense added",
      description: "New expense has been recorded successfully.",
    });
    setIsDialogOpen(false);
  };

  const handleExport = () => {
    toast({
      title: "Export started",
      description: "Your expense report is being generated and will be downloaded shortly.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-success/10 text-success';
      case 'Pending':
        return 'bg-warning/10 text-warning';
      case 'Rejected':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted/10 text-muted-foreground';
    }
  };

  const filteredExpenses = expenses.filter(expense =>
    expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <DollarSign className="mr-3 h-8 w-8 text-primary" />
            Expenses
          </h1>
          <p className="text-muted-foreground">Track and manage business expenses with GST calculations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="business">
                <Plus className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
                <DialogDescription>
                  Record a new business expense with GST details
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendor">Vendor</Label>
                  <Input id="vendor" placeholder="Vendor name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input id="amount" type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gst">GST Rate (%)</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select GST rate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0%</SelectItem>
                      <SelectItem value="5">5%</SelectItem>
                      <SelectItem value="12">12%</SelectItem>
                      <SelectItem value="18">18%</SelectItem>
                      <SelectItem value="28">28%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={setDate} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Expense description" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment">Payment Method</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddExpense} className="w-full">
                  Add Expense
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-card hover:shadow-elevated transition-all duration-200">
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

      {/* Categories Overview */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Expense Categories</CardTitle>
          <CardDescription>Quick overview of spending by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {expenseCategories.map((category) => (
              <div key={category.id} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <category.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{category.name}</p>
                  <p className="text-xs text-muted-foreground">
                    ₹{Math.floor(Math.random() * 10000 + 1000).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Expenses Table */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recent Expenses</CardTitle>
              <CardDescription>Track and manage all business expenses</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>GST</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{format(new Date(expense.date), 'dd MMM yyyy')}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{expense.vendor}</TableCell>
                  <TableCell className="max-w-48 truncate">{expense.description}</TableCell>
                  <TableCell className="font-medium">₹{expense.amount.toLocaleString()}</TableCell>
                  <TableCell>₹{expense.gstAmount}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(expense.status)}>
                      {expense.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{expense.paymentMethod}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Expenses;