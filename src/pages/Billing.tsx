
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Receipt, Eye, Download, Edit, Trash2, Calculator } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { INVOICE_FORMATS } from '@/components/InvoiceFormats/InvoiceFormats';

interface InvoiceItem {
  id: string;
  productName: string;
  hsn: string;
  quantity: number;
  unit: string;
  rate: number;
  discount: number;
  taxRate: number;
  amount: number;
  taxAmount: number;
  totalAmount: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customerName: string;
  customerGSTIN: string;
  customerAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  paymentTerms: string;
  notes: string;
}

const Billing = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [selectedFormat, setSelectedFormat] = useState('classic');
  const [currentInvoice, setCurrentInvoice] = useState<Partial<Invoice>>({
    items: [],
    status: 'draft',
    paymentTerms: '30 days'
  });
  const [currentItem, setCurrentItem] = useState<Partial<InvoiceItem>>({
    quantity: 1,
    discount: 0,
    taxRate: 18
  });

  // Mock data
  useEffect(() => {
    const mockInvoices: Invoice[] = [
      {
        id: '1',
        invoiceNumber: 'INV-2024-001',
        date: '2024-01-15',
        dueDate: '2024-02-14',
        customerName: 'Tech Solutions Pvt Ltd',
        customerGSTIN: '27ABCDE1234F1Z5',
        customerAddress: '123 Business Park, Mumbai, Maharashtra - 400001',
        items: [
          {
            id: '1',
            productName: 'Web Development Service',
            hsn: '998314',
            quantity: 1,
            unit: 'Service',
            rate: 50000,
            discount: 5000,
            taxRate: 18,
            amount: 45000,
            taxAmount: 8100,
            totalAmount: 53100
          }
        ],
        subtotal: 50000,
        totalDiscount: 5000,
        totalTax: 8100,
        totalAmount: 53100,
        status: 'sent',
        paymentTerms: '30 days',
        notes: 'Thank you for your business!'
      },
      {
        id: '2',
        invoiceNumber: 'INV-2024-002',
        date: '2024-01-16',
        dueDate: '2024-02-15',
        customerName: 'Global Traders',
        customerGSTIN: '19FGHIJ5678K2L9',
        customerAddress: '456 Trade Center, Delhi - 110001',
        items: [
          {
            id: '1',
            productName: 'Software License',
            hsn: '852490',
            quantity: 5,
            unit: 'License',
            rate: 10000,
            discount: 0,
            taxRate: 18,
            amount: 50000,
            taxAmount: 9000,
            totalAmount: 59000
          }
        ],
        subtotal: 50000,
        totalDiscount: 0,
        totalTax: 9000,
        totalAmount: 59000,
        status: 'paid',
        paymentTerms: '30 days',
        notes: ''
      }
    ];
    setInvoices(mockInvoices);
  }, []);

  const calculateItemAmount = (item: Partial<InvoiceItem>) => {
    const rate = item.rate || 0;
    const quantity = item.quantity || 0;
    const discount = item.discount || 0;
    const taxRate = item.taxRate || 0;

    const amount = (rate * quantity) - discount;
    const taxAmount = (amount * taxRate) / 100;
    const totalAmount = amount + taxAmount;

    return { amount, taxAmount, totalAmount };
  };

  const addItemToInvoice = () => {
    if (!currentItem.productName || !currentItem.rate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const calculations = calculateItemAmount(currentItem);
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      productName: currentItem.productName!,
      hsn: currentItem.hsn || '',
      quantity: currentItem.quantity || 1,
      unit: currentItem.unit || 'Piece',
      rate: currentItem.rate!,
      discount: currentItem.discount || 0,
      taxRate: currentItem.taxRate || 18,
      ...calculations
    };

    const updatedItems = [...(currentInvoice.items || []), newItem];
    const subtotal = updatedItems.reduce((sum, item) => sum + (item.rate * item.quantity), 0);
    const totalDiscount = updatedItems.reduce((sum, item) => sum + item.discount, 0);
    const totalTax = updatedItems.reduce((sum, item) => sum + item.taxAmount, 0);
    const totalAmount = updatedItems.reduce((sum, item) => sum + item.totalAmount, 0);

    setCurrentInvoice({
      ...currentInvoice,
      items: updatedItems,
      subtotal,
      totalDiscount,
      totalTax,
      totalAmount
    });

    setCurrentItem({
      quantity: 1,
      discount: 0,
      taxRate: 18
    });
  };

  const removeItemFromInvoice = (itemId: string) => {
    const updatedItems = (currentInvoice.items || []).filter(item => item.id !== itemId);
    const subtotal = updatedItems.reduce((sum, item) => sum + (item.rate * item.quantity), 0);
    const totalDiscount = updatedItems.reduce((sum, item) => sum + item.discount, 0);
    const totalTax = updatedItems.reduce((sum, item) => sum + item.taxAmount, 0);
    const totalAmount = updatedItems.reduce((sum, item) => sum + item.totalAmount, 0);

    setCurrentInvoice({
      ...currentInvoice,
      items: updatedItems,
      subtotal,
      totalDiscount,
      totalTax,
      totalAmount
    });
  };

  const saveInvoice = () => {
    if (!currentInvoice.customerName || !currentInvoice.items?.length) {
      toast({
        title: "Error",
        description: "Please fill in customer details and add at least one item",
        variant: "destructive",
      });
      return;
    }

    const invoiceNumber = currentInvoice.invoiceNumber || `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`;
    const newInvoice: Invoice = {
      id: editingInvoice?.id || Date.now().toString(),
      invoiceNumber,
      date: currentInvoice.date || new Date().toISOString().split('T')[0],
      dueDate: currentInvoice.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      customerName: currentInvoice.customerName!,
      customerGSTIN: currentInvoice.customerGSTIN || '',
      customerAddress: currentInvoice.customerAddress || '',
      items: currentInvoice.items!,
      subtotal: currentInvoice.subtotal!,
      totalDiscount: currentInvoice.totalDiscount!,
      totalTax: currentInvoice.totalTax!,
      totalAmount: currentInvoice.totalAmount!,
      status: currentInvoice.status as Invoice['status'] || 'draft',
      paymentTerms: currentInvoice.paymentTerms || '30 days',
      notes: currentInvoice.notes || ''
    };

    if (editingInvoice) {
      setInvoices(invoices.map(inv => inv.id === editingInvoice.id ? newInvoice : inv));
    } else {
      setInvoices([...invoices, newInvoice]);
    }

    setIsDialogOpen(false);
    setEditingInvoice(null);
    setCurrentInvoice({ items: [], status: 'draft', paymentTerms: '30 days' });

    toast({
      title: "Success",
      description: `Invoice ${editingInvoice ? 'updated' : 'created'} successfully`,
    });
  };

  const getStatusBadge = (status: Invoice['status']) => {
    const variants = {
      draft: 'secondary',
      sent: 'outline',
      paid: 'default',
      overdue: 'destructive'
    };
    return <Badge variant={variants[status] as any}>{status.toUpperCase()}</Badge>;
  };

  const handleViewInvoice = (invoice: Invoice) => {
    // Create a popup window to view the invoice
    const invoiceHtml = generateInvoiceHTML(invoice);
    const newWindow = window.open('', '_blank', 'width=800,height=600');
    if (newWindow) {
      newWindow.document.write(invoiceHtml);
      newWindow.document.close();
    }
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    // Generate invoice HTML and trigger download
    const invoiceHtml = generateInvoiceHTML(invoice);
    const blob = new Blob([invoiceHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invoice.invoiceNumber}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Success",
      description: `Invoice ${invoice.invoiceNumber} downloaded successfully`,
    });
  };

  const generateInvoiceHTML = (invoice: Invoice) => {
    const selectedFormatData = INVOICE_FORMATS.find(f => f.id === selectedFormat);
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Invoice ${invoice.invoiceNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .invoice-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .company-info, .customer-info { flex: 1; }
        .customer-info { text-align: right; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .items-table th, .items-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        .items-table th { background-color: #f5f5f5; }
        .total-section { text-align: right; margin-top: 20px; }
        .total-row { margin: 5px 0; }
        .final-total { font-weight: bold; font-size: 1.2em; border-top: 2px solid #333; padding-top: 10px; }
        .notes { margin-top: 30px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #333; }
        ${getFormatCSS(selectedFormat)}
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="invoice-header">
          <h1>INVOICE</h1>
          <h2>${invoice.invoiceNumber}</h2>
        </div>
        
        <div class="invoice-details">
          <div class="company-info">
            <h3>${user?.businessName || 'Your Business Name'}</h3>
            <p>Your Business Address</p>
            <p>City, State - PIN</p>
            <p>GST: Your GST Number</p>
          </div>
          
          <div class="customer-info">
            <h3>Bill To:</h3>
            <p><strong>${invoice.customerName}</strong></p>
            <p>${invoice.customerAddress}</p>
            ${invoice.customerGSTIN ? `<p>GSTIN: ${invoice.customerGSTIN}</p>` : ''}
          </div>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <div>
            <p><strong>Invoice Date:</strong> ${new Date(invoice.date).toLocaleDateString()}</p>
            <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p><strong>Payment Terms:</strong> ${invoice.paymentTerms}</p>
            <p><strong>Status:</strong> ${invoice.status.toUpperCase()}</p>
          </div>
        </div>
        
        <table class="items-table">
          <thead>
            <tr>
              <th>Item/Service</th>
              <th>HSN/SAC</th>
              <th>Qty</th>
              <th>Unit</th>
              <th>Rate</th>
              <th>Discount</th>
              <th>Taxable Value</th>
              <th>GST Rate</th>
              <th>GST Amount</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map(item => `
              <tr>
                <td>${item.productName}</td>
                <td>${item.hsn}</td>
                <td>${item.quantity}</td>
                <td>${item.unit}</td>
                <td>₹${item.rate.toLocaleString()}</td>
                <td>₹${item.discount.toLocaleString()}</td>
                <td>₹${item.amount.toLocaleString()}</td>
                <td>${item.taxRate}%</td>
                <td>₹${item.taxAmount.toLocaleString()}</td>
                <td>₹${item.totalAmount.toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="total-section">
          <div class="total-row">Subtotal: ₹${invoice.subtotal.toLocaleString()}</div>
          <div class="total-row">Total Discount: ₹${invoice.totalDiscount.toLocaleString()}</div>
          <div class="total-row">Total GST: ₹${invoice.totalTax.toLocaleString()}</div>
          <div class="final-total">Total Amount: ₹${invoice.totalAmount.toLocaleString()}</div>
        </div>
        
        ${invoice.notes ? `
          <div class="notes">
            <h4>Notes:</h4>
            <p>${invoice.notes}</p>
          </div>
        ` : ''}
        
        <div style="margin-top: 50px; text-align: center; font-size: 0.9em; color: #666;">
          <p>Thank you for your business!</p>
          <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
    `;
  };

  const getFormatCSS = (formatId: string) => {
    switch (formatId) {
      case 'modern':
        return `
          .invoice-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; }
          .items-table th { background-color: #667eea; color: white; }
        `;
      case 'minimal':
        return `
          .invoice-header { border-bottom: 1px solid #e0e0e0; }
          .items-table { border: none; }
          .items-table th, .items-table td { border: none; border-bottom: 1px solid #e0e0e0; }
        `;
      case 'professional':
        return `
          .invoice-header { background-color: #f8f9fa; color: #333; }
          .items-table th { background-color: #007bff; color: white; }
        `;
      case 'bold':
        return `
          .invoice-header { background-color: #dc3545; color: white; font-weight: bold; }
          .items-table th { background-color: #dc3545; color: white; }
          .final-total { color: #dc3545; }
        `;
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Billing & Invoicing</h1>
          <p className="text-muted-foreground">Create and manage GST invoices</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-lg" onClick={() => {
              setEditingInvoice(null);
              setCurrentInvoice({ items: [], status: 'draft', paymentTerms: '30 days' });
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingInvoice ? 'Edit' : 'Create New'} Invoice
              </DialogTitle>
              <DialogDescription>
                {editingInvoice ? 'Update invoice details' : 'Create a new GST compliant invoice'}.
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList>
                <TabsTrigger value="basic">Basic Details</TabsTrigger>
                <TabsTrigger value="items">Items</TabsTrigger>
                <TabsTrigger value="format">Format</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customerName">Customer Name *</Label>
                    <Input
                      id="customerName"
                      value={currentInvoice.customerName || ''}
                      onChange={(e) => setCurrentInvoice({ ...currentInvoice, customerName: e.target.value })}
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerGSTIN">Customer GSTIN</Label>
                    <Input
                      id="customerGSTIN"
                      value={currentInvoice.customerGSTIN || ''}
                      onChange={(e) => setCurrentInvoice({ ...currentInvoice, customerGSTIN: e.target.value })}
                      placeholder="27ABCDE1234F1Z5"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="customerAddress">Customer Address</Label>
                  <Input
                    id="customerAddress"
                    value={currentInvoice.customerAddress || ''}
                    onChange={(e) => setCurrentInvoice({ ...currentInvoice, customerAddress: e.target.value })}
                    placeholder="Enter customer address"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Invoice Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={currentInvoice.date || new Date().toISOString().split('T')[0]}
                      onChange={(e) => setCurrentInvoice({ ...currentInvoice, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={currentInvoice.dueDate || ''}
                      onChange={(e) => setCurrentInvoice({ ...currentInvoice, dueDate: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="paymentTerms">Payment Terms</Label>
                    <Select value={currentInvoice.paymentTerms || '30 days'} onValueChange={(value) => setCurrentInvoice({ ...currentInvoice, paymentTerms: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment terms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="15 days">15 Days</SelectItem>
                        <SelectItem value="30 days">30 Days</SelectItem>
                        <SelectItem value="60 days">60 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={currentInvoice.status || 'draft'} onValueChange={(value) => setCurrentInvoice({ ...currentInvoice, status: value as Invoice['status'] })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="items" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Add Item</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="productName">Product/Service Name *</Label>
                        <Input
                          id="productName"
                          value={currentItem.productName || ''}
                          onChange={(e) => setCurrentItem({ ...currentItem, productName: e.target.value })}
                          placeholder="Enter product/service name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="hsn">HSN/SAC Code</Label>
                        <Input
                          id="hsn"
                          value={currentItem.hsn || ''}
                          onChange={(e) => setCurrentItem({ ...currentItem, hsn: e.target.value })}
                          placeholder="Enter HSN/SAC code"
                        />
                      </div>
                      <div>
                        <Label htmlFor="unit">Unit</Label>
                        <Input
                          id="unit"
                          value={currentItem.unit || 'Piece'}
                          onChange={(e) => setCurrentItem({ ...currentItem, unit: e.target.value })}
                          placeholder="Piece, Kg, Service, etc."
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-5 gap-4">
                      <div>
                        <Label htmlFor="quantity">Quantity *</Label>
                        <Input
                          id="quantity"
                          type="number"
                          min="0"
                          step="0.01"
                          value={currentItem.quantity || ''}
                          onChange={(e) => setCurrentItem({ ...currentItem, quantity: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="rate">Rate *</Label>
                        <Input
                          id="rate"
                          type="number"
                          min="0"
                          step="0.01"
                          value={currentItem.rate || ''}
                          onChange={(e) => setCurrentItem({ ...currentItem, rate: parseFloat(e.target.value) || 0 })}
                          placeholder="Rate per unit"
                        />
                      </div>
                      <div>
                        <Label htmlFor="discount">Discount</Label>
                        <Input
                          id="discount"
                          type="number"
                          min="0"
                          step="0.01"
                          value={currentItem.discount || ''}
                          onChange={(e) => setCurrentItem({ ...currentItem, discount: parseFloat(e.target.value) || 0 })}
                          placeholder="Discount amount"
                        />
                      </div>
                      <div>
                        <Label htmlFor="taxRate">GST Rate (%)</Label>
                        <Select value={currentItem.taxRate?.toString() || '18'} onValueChange={(value) => setCurrentItem({ ...currentItem, taxRate: parseFloat(value) })}>
                          <SelectTrigger>
                            <SelectValue placeholder="GST Rate" />
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
                      <div className="flex items-end">
                        <Button onClick={addItemToInvoice} className="w-full">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Item
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {currentInvoice.items && currentInvoice.items.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Invoice Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product/Service</TableHead>
                            <TableHead>HSN/SAC</TableHead>
                            <TableHead>Qty</TableHead>
                            <TableHead>Rate</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>GST</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentInvoice.items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.productName}</TableCell>
                              <TableCell>{item.hsn}</TableCell>
                              <TableCell>{item.quantity} {item.unit}</TableCell>
                              <TableCell>₹{item.rate.toLocaleString()}</TableCell>
                              <TableCell>₹{item.amount.toLocaleString()}</TableCell>
                              <TableCell>₹{item.taxAmount.toLocaleString()}</TableCell>
                              <TableCell className="font-medium">₹{item.totalAmount.toLocaleString()}</TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm" onClick={() => removeItemFromInvoice(item.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="format" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Choose Invoice Format</CardTitle>
                    <CardDescription>Select the format for this invoice</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {INVOICE_FORMATS.map((format) => (
                        <Card 
                          key={format.id}
                          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                            selectedFormat === format.id ? 'ring-2 ring-primary shadow-md' : ''
                          }`}
                          onClick={() => setSelectedFormat(format.id)}
                        >
                          <CardContent className="p-4">
                            <h4 className="font-semibold text-sm mb-1">{format.name}</h4>
                            <p className="text-xs text-muted-foreground mb-2">{format.description}</p>
                            
                            {/* Mini Preview */}
                            <div className="border rounded p-2 text-xs bg-muted/20">
                              <div className="font-bold mb-1">INVOICE</div>
                              <div className="grid grid-cols-2 gap-1 text-xs">
                                <div>INV-001</div>
                                <div className="text-right">₹1,000</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Selected Format: {INVOICE_FORMATS.find(f => f.id === selectedFormat)?.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {INVOICE_FORMATS.find(f => f.id === selectedFormat)?.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="summary" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Calculator className="mr-2 h-5 w-5" />
                      Invoice Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{(currentInvoice.subtotal || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Discount:</span>
                        <span>₹{(currentInvoice.totalDiscount || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total GST:</span>
                        <span>₹{(currentInvoice.totalTax || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t pt-2">
                        <span>Total Amount:</span>
                        <span>₹{(currentInvoice.totalAmount || 0).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Label htmlFor="notes">Notes</Label>
                      <Input
                        id="notes"
                        value={currentInvoice.notes || ''}
                        onChange={(e) => setCurrentInvoice({ ...currentInvoice, notes: e.target.value })}
                        placeholder="Additional notes for the invoice"
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={saveInvoice}>
                    {editingInvoice ? 'Update' : 'Create'} Invoice
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Receipt className="mr-2 h-5 w-5" />
            Invoices
          </CardTitle>
          <CardDescription>Manage your GST invoices and billing records</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.customerName}</TableCell>
                  <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">₹{invoice.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewInvoice(invoice)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => {
                        setEditingInvoice(invoice);
                        setCurrentInvoice(invoice);
                        setIsDialogOpen(true);
                      }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDownloadInvoice(invoice)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Billing;
