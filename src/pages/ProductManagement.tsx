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
import { Plus, Edit, Trash2, Package, Wrench } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  type: 'product' | 'service';
  hsnSac: string;
  description: string;
  unit: string;
  price: number;
  gstRate: number;
  category: string;
  stock?: number;
  minStock?: number;
  isActive: boolean;
}

const ProductManagement = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Laptop Computer',
      type: 'product',
      hsnSac: '8471',
      description: 'High performance laptop computer',
      unit: 'Nos',
      price: 45000,
      gstRate: 18,
      category: 'Electronics',
      stock: 50,
      minStock: 10,
      isActive: true
    },
    {
      id: '2',
      name: 'Software Development',
      type: 'service',
      hsnSac: '998314',
      description: 'Custom software development service',
      unit: 'Hours',
      price: 2000,
      gstRate: 18,
      category: 'IT Services',
      isActive: true
    }
  ]);

  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    type: 'product',
    hsnSac: '',
    description: '',
    unit: 'Nos',
    price: 0,
    gstRate: 18,
    category: '',
    stock: 0,
    minStock: 0,
    isActive: true
  });

  const units = ['Nos', 'Kg', 'Ltr', 'Mtr', 'Pcs', 'Hrs', 'Sq Ft', 'Sq Mtr'];
  const gstRates = [0, 5, 12, 18, 28];
  const categories = ['Electronics', 'Clothing', 'Food', 'Books', 'IT Services', 'Consulting', 'Manufacturing'];

  const handleAddProduct = () => {
    if (!formData.name || !formData.hsnSac || formData.price <= 0) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    const newProduct: Product = {
      id: editingProduct?.id || `product-${Date.now()}`,
      name: formData.name!,
      type: formData.type!,
      hsnSac: formData.hsnSac!,
      description: formData.description || '',
      unit: formData.unit!,
      price: formData.price!,
      gstRate: formData.gstRate!,
      category: formData.category!,
      stock: formData.type === 'product' ? formData.stock : undefined,
      minStock: formData.type === 'product' ? formData.minStock : undefined,
      isActive: formData.isActive!
    };

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? newProduct : p));
      toast({
        title: "Success",
        description: "Product updated successfully"
      });
    } else {
      setProducts([...products, newProduct]);
      toast({
        title: "Success",
        description: "Product added successfully"
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'product',
      hsnSac: '',
      description: '',
      unit: 'Nos',
      price: 0,
      gstRate: 18,
      category: '',
      stock: 0,
      minStock: 0,
      isActive: true
    });
    setEditingProduct(null);
    setIsAddProductOpen(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsAddProductOpen(true);
  };

  const handleDelete = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
    toast({
      title: "Success",
      description: "Product deleted successfully"
    });
  };

  const toggleProductStatus = (productId: string) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const activeProducts = products.filter(p => p.type === 'product' && p.isActive);
  const activeServices = products.filter(p => p.type === 'service' && p.isActive);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Product & Service Management</h1>
          <p className="text-muted-foreground">Manage your products and services with HSN/SAC codes</p>
        </div>
        
        <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product/Service
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Edit' : 'Add New'} Product/Service
              </DialogTitle>
              <DialogDescription>
                {editingProduct ? 'Update product/service details' : 'Add a new product or service to your inventory'}.
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
                    placeholder="Enter product/service name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({...formData, type: value as 'product' | 'service'})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="service">Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="hsnSac">HSN/SAC Code *</Label>
                  <Input
                    id="hsnSac"
                    value={formData.hsnSac}
                    onChange={(e) => setFormData({...formData, hsnSac: e.target.value})}
                    placeholder={formData.type === 'product' ? 'Enter HSN code' : 'Enter SAC code'}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({...formData, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="unit">Unit *</Label>
                  <Select
                    value={formData.unit}
                    onValueChange={(value) => setFormData({...formData, unit: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map(unit => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    placeholder="Enter price"
                  />
                </div>

                <div>
                  <Label htmlFor="gstRate">GST Rate (%)</Label>
                  <Select
                    value={formData.gstRate?.toString()}
                    onValueChange={(value) => setFormData({...formData, gstRate: Number(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {gstRates.map(rate => (
                        <SelectItem key={rate} value={rate.toString()}>{rate}%</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.type === 'product' && (
                  <>
                    <div>
                      <Label htmlFor="stock">Current Stock</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                        placeholder="Enter current stock"
                      />
                    </div>

                    <div>
                      <Label htmlFor="minStock">Minimum Stock Alert</Label>
                      <Input
                        id="minStock"
                        type="number"
                        value={formData.minStock}
                        onChange={(e) => setFormData({...formData, minStock: Number(e.target.value)})}
                        placeholder="Enter minimum stock level"
                      />
                    </div>
                  </>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter description"
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddProduct} className="flex-1">
                  {editingProduct ? 'Update' : 'Add'} {formData.type === 'product' ? 'Product' : 'Service'}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Products ({activeProducts.length})
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            Services ({activeServices.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>HSN Code</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>GST</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.hsnSac}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.unit}</TableCell>
                      <TableCell>₹{product.price.toLocaleString()}</TableCell>
                      <TableCell>{product.gstRate}%</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{product.stock}</span>
                          {product.stock && product.minStock && product.stock <= product.minStock && (
                            <Badge variant="destructive" className="text-xs">Low Stock</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.isActive ? "default" : "secondary"}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
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

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Services</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>SAC Code</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>GST</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeServices.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell>{service.hsnSac}</TableCell>
                      <TableCell>{service.category}</TableCell>
                      <TableCell>{service.unit}</TableCell>
                      <TableCell>₹{service.price.toLocaleString()}</TableCell>
                      <TableCell>{service.gstRate}%</TableCell>
                      <TableCell>
                        <Badge variant={service.isActive ? "default" : "secondary"}>
                          {service.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(service)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(service.id)}
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

export default ProductManagement;