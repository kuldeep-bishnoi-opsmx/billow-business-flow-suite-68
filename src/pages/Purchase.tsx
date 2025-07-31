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
import { Plus, Package, Eye, Download, Edit, Trash2, ShoppingBag, Camera } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { PhotoUploadOCR } from '@/components/OCR/PhotoUploadOCR';

interface PurchaseItem {
  id: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  unitCost: number;
  discount: number;
  taxRate: number;
  amount: number;
  taxAmount: number;
  totalAmount: number;
}

interface PurchaseOrder {
  id: string;
  poNumber: string;
  date: string;
  supplierName: string;
  supplierGSTIN: string;
  supplierPhone: string;
  supplierEmail: string;
  items: PurchaseItem[];
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'confirmed' | 'received' | 'cancelled';
  paymentStatus: 'pending' | 'partial' | 'paid';
  expectedDelivery: string;
  receivedDate?: string;
  notes: string;
}

const Purchase = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isOCRDialogOpen, setIsOCRDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Partial<PurchaseOrder>>({
    items: [],
    status: 'draft',
    paymentStatus: 'pending'
  });
  const [currentItem, setCurrentItem] = useState<Partial<PurchaseItem>>({
    quantity: 1,
    discount: 0,
    taxRate: 18
  });

  // Mock data
  useEffect(() => {
    const mockOrders: PurchaseOrder[] = [
      {
        id: '1',
        poNumber: 'PO-2024-001',
        date: '2024-01-15',
        supplierName: 'Global Electronics Supply',
        supplierGSTIN: '27SUPPLIER123F1Z5',
        supplierPhone: '+91 99887 76655',
        supplierEmail: 'sales@globalsupply.com',
        items: [
          {
            id: '1',
            productName: 'Smartphone Components',
            category: 'Electronics',
            quantity: 100,
            unit: 'Piece',
            unitCost: 800,
            discount: 5000,
            taxRate: 18,
            amount: 75000,
            taxAmount: 13500,
            totalAmount: 88500
          }
        ],
        subtotal: 80000,
        totalDiscount: 5000,
        totalTax: 13500,
        totalAmount: 88500,
        status: 'received',
        paymentStatus: 'paid',
        expectedDelivery: '2024-01-18',
        receivedDate: '2024-01-17',
        notes: 'Quality checked and approved'
      },
      {
        id: '2',
        poNumber: 'PO-2024-002',
        date: '2024-01-16',
        supplierName: 'Tech Components Ltd',
        supplierGSTIN: '19TECHCOMP567K2L9',
        supplierPhone: '+91 88776 65544',
        supplierEmail: 'orders@techcomponents.com',
        items: [
          {
            id: '1',
            productName: 'Laptop Parts',
            category: 'Computer Hardware',
            quantity: 50,
            unit: 'Set',
            unitCost: 1500,
            discount: 2500,
            taxRate: 18,
            amount: 72500,
            taxAmount: 13050,
            totalAmount: 85550
          }
        ],
        subtotal: 75000,
        totalDiscount: 2500,
        totalTax: 13050,
        totalAmount: 85550,
        status: 'confirmed',
        paymentStatus: 'pending',
        expectedDelivery: '2024-01-25',
        notes: 'Rush order - expedited shipping requested'
      }
    ];
    setOrders(mockOrders);
  }, []);

  const calculateItemAmount = (item: Partial<PurchaseItem>) => {
    const unitCost = item.unitCost || 0;
    const quantity = item.quantity || 0;
    const discount = item.discount || 0;
    const taxRate = item.taxRate || 0;

    const amount = (unitCost * quantity) - discount;
    const taxAmount = (amount * taxRate) / 100;
    const totalAmount = amount + taxAmount;

    return { amount, taxAmount, totalAmount };
  };

  const addItemToOrder = () => {
    if (!currentItem.productName || !currentItem.unitCost) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const calculations = calculateItemAmount(currentItem);
    const newItem: PurchaseItem = {
      id: Date.now().toString(),
      productName: currentItem.productName!,
      category: currentItem.category || 'General',
      quantity: currentItem.quantity || 1,
      unit: currentItem.unit || 'Piece',
      unitCost: currentItem.unitCost!,
      discount: currentItem.discount || 0,
      taxRate: currentItem.taxRate || 18,
      ...calculations
    };

    const updatedItems = [...(currentOrder.items || []), newItem];
    const subtotal = updatedItems.reduce((sum, item) => sum + (item.unitCost * item.quantity), 0);
    const totalDiscount = updatedItems.reduce((sum, item) => sum + item.discount, 0);
    const totalTax = updatedItems.reduce((sum, item) => sum + item.taxAmount, 0);
    const totalAmount = updatedItems.reduce((sum, item) => sum + item.totalAmount, 0);

    setCurrentOrder({
      ...currentOrder,
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

  const removeItemFromOrder = (itemId: string) => {
    const updatedItems = (currentOrder.items || []).filter(item => item.id !== itemId);
    const subtotal = updatedItems.reduce((sum, item) => sum + (item.unitCost * item.quantity), 0);
    const totalDiscount = updatedItems.reduce((sum, item) => sum + item.discount, 0);
    const totalTax = updatedItems.reduce((sum, item) => sum + item.taxAmount, 0);
    const totalAmount = updatedItems.reduce((sum, item) => sum + item.totalAmount, 0);

    setCurrentOrder({
      ...currentOrder,
      items: updatedItems,
      subtotal,
      totalDiscount,
      totalTax,
      totalAmount
    });
  };

  const saveOrder = () => {
    if (!currentOrder.supplierName || !currentOrder.items?.length) {
      toast({
        title: "Error",
        description: "Please fill in supplier details and add at least one item",
        variant: "destructive",
      });
      return;
    }

    const poNumber = currentOrder.poNumber || `PO-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`;
    const newOrder: PurchaseOrder = {
      id: editingOrder?.id || Date.now().toString(),
      poNumber,
      date: currentOrder.date || new Date().toISOString().split('T')[0],
      supplierName: currentOrder.supplierName!,
      supplierGSTIN: currentOrder.supplierGSTIN || '',
      supplierPhone: currentOrder.supplierPhone || '',
      supplierEmail: currentOrder.supplierEmail || '',
      items: currentOrder.items!,
      subtotal: currentOrder.subtotal!,
      totalDiscount: currentOrder.totalDiscount!,
      totalTax: currentOrder.totalTax!,
      totalAmount: currentOrder.totalAmount!,
      status: currentOrder.status as PurchaseOrder['status'] || 'draft',
      paymentStatus: currentOrder.paymentStatus as PurchaseOrder['paymentStatus'] || 'pending',
      expectedDelivery: currentOrder.expectedDelivery || '',
      receivedDate: currentOrder.receivedDate,
      notes: currentOrder.notes || ''
    };

    if (editingOrder) {
      setOrders(orders.map(order => order.id === editingOrder.id ? newOrder : order));
    } else {
      setOrders([...orders, newOrder]);
    }

    setIsDialogOpen(false);
    setEditingOrder(null);
    setCurrentOrder({ items: [], status: 'draft', paymentStatus: 'pending' });

    toast({
      title: "Success",
      description: `Purchase order ${editingOrder ? 'updated' : 'created'} successfully`,
    });
  };

  const getStatusBadge = (status: PurchaseOrder['status']) => {
    const variants = {
      draft: 'secondary',
      sent: 'outline',
      confirmed: 'default',
      received: 'default',
      cancelled: 'destructive'
    };
    return <Badge variant={variants[status] as any}>{status.toUpperCase()}</Badge>;
  };

  const getPaymentStatusBadge = (status: PurchaseOrder['paymentStatus']) => {
    const variants = {
      pending: 'secondary',
      partial: 'outline',
      paid: 'default'
    };
    return <Badge variant={variants[status] as any}>{status.toUpperCase()}</Badge>;
  };

  const handleViewOrder = (order: PurchaseOrder) => {
    const orderHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Purchase Order ${order.poNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .details { display: flex; justify-content: space-between; margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Purchase Order</h1>
        <h2>${order.poNumber}</h2>
      </div>
      
      <div class="details">
        <div>
          <h3>Supplier Details:</h3>
          <p><strong>${order.supplierName}</strong></p>
          <p>Phone: ${order.supplierPhone}</p>
          <p>Email: ${order.supplierEmail}</p>
          <p>GSTIN: ${order.supplierGSTIN}</p>
        </div>
        <div>
          <p><strong>Order Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
          <p><strong>Expected Delivery:</strong> ${new Date(order.expectedDelivery).toLocaleDateString()}</p>
          <p><strong>Status:</strong> ${order.status.toUpperCase()}</p>
          <p><strong>Payment Status:</strong> ${order.paymentStatus.toUpperCase()}</p>
        </div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Unit Cost</th>
            <th>Discount</th>
            <th>Tax</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(item => `
            <tr>
              <td>${item.productName}</td>
              <td>${item.category}</td>
              <td>${item.quantity} ${item.unit}</td>
              <td>₹${item.unitCost.toLocaleString()}</td>
              <td>₹${item.discount.toLocaleString()}</td>
              <td>₹${item.taxAmount.toLocaleString()}</td>
              <td>₹${item.totalAmount.toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div style="text-align: right; margin-top: 20px;">
        <p><strong>Subtotal: ₹${order.subtotal.toLocaleString()}</strong></p>
        <p><strong>Total Discount: ₹${order.totalDiscount.toLocaleString()}</strong></p>
        <p><strong>Total Tax: ₹${order.totalTax.toLocaleString()}</strong></p>
        <p><strong>Total Amount: ₹${order.totalAmount.toLocaleString()}</strong></p>
      </div>
      
      ${order.notes ? `<div style="margin-top: 30px;"><strong>Notes:</strong> ${order.notes}</div>` : ''}
    </body>
    </html>
    `;

    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(orderHtml);
      newWindow.document.close();
    }
  };

  const handleDownloadOrder = (order: PurchaseOrder) => {
    const blob = new Blob([JSON.stringify(order, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `purchase-order-${order.poNumber}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: `Purchase order ${order.poNumber} downloaded successfully`,
    });
  };

  const handleOCRDataExtracted = (data: any) => {
    // Populate the form with OCR extracted data
    setCurrentOrder({
      ...currentOrder,
      supplierName: data.supplierName,
      supplierPhone: data.supplierPhone,
      supplierEmail: data.supplierEmail,
      supplierGSTIN: data.supplierGSTIN,
      date: data.date || new Date().toISOString().split('T')[0],
      items: data.items.map((item: any, index: number) => ({
        id: `ocr-${index}`,
        productName: item.productName,
        category: 'OCR Extracted',
        quantity: item.quantity,
        unit: 'Piece',
        unitCost: item.unitCost,
        discount: 0,
        taxRate: 18,
        amount: item.amount,
        taxAmount: (item.amount * 18) / 100,
        totalAmount: item.amount + (item.amount * 18) / 100
      })),
      subtotal: data.items.reduce((sum: number, item: any) => sum + item.amount, 0),
      totalDiscount: 0,
      totalTax: data.items.reduce((sum: number, item: any) => sum + (item.amount * 18) / 100, 0),
      totalAmount: data.items.reduce((sum: number, item: any) => sum + item.amount + (item.amount * 18) / 100, 0)
    });
    
    setIsOCRDialogOpen(false);
    setIsDialogOpen(true);
    
    toast({
      title: "Success",
      description: "Purchase data extracted from photo and ready for review",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Purchase Management</h1>
          <p className="text-muted-foreground">Manage purchase orders and supplier relationships</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-lg" onClick={() => {
                setEditingOrder(null);
                setCurrentOrder({ items: [], status: 'draft', paymentStatus: 'pending' });
              }}>
                <Plus className="mr-2 h-4 w-4" />
                New Purchase Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingOrder ? 'Edit' : 'Create New'} Purchase Order
                </DialogTitle>
                <DialogDescription>
                  {editingOrder ? 'Update purchase order details' : 'Create a new purchase order'}.
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="supplier" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="supplier">Supplier Details</TabsTrigger>
                  <TabsTrigger value="items">Items</TabsTrigger>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                </TabsList>
                
                <TabsContent value="supplier" className="space-y-4">
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="supplierName">Supplier Name *</Label>
                      <Input
                        id="supplierName"
                        value={currentOrder.supplierName || ''}
                        onChange={(e) => setCurrentOrder({ ...currentOrder, supplierName: e.target.value })}
                        placeholder="Enter supplier name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="supplierGSTIN">Supplier GSTIN</Label>
                      <Input
                        id="supplierGSTIN"
                        value={currentOrder.supplierGSTIN || ''}
                        onChange={(e) => setCurrentOrder({ ...currentOrder, supplierGSTIN: e.target.value })}
                        placeholder="27SUPPLIER123F1Z5"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="supplierPhone">Phone Number</Label>
                      <Input
                        id="supplierPhone"
                        value={currentOrder.supplierPhone || ''}
                        onChange={(e) => setCurrentOrder({ ...currentOrder, supplierPhone: e.target.value })}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <Label htmlFor="supplierEmail">Email Address</Label>
                      <Input
                        id="supplierEmail"
                        type="email"
                        value={currentOrder.supplierEmail || ''}
                        onChange={(e) => setCurrentOrder({ ...currentOrder, supplierEmail: e.target.value })}
                        placeholder="supplier@email.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Order Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={currentOrder.date || new Date().toISOString().split('T')[0]}
                        onChange={(e) => setCurrentOrder({ ...currentOrder, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="expectedDelivery">Expected Delivery</Label>
                      <Input
                        id="expectedDelivery"
                        type="date"
                        value={currentOrder.expectedDelivery || ''}
                        onChange={(e) => setCurrentOrder({ ...currentOrder, expectedDelivery: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="status">Order Status</Label>
                      <Select value={currentOrder.status || 'draft'} onValueChange={(value) => setCurrentOrder({ ...currentOrder, status: value as PurchaseOrder['status'] })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="received">Received</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="paymentStatus">Payment Status</Label>
                      <Select value={currentOrder.paymentStatus || 'pending'} onValueChange={(value) => setCurrentOrder({ ...currentOrder, paymentStatus: value as PurchaseOrder['paymentStatus'] })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="partial">Partial</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="receivedDate">Received Date</Label>
                      <Input
                        id="receivedDate"
                        type="date"
                        value={currentOrder.receivedDate || ''}
                        onChange={(e) => setCurrentOrder({ ...currentOrder, receivedDate: e.target.value })}
                      />
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
                          <Label htmlFor="productName">Product Name *</Label>
                          <Input
                            id="productName"
                            value={currentItem.productName || ''}
                            onChange={(e) => setCurrentItem({ ...currentItem, productName: e.target.value })}
                            placeholder="Enter product name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Input
                            id="category"
                            value={currentItem.category || ''}
                            onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value })}
                            placeholder="Raw Materials, Components, etc."
                          />
                        </div>
                        <div>
                          <Label htmlFor="unit">Unit</Label>
                          <Input
                            id="unit"
                            value={currentItem.unit || 'Piece'}
                            onChange={(e) => setCurrentItem({ ...currentItem, unit: e.target.value })}
                            placeholder="Piece, Kg, Liter, etc."
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
                          <Label htmlFor="unitCost">Unit Cost *</Label>
                          <Input
                            id="unitCost"
                            type="number"
                            min="0"
                            step="0.01"
                            value={currentItem.unitCost || ''}
                            onChange={(e) => setCurrentItem({ ...currentItem, unitCost: parseFloat(e.target.value) || 0 })}
                            placeholder="Cost per unit"
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
                          <Label htmlFor="taxRate">Tax Rate (%)</Label>
                          <Select value={currentItem.taxRate?.toString() || '18'} onValueChange={(value) => setCurrentItem({ ...currentItem, taxRate: parseFloat(value) })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Tax rate" />
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
                          <Button onClick={addItemToOrder} className="w-full">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Item
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Items List */}
                  {currentOrder.items && currentOrder.items.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Purchase Items</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Product</TableHead>
                              <TableHead>Qty</TableHead>
                              <TableHead>Cost</TableHead>
                              <TableHead>Discount</TableHead>
                              <TableHead>Tax</TableHead>
                              <TableHead>Total</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {currentOrder.items.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{item.productName}</div>
                                    <div className="text-sm text-muted-foreground">{item.category}</div>
                                  </div>
                                </TableCell>
                                <TableCell>{item.quantity} {item.unit}</TableCell>
                                <TableCell>₹{item.unitCost.toLocaleString()}</TableCell>
                                <TableCell>₹{item.discount.toLocaleString()}</TableCell>
                                <TableCell>₹{item.taxAmount.toLocaleString()}</TableCell>
                                <TableCell>₹{item.totalAmount.toLocaleString()}</TableCell>
                                <TableCell>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeItemFromOrder(item.id)}
                                  >
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
                
                <TabsContent value="summary" className="space-y-4">
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Input
                      id="notes"
                      value={currentOrder.notes || ''}
                      onChange={(e) => setCurrentOrder({ ...currentOrder, notes: e.target.value })}
                      placeholder="Additional notes or special instructions"
                    />
                  </div>
                  
                  {currentOrder.items && currentOrder.items.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Purchase Order Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>₹{currentOrder.subtotal?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Discount:</span>
                          <span>₹{currentOrder.totalDiscount?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Tax:</span>
                          <span>₹{currentOrder.totalTax?.toLocaleString() || 0}</span>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between text-lg font-semibold">
                            <span>Total Amount:</span>
                            <span>₹{currentOrder.totalAmount?.toLocaleString() || 0}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  <div className="flex gap-2">
                    <Button onClick={saveOrder} className="flex-1">
                      <Package className="h-4 w-4 mr-2" />
                      {editingOrder ? 'Update Order' : 'Create Order'}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isOCRDialogOpen} onOpenChange={setIsOCRDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="shadow-lg">
                <Camera className="mr-2 h-4 w-4" />
                Add from Photo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <PhotoUploadOCR
                onDataExtracted={handleOCRDataExtracted}
                onClose={() => setIsOCRDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Purchase Orders
          </CardTitle>
          <CardDescription>Manage and track all purchase orders</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.poNumber}</TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.supplierName}</div>
                      <div className="text-sm text-muted-foreground">{order.supplierPhone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{order.items.length} item(s)</TableCell>
                  <TableCell>₹{order.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{getPaymentStatusBadge(order.paymentStatus)}</TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingOrder(order);
                        setCurrentOrder(order);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Purchase Order Details",
                          description: `Viewing details for PO ${order.poNumber}`
                        });
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const blob = new Blob([JSON.stringify(order, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `purchase-order-${order.poNumber}.json`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        toast({
                          title: "Download Started",
                          description: `Purchase order ${order.poNumber} downloaded successfully`
                        });
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
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

export default Purchase;
