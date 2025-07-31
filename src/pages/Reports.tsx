
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar, 
  DollarSign,
  FileText,
  PieChart,
  Filter
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';

interface SalesData {
  month: string;
  sales: number;
  gst: number;
  profit: number;
}

interface GSTReport {
  period: string;
  totalSales: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalGST: number;
  gstPayable: number;
}

interface CustomerReport {
  customerName: string;
  totalSales: number;
  pendingAmount: number;
  lastTransaction: string;
  gstPaid: number;
}

const Reports = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dateFrom, setDateFrom] = useState('2024-01-01');
  const [dateTo, setDateTo] = useState('2024-12-31');
  const [reportType, setReportType] = useState('monthly');

  // Mock data
  const salesData: SalesData[] = [
    { month: 'Jan', sales: 125000, gst: 22500, profit: 25000 },
    { month: 'Feb', sales: 145000, gst: 26100, profit: 29000 },
    { month: 'Mar', sales: 135000, gst: 24300, profit: 27000 },
    { month: 'Apr', sales: 165000, gst: 29700, profit: 33000 },
    { month: 'May', sales: 155000, gst: 27900, profit: 31000 },
    { month: 'Jun', sales: 175000, gst: 31500, profit: 35000 },
    { month: 'Jul', sales: 185000, gst: 33300, profit: 37000 },
    { month: 'Aug', sales: 195000, gst: 35100, profit: 39000 },
    { month: 'Sep', sales: 165000, gst: 29700, profit: 33000 },
    { month: 'Oct', sales: 205000, gst: 36900, profit: 41000 },
    { month: 'Nov', sales: 225000, gst: 40500, profit: 45000 },
    { month: 'Dec', sales: 235000, gst: 42300, profit: 47000 }
  ];

  const gstReports: GSTReport[] = [
    {
      period: 'January 2024',
      totalSales: 125000,
      cgst: 11250,
      sgst: 11250,
      igst: 0,
      totalGST: 22500,
      gstPayable: 20250
    },
    {
      period: 'February 2024',
      totalSales: 145000,
      cgst: 13050,
      sgst: 13050,
      igst: 0,
      totalGST: 26100,
      gstPayable: 23490
    },
    {
      period: 'March 2024',
      totalSales: 135000,
      cgst: 12150,
      sgst: 12150,
      igst: 0,
      totalGST: 24300,
      gstPayable: 21870
    }
  ];

  const customerReports: CustomerReport[] = [
    {
      customerName: 'Tech Solutions Pvt Ltd',
      totalSales: 185000,
      pendingAmount: 25000,
      lastTransaction: '2024-01-15',
      gstPaid: 33300
    },
    {
      customerName: 'Global Traders',
      totalSales: 125000,
      pendingAmount: 0,
      lastTransaction: '2024-01-12',
      gstPaid: 22500
    },
    {
      customerName: 'Sunrise Exports',
      totalSales: 95000,
      pendingAmount: 15000,
      lastTransaction: '2024-01-10',
      gstPaid: 17100
    }
  ];

  const categoryData = [
    { name: 'Services', value: 45, amount: 450000 },
    { name: 'Products', value: 35, amount: 350000 },
    { name: 'Consulting', value: 20, amount: 200000 }
  ];

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))'];

  const totalSales = salesData.reduce((sum, data) => sum + data.sales, 0);
  const totalGST = salesData.reduce((sum, data) => sum + data.gst, 0);
  const totalProfit = salesData.reduce((sum, data) => sum + data.profit, 0);

  const handleExportReport = () => {
    toast({
      title: "Export started",
      description: "Your report is being generated and will be downloaded shortly.",
    });
    // Mock export functionality
    setTimeout(() => {
      const element = document.createElement('a');
      const file = new Blob(['Report data will be here'], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `report_${reportType}_${dateFrom}_to_${dateTo}.csv`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1000);
  };

  const handleGenerateReport = () => {
    toast({
      title: "Report generated",
      description: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report has been generated successfully.`,
    });
    console.log('Generating report for:', { dateFrom, dateTo, reportType });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Business insights and GST compliance reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button variant="business" onClick={handleGenerateReport}>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Report Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="reportType">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleGenerateReport} className="w-full">
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last period</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total GST</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalGST.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">GST collected</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalProfit.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Net profit margin</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Monthly</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{Math.round(totalSales / 12).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Average per month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="gst">GST Reports</TabsTrigger>
          <TabsTrigger value="customers">Customer Reports</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Trend Chart */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Sales Trend
                </CardTitle>
                <CardDescription>Monthly sales and GST collection</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} name="Sales" />
                    <Line type="monotone" dataKey="gst" stroke="hsl(var(--secondary))" strokeWidth={2} name="GST" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue by Category */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="mr-2 h-5 w-5" />
                  Revenue by Category
                </CardTitle>
                <CardDescription>Sales distribution across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Tooltip formatter={(value, name) => [`₹${value.toLocaleString()}`, name]} />
                    <Legend />
                    <Cell fill="hsl(var(--primary))" />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {categoryData.map((category, index) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                        <span className="text-sm">{category.name}</span>
                      </div>
                      <span className="text-sm font-medium">₹{category.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Profit Chart */}
            <Card className="shadow-card lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Monthly Performance
                </CardTitle>
                <CardDescription>Sales, GST, and profit comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="sales" fill="hsl(var(--primary))" name="Sales" />
                    <Bar dataKey="gst" fill="hsl(var(--secondary))" name="GST" />
                    <Bar dataKey="profit" fill="hsl(var(--accent))" name="Profit" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="gst" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                GST Return Reports
              </CardTitle>
              <CardDescription>Monthly GST collection and payment details</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Total Sales</TableHead>
                    <TableHead>CGST</TableHead>
                    <TableHead>SGST</TableHead>
                    <TableHead>IGST</TableHead>
                    <TableHead>Total GST</TableHead>
                    <TableHead>GST Payable</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gstReports.map((report, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{report.period}</TableCell>
                      <TableCell>₹{report.totalSales.toLocaleString()}</TableCell>
                      <TableCell>₹{report.cgst.toLocaleString()}</TableCell>
                      <TableCell>₹{report.sgst.toLocaleString()}</TableCell>
                      <TableCell>₹{report.igst.toLocaleString()}</TableCell>
                      <TableCell className="font-medium">₹{report.totalGST.toLocaleString()}</TableCell>
                      <TableCell className="font-medium text-green-600">₹{report.gstPayable.toLocaleString()}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Analysis</CardTitle>
              <CardDescription>Customer-wise sales and payment analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Total Sales</TableHead>
                    <TableHead>Pending Amount</TableHead>
                    <TableHead>Last Transaction</TableHead>
                    <TableHead>GST Paid</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerReports.map((customer, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{customer.customerName}</TableCell>
                      <TableCell>₹{customer.totalSales.toLocaleString()}</TableCell>
                      <TableCell className={customer.pendingAmount > 0 ? 'text-red-600' : 'text-green-600'}>
                        ₹{customer.pendingAmount.toLocaleString()}
                      </TableCell>
                      <TableCell>{new Date(customer.lastTransaction).toLocaleDateString()}</TableCell>
                      <TableCell>₹{customer.gstPaid.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={customer.pendingAmount > 0 ? 'destructive' : 'default'}>
                          {customer.pendingAmount > 0 ? 'Pending' : 'Paid'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Reports</CardTitle>
              <CardDescription>Stock levels and movement analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                Inventory reporting will be available once stock management is implemented.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
