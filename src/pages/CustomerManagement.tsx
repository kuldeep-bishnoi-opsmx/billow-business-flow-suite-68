import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Users, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Customer {
  id: string;
  name: string;
  type: 'customer' | 'supplier';
  email: string;
  phone: string;
  gstNumber?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  creditLimit?: number;
  outstandingAmount: number;
  isActive: boolean;
  createdAt: string;
}

const CustomerManagement = () => {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'ABC Electronics Ltd.',
      type: 'customer',
      email: 'contact@abcelectronics.com',
      phone: '9876543210',
      gstNumber: '27AABCS1234L1ZM',
      address: '123 Electronics Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      creditLimit: 100000,
      outstandingAmount: 15000,
      isActive: true,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'XYZ Software Solutions',
      type: 'supplier',
      email: 'info@xyzsoftware.com',
      phone: '9876543211',
      gstNumber: '07AABCX1234M1ZN',
      address: '456 Tech Park',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
      outstandingAmount: 25000,
      isActive: true,
      createdAt: '2024-01-20'
    }
  ]);

  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<Partial<Customer>>({
    name: '',
    type: 'customer',
    email: '',
    phone: '',
    gstNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    creditLimit: 0,
    isActive: true
  });

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry'
  ];

  const handleAddCustomer = () => {
    if (!formData.name || !formData.phone) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    const newCustomer: Customer = {
      id: editingCustomer?.id || `customer-${Date.now()}`,
      name: formData.name!,
      type: formData.type!,
      email: formData.email || '',
      phone: formData.phone!,
      gstNumber: formData.gstNumber,
      address: formData.address || '',
      city: formData.city || '',
      state: formData.state || '',
      pincode: formData.pincode || '',
      creditLimit: formData.type === 'customer' ? formData.creditLimit : undefined,
      outstandingAmount: 0,
      isActive: formData.isActive!,
      createdAt: editingCustomer?.createdAt || new Date().toISOString().split('T')[0]
    };

    if (editingCustomer) {
      setCustomers(customers.map(c => c.id === editingCustomer.id ? newCustomer : c));
      toast({
        title: "Success",
        description: `${formData.type === 'customer' ? 'Customer' : 'Supplier'} updated successfully`
      });
    } else {
      setCustomers([...customers, newCustomer]);
      toast({
        title: "Success",
        description: `${formData.type === 'customer' ? 'Customer' : 'Supplier'} added successfully`
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'customer',
      email: '',
      phone: '',
      gstNumber: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      creditLimit: 0,
      isActive: true
    });
    setEditingCustomer(null);
    setIsAddCustomerOpen(false);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData(customer);
    setIsAddCustomerOpen(true);
  };

  const handleDelete = (customerId: string) => {
    setCustomers(customers.filter(c => c.id !== customerId));
    toast({
      title: "Success",
      description: "Record deleted successfully"
    });
  };

  const toggleCustomerStatus = (customerId: string) => {
    setCustomers(customers.map(c => 
      c.id === customerId ? { ...c, isActive: !c.isActive } : c
    ));
  };

  const activeCustomers = customers.filter(c => c.type === 'customer' && c.isActive);
  const activeSuppliers = customers.filter(c => c.type === 'supplier' && c.isActive);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customer & Supplier Management</h1>
          <p className="text-muted-foreground">Manage your customers and suppliers database</p>
        </div>
        
        <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Customer/Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCustomer ? 'Edit' : 'Add New'} Customer/Supplier
              </DialogTitle>
              <DialogDescription>
                {editingCustomer ? 'Update customer/supplier information' : 'Add a new customer or supplier to your records'}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter customer/supplier name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({...formData, type: value as 'customer' | 'supplier'})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="supplier">Supplier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter email address"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="gstNumber">GST Number</Label>
                  <Input
                    id="gstNumber"
                    value={formData.gstNumber}
                    onChange={(e) => setFormData({...formData, gstNumber: e.target.value})}
                    placeholder="Enter GST number (optional)"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Enter complete address"
                  />
                </div>

                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder="Enter city"
                  />
                </div>

                <div>
                  <Label htmlFor="state">State</Label>
                  <Select
                    value={formData.state}
                    onValueChange={(value) => setFormData({...formData, state: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianStates.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                    placeholder="Enter pincode"
                  />
                </div>

                {formData.type === 'customer' && (
                  <div>
                    <Label htmlFor="creditLimit">Credit Limit</Label>
                    <Input
                      id="creditLimit"
                      type="number"
                      value={formData.creditLimit}
                      onChange={(e) => setFormData({...formData, creditLimit: Number(e.target.value)})}
                      placeholder="Enter credit limit"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddCustomer} className="flex-1">
                  {editingCustomer ? 'Update' : 'Add'} {formData.type === 'customer' ? 'Customer' : 'Supplier'}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="customers" className="w-full">
        <TabsList>
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Customers ({activeCustomers.length})
          </TabsTrigger>
          <TabsTrigger value="suppliers" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            Suppliers ({activeSuppliers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>GST Number</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Credit Limit</TableHead>
                    <TableHead>Outstanding</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.gstNumber || 'N/A'}</TableCell>
                      <TableCell>{customer.city}</TableCell>
                      <TableCell>₹{customer.creditLimit?.toLocaleString() || 'N/A'}</TableCell>
                      <TableCell>
                        <span className={customer.outstandingAmount > 0 ? 'text-destructive' : 'text-green-600'}>
                          ₹{customer.outstandingAmount.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={customer.isActive ? "default" : "secondary"}>
                          {customer.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(customer)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(customer.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers">
          <Card>
            <CardHeader>
              <CardTitle>Suppliers</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>GST Number</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Outstanding</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeSuppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">{supplier.name}</TableCell>
                      <TableCell>{supplier.phone}</TableCell>
                      <TableCell>{supplier.email}</TableCell>
                      <TableCell>{supplier.gstNumber || 'N/A'}</TableCell>
                      <TableCell>{supplier.city}</TableCell>
                      <TableCell>
                        <span className={supplier.outstandingAmount > 0 ? 'text-destructive' : 'text-green-600'}>
                          ₹{supplier.outstandingAmount.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={supplier.isActive ? "default" : "secondary"}>
                          {supplier.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(supplier)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(supplier.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerManagement;