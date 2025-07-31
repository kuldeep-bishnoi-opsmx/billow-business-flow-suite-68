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
import { Plus, ShoppingCart, Eye, Download, Edit, Trash2, TrendingUp } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface SaleItem {
  id: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount: number;
  taxRate: number;
  amount: number;
  taxAmount: number;
  totalAmount: number;
}

interface SalesOrder {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: SaleItem[];
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'partial' | 'paid';
  deliveryDate: string;
  notes: string;
}

const Sales = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<SalesOrder | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Partial<SalesOrder>>({
    items: [],
    status: 'pending',
    paymentStatus: 'pending'
  });
  const [currentItem, setCurrentItem] = useState<Partial<SaleItem>>({
    quantity: 1,
    discount: 0,
    taxRate: 18
  });

  // Mock data
  useEffect(() => {
    const mockOrders: SalesOrder[] = [
      {
        id: '1',
        orderNumber: 'SO-2024-001',
        date: '2024-01-15',
        customerName: 'ABC Electronics',
        customerPhone: '+91 98765 43210',
        customerEmail: 'orders@abcelectronics.com',
        items: [
          {
            id: '1',
            productName: 'Smartphone XYZ',
            category: 'Electronics',
            quantity: 2,
            unit: 'Piece',
            unitPrice: 25000,
            discount: 2000,
            taxRate: 18,
            amount: 48000,
            taxAmount: 8640,
            totalAmount: 56640
          }
        ],
        subtotal: 50000,
        totalDiscount: 2000,
        totalTax: 8640,
        totalAmount: 56640,
        status: 'delivered',
        paymentStatus: 'paid',
        deliveryDate: '2024-01-18',
        notes: 'Express delivery requested'
      },
      {
        id: '2',
        orderNumber: 'SO-2024-002',
        date: '2024-01-16',
        customerName: 'Tech Solutions Ltd',
        customerPhone: '+91 87654 32109',
        customerEmail: 'procurement@techsolutions.com',
        items: [
          {
            id: '1',
            productName: 'Laptop Pro',
            category: 'Computers',
            quantity: 5,
            unit: 'Piece',
            unitPrice: 75000,
            discount: 15000,
            taxRate: 18,
            amount: 360000,
            taxAmount: 64800,
            totalAmount: 424800
          }
        ],
        subtotal: 375000,
        totalDiscount: 15000,
        totalTax: 64800,
        totalAmount: 424800,
        status: 'processing',
        paymentStatus: 'partial',
        deliveryDate: '2024-01-25',
        notes: 'Bulk order discount applied'
      }
    ];
    setOrders(mockOrders);
  }, []);

  const calculateItemAmount = (item: Partial<SaleItem>) => {
    const unitPrice = item.unitPrice || 0;
    const quantity = item.quantity || 0;
    const discount = item.discount || 0;
    const taxRate = item.taxRate || 0;

    const amount = (unitPrice * quantity) - discount;
    const taxAmount = (amount * taxRate) / 100;
    const totalAmount = amount + taxAmount;

    return { amount, taxAmount, totalAmount };
  };

  const addItemToOrder = () => {
    if (!currentItem.productName || !currentItem.unitPrice) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const calculations = calculateItemAmount(currentItem);
    const newItem: SaleItem = {
      id: Date.now().toString(),
      productName: currentItem.productName!,
      category: currentItem.category || 'General',
      quantity: currentItem.quantity || 1,
      unit: currentItem.unit || 'Piece',
      unitPrice: currentItem.unitPrice!,
      discount: currentItem.discount || 0,
      taxRate: currentItem.taxRate || 18,
      ...calculations
    };

    const updatedItems = [...(currentOrder.items || []), newItem];
    const subtotal = updatedItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
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
    const subtotal = updatedItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
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
    if (!currentOrder.customerName || !currentOrder.items?.length) {
      toast({
        title: "Error",
        description: "Please fill in customer details and add at least one item",
        variant: "destructive",
      });
      return;
    }

    const orderNumber = currentOrder.orderNumber || `SO-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`;
    const newOrder: SalesOrder = {
      id: editingOrder?.id || Date.now().toString(),
      orderNumber,
      date: currentOrder.date || new Date().toISOString().split('T')[0],
      customerName: currentOrder.customerName!,
      customerPhone: currentOrder.customerPhone || '',
      customerEmail: currentOrder.customerEmail || '',
      items: currentOrder.items!,
      subtotal: currentOrder.subtotal!,
      totalDiscount: currentOrder.totalDiscount!,
      totalTax: currentOrder.totalTax!,
      totalAmount: currentOrder.totalAmount!,
      status: currentOrder.status as SalesOrder['status'] || 'pending',
      paymentStatus: currentOrder.paymentStatus as SalesOrder['paymentStatus'] || 'pending',
      deliveryDate: currentOrder.deliveryDate || '',
      notes: currentOrder.notes || ''
    };

    if (editingOrder) {
      setOrders(orders.map(order => order.id === editingOrder.id ? newOrder : order));
    } else {
      setOrders([...orders, newOrder]);
    }

    setIsDialogOpen(false);
    setEditingOrder(null);
    setCurrentOrder({ items: [], status: 'pending', paymentStatus: 'pending' });

    toast({
      title: "Success",
      description: `Sales order ${editingOrder ? 'updated' : 'created'} successfully`,
    });
  };

  const getStatusBadge = (status: SalesOrder['status']) => {
    const variants = {
      pending: 'secondary',
      confirmed: 'outline',
      processing: 'default',
      delivered: 'default',
      cancelled: 'destructive'
    };
    return <Badge variant={variants[status] as any}>{status.toUpperCase()}</Badge>;
  };

  const getPaymentStatusBadge = (status: SalesOrder['paymentStatus']) => {
    const variants = {
      pending: 'secondary',
      partial: 'outline',
      paid: 'default'
    };
    return <Badge variant={variants[status] as any}>{status.toUpperCase()}</Badge>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sales Management</h1>
          <p className="text-muted-foreground">Manage sales orders and customer transactions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-lg" onClick={() => {
              setEditingOrder(null);
              setCurrentOrder({ items: [], status: 'pending', paymentStatus: 'pending' });
            }}>
              <Plus className="mr-2 h-4 w-4" />
              New Sales Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingOrder ? 'Edit' : 'Create New'} Sales Order
              </DialogTitle>
              <DialogDescription>
                {editingOrder ? 'Update sales order details' : 'Create a new sales order'}.
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="customer" className="space-y-4">
              <TabsList>
                <TabsTrigger value="customer">Customer Details</TabsTrigger>
                <TabsTrigger value="items">Items</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>
              
              <TabsContent value="customer" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customerName">Customer Name *</Label>
                    <Input
                      id="customerName"
                      value={currentOrder.customerName || ''}
                      onChange={(e) => setCurrentOrder({ ...currentOrder, customerName: e.target.value })}
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerPhone">Phone Number</Label>
                    <Input
                      id="customerPhone"
                      value={currentOrder.customerPhone || ''}
                      onChange={(e) => setCurrentOrder({ ...currentOrder, customerPhone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="customerEmail">Email Address</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={currentOrder.customerEmail || ''}
                    onChange={(e) => setCurrentOrder({ ...currentOrder, customerEmail: e.target.value })}
                    placeholder="customer@email.com"
                  />
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
                    <Label htmlFor="deliveryDate">Expected Delivery</Label>
                    <Input
                      id="deliveryDate"
                      type="date"
                      value={currentOrder.deliveryDate || ''}
                      onChange={(e) => setCurrentOrder({ ...currentOrder, deliveryDate: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Order Status</Label>
                    <Select value={currentOrder.status || 'pending'} onValueChange={(value) => setCurrentOrder({ ...currentOrder, status: value as SalesOrder['status'] })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="paymentStatus">Payment Status</Label>
                    <Select value={currentOrder.paymentStatus || 'pending'} onValueChange={(value) => setCurrentOrder({ ...currentOrder, paymentStatus: value as SalesOrder['paymentStatus'] })}>
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
                          placeholder="Electronics, Clothing, etc."
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
                        <Label htmlFor="unitPrice">Unit Price *</Label>
                        <Input
                          id="unitPrice"
                          type="number"
                          min="0"
                          step="0.01"
                          value={currentItem.unitPrice || ''}
                          onChange={(e) => setCurrentItem({ ...currentItem, unitPrice: parseFloat(e.target.value) || 0 })}
                          placeholder="Price per unit"
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
                      <CardTitle>Order Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Qty</TableHead>
                            <TableHead>Price</TableHead>
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
                              <TableCell>₹{item.unitPrice.toLocaleString()}</TableCell>
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
                    placeholder="Additional notes or instructions"
                  />
                </div>
                
                {currentOrder.items && currentOrder.items.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Summary</CardTitle>
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
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {editingOrder ? 'Update Order' : 'Create Order'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Sales Orders
          </CardTitle>
          <CardDescription>Manage and track all sales orders</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
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
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-sm text-muted-foreground">{order.customerPhone}</div>
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
                          title: "Order Details",
                          description: `Viewing details for order ${order.orderNumber}`
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
                        a.download = `sales-order-${order.orderNumber}.json`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        toast({
                          title: "Download Started",
                          description: `Sales order ${order.orderNumber} downloaded successfully`
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

export default Sales;