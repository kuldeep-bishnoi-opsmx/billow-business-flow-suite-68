import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, UserCheck, UserX, Database, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BusinessUser {
  id: string;
  username: string;
  email: string;
  role: 'business_owner' | 'operator';
  businessId?: string;
  businessName?: string;
  permissions?: string[];
  isActive: boolean;
  createdAt: string;
}

const UserManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<BusinessUser[]>([
    {
      id: 'business-1',
      username: 'demo_business',
      email: 'business@demo.com',
      role: 'business_owner',
      businessName: 'Demo Business Ltd.',
      isActive: true,
      createdAt: '2024-01-15'
    },
    {
      id: 'operator-1',
      username: 'demo_operator',
      email: 'operator@demo.com',
      role: 'operator',
      businessId: 'business-1',
      businessName: 'Demo Business Ltd.',
      permissions: ['billing', 'stock_view', 'reports_view'],
      isActive: true,
      createdAt: '2024-01-20'
    }
  ]);
  
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<BusinessUser | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCleanDataOpen, setIsCleanDataOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<BusinessUser | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'business_owner' as 'business_owner' | 'operator',
    businessName: '',
    permissions: [] as string[]
  });

  const availablePermissions = [
    'billing', 'sales', 'purchase', 'expenses', 'reports_view', 
    'reports_edit', 'stock_view', 'stock_edit', 'customer_management'
  ];

  const handleAddUser = () => {
    if (!formData.username || !formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    const newUser: BusinessUser = {
      id: `user-${Date.now()}`,
      username: formData.username,
      email: formData.email,
      role: formData.role,
      businessName: user?.role === 'super_admin' ? formData.businessName : user?.businessName,
      businessId: user?.role === 'super_admin' ? `business-${Date.now()}` : user?.businessId,
      permissions: formData.role === 'operator' ? formData.permissions : undefined,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUsers([...users, newUser]);
    setFormData({
      username: '',
      email: '',
      password: '',
      role: user?.role === 'super_admin' ? 'business_owner' : 'operator',
      businessName: '',
      permissions: []
    });
    setIsAddUserOpen(false);
    
    toast({
      title: "Success",
      description: `${formData.role === 'business_owner' ? 'Business Owner' : 'Operator'} added successfully`
    });
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, isActive: !u.isActive } : u
    ));
    
    const userToToggle = users.find(u => u.id === userId);
    toast({
      title: "Success",
      description: `User ${userToToggle?.isActive ? 'deactivated' : 'activated'} successfully`
    });
  };

  const deleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
    toast({
      title: "Success",
      description: "User deleted successfully"
    });
  };

  const cleanUserData = (userId: string, dataType: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    let message = '';
    switch (dataType) {
      case 'all':
        message = `All data for ${user.username} has been cleaned`;
        break;
      case 'bills':
        message = `All billing data for ${user.username} has been cleaned`;
        break;
      case 'sales':
        message = `All sales data for ${user.username} has been cleaned`;
        break;
      case 'purchases':
        message = `All purchase data for ${user.username} has been cleaned`;
        break;
      case 'expenses':
        message = `All expense data for ${user.username} has been cleaned`;
        break;
      case 'reports':
        message = `All report data for ${user.username} has been cleaned`;
        break;
      default:
        message = `Data cleaned for ${user.username}`;
    }

    toast({
      title: "Success",
      description: message
    });
    
    setIsCleanDataOpen(false);
    setSelectedUser(null);
  };

  const filteredUsers = user?.role === 'super_admin' 
    ? users.filter(u => u.role === 'business_owner')
    : users.filter(u => u.role === 'operator' && u.businessId === user?.businessId);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {user?.role === 'super_admin' ? 'Business Owner Management' : 'Operator Management'}
          </h1>
          <p className="text-muted-foreground">
            {user?.role === 'super_admin' 
              ? 'Manage business owners and their accounts'
              : 'Manage operators for your business'
            }
          </p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add {user?.role === 'super_admin' ? 'Business Owner' : 'Operator'}
              </Button>
            </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                Add New {user?.role === 'super_admin' ? 'Business Owner' : 'Operator'}
              </DialogTitle>
              <DialogDescription>
                Fill in the details to create a new {user?.role === 'super_admin' ? 'business owner account' : 'operator account'}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  placeholder="Enter username"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Enter email"
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Enter password"
                />
              </div>
              
              {user?.role === 'super_admin' && (
                <div>
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    placeholder="Enter business name"
                  />
                </div>
              )}
              
              {user?.role === 'business_owner' && (
                <div>
                  <Label>Permissions</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {availablePermissions.map(permission => (
                      <label key={permission} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(permission)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                permissions: [...formData.permissions, permission]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                permissions: formData.permissions.filter(p => p !== permission)
                              });
                            }
                          }}
                        />
                        <span className="text-sm capitalize">{permission.replace('_', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddUser} className="flex-1">
                  Add {user?.role === 'super_admin' ? 'Business Owner' : 'Operator'}
                </Button>
                <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit {editingUser?.role === 'business_owner' ? 'Business Owner' : 'Operator'}</DialogTitle>
            <DialogDescription>
              Update the details for {editingUser?.username}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-username">Username *</Label>
              <Input
                id="edit-username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                placeholder="Enter username"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Enter email"
              />
            </div>
            
            {editingUser?.role === 'business_owner' && user?.role === 'super_admin' && (
              <div>
                <Label htmlFor="edit-businessName">Business Name *</Label>
                <Input
                  id="edit-businessName"
                  value={formData.businessName}
                  onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  placeholder="Enter business name"
                />
              </div>
            )}
            
            {editingUser?.role === 'operator' && (
              <div>
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availablePermissions.map(permission => (
                    <label key={permission} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(permission)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              permissions: [...formData.permissions, permission]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              permissions: formData.permissions.filter(p => p !== permission)
                            });
                          }
                        }}
                      />
                      <span className="text-sm capitalize">{permission.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={() => {
                  if (editingUser) {
                    setUsers(users.map(u => 
                      u.id === editingUser.id 
                        ? {
                            ...u,
                            username: formData.username,
                            email: formData.email,
                            businessName: formData.businessName || u.businessName,
                            permissions: editingUser.role === 'operator' ? formData.permissions : u.permissions
                          }
                        : u
                    ));
                    setIsEditDialogOpen(false);
                    setEditingUser(null);
                    toast({
                      title: "Success",
                      description: "User updated successfully"
                    });
                  }
                }} 
                className="flex-1"
              >
                Update {editingUser?.role === 'business_owner' ? 'Business Owner' : 'Operator'}
              </Button>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>
            {user?.role === 'super_admin' ? 'Business Owners' : 'Operators'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Business</TableHead>
                {user?.role === 'business_owner' && <TableHead>Permissions</TableHead>}
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((userItem) => (
                <TableRow key={userItem.id}>
                  <TableCell className="font-medium">{userItem.username}</TableCell>
                  <TableCell>{userItem.email}</TableCell>
                  <TableCell>{userItem.businessName}</TableCell>
                  {user?.role === 'business_owner' && (
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {userItem.permissions?.map(permission => (
                          <Badge key={permission} variant="secondary" className="text-xs">
                            {permission.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  )}
                  <TableCell>
                    <Badge variant={userItem.isActive ? "default" : "secondary"}>
                      {userItem.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>{userItem.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleUserStatus(userItem.id)}
                      >
                        {userItem.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingUser(userItem);
                          setFormData({
                            username: userItem.username,
                            email: userItem.email,
                            password: '',
                            role: userItem.role,
                            businessName: userItem.businessName || '',
                            permissions: userItem.permissions || []
                          });
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                       {user?.role === 'super_admin' && (
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => {
                             setSelectedUser(userItem);
                             setIsCleanDataOpen(true);
                           }}
                         >
                           <Database className="w-4 h-4" />
                         </Button>
                       )}
                       <Button
                         variant="outline"
                         size="sm"
                         onClick={() => deleteUser(userItem.id)}
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

      {/* Clean Data Dialog */}
      <Dialog open={isCleanDataOpen} onOpenChange={setIsCleanDataOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Clean User Data
            </DialogTitle>
            <DialogDescription>
              Select the type of data to clean for <strong>{selectedUser?.username}</strong>. 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full justify-start">
                  <Database className="w-4 h-4 mr-2" />
                  Clean All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete ALL data for {selectedUser?.username} including bills, sales, purchases, expenses, and reports. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => cleanUserData(selectedUser?.id || '', 'all')}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete All Data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <div className="grid grid-cols-2 gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="justify-start">
                    Bills Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clean Bills Data?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all billing and invoice data for {selectedUser?.username}.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => cleanUserData(selectedUser?.id || '', 'bills')}>
                      Clean Bills
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="justify-start">
                    Sales Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clean Sales Data?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all sales records for {selectedUser?.username}.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => cleanUserData(selectedUser?.id || '', 'sales')}>
                      Clean Sales
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="justify-start">
                    Purchase Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clean Purchase Data?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all purchase records for {selectedUser?.username}.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => cleanUserData(selectedUser?.id || '', 'purchases')}>
                      Clean Purchases
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="justify-start">
                    Expense Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clean Expense Data?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all expense records for {selectedUser?.username}.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => cleanUserData(selectedUser?.id || '', 'expenses')}>
                      Clean Expenses
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="justify-start">
                    Report Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clean Report Data?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all generated reports for {selectedUser?.username}.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => cleanUserData(selectedUser?.id || '', 'reports')}>
                      Clean Reports
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <Button 
              variant="outline" 
              onClick={() => setIsCleanDataOpen(false)}
              className="w-full mt-4"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;