import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Building, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  DollarSign
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/contexts/NotificationContext';

interface Business {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  registrationDate: Date;
  licenseExpiry: Date;
  status: 'active' | 'suspended' | 'expired';
  plan: 'basic' | 'premium' | 'enterprise';
  lastPayment: Date;
  nextPayment: Date;
  revenue: number;
}

const BusinessManagement = () => {
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const [businesses, setBusinesses] = useState<Business[]>([
    {
      id: 'business-1',
      name: 'Demo Business Ltd.',
      ownerName: 'Rajesh Kumar',
      email: 'rajesh@demobusiness.com',
      phone: '+91 9876543210',
      address: '123 Business Park, Mumbai, Maharashtra',
      registrationDate: new Date('2023-02-01'),
      licenseExpiry: new Date('2024-02-08'),
      status: 'active',
      plan: 'premium',
      lastPayment: new Date('2024-01-01'),
      nextPayment: new Date('2024-02-01'),
      revenue: 125000
    },
    {
      id: 'business-2',
      name: 'Tech Solutions Pvt Ltd',
      ownerName: 'Priya Sharma',
      email: 'priya@techsolutions.com',
      phone: '+91 9876543211',
      address: '456 Tech Hub, Bangalore, Karnataka',
      registrationDate: new Date('2023-03-15'),
      licenseExpiry: new Date('2024-02-15'),
      status: 'active',
      plan: 'enterprise',
      lastPayment: new Date('2024-01-15'),
      nextPayment: new Date('2024-02-15'),
      revenue: 250000
    },
    {
      id: 'business-3',
      name: 'Global Traders',
      ownerName: 'Amit Patel',
      email: 'amit@globaltraders.com',
      phone: '+91 9876543212',
      address: '789 Trade Center, Delhi, Delhi',
      registrationDate: new Date('2023-01-10'),
      licenseExpiry: new Date('2024-01-25'),
      status: 'expired',
      plan: 'basic',
      lastPayment: new Date('2023-12-25'),
      nextPayment: new Date('2024-01-25'),
      revenue: 75000
    }
  ]);

  const [isRenewalDialogOpen, setIsRenewalDialogOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [renewalPeriod, setRenewalPeriod] = useState('12'); // months

  const getDaysUntilExpiry = (expiryDate: Date) => {
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusBadge = (business: Business) => {
    const daysUntilExpiry = getDaysUntilExpiry(business.licenseExpiry);
    
    if (business.status === 'expired' || daysUntilExpiry < 0) {
      return <Badge variant="destructive">Expired</Badge>;
    } else if (daysUntilExpiry <= 8) {
      return <Badge variant="outline" className="border-warning text-warning">Expiring Soon</Badge>;
    } else if (business.status === 'suspended') {
      return <Badge variant="secondary">Suspended</Badge>;
    } else {
      return <Badge variant="default">Active</Badge>;
    }
  };

  const getPlanBadge = (plan: string) => {
    const variants = {
      basic: 'secondary',
      premium: 'default',
      enterprise: 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[plan as keyof typeof variants]} className="capitalize">
        {plan}
      </Badge>
    );
  };

  const handleRenewLicense = () => {
    if (!selectedBusiness) return;

    const newExpiryDate = new Date();
    newExpiryDate.setMonth(newExpiryDate.getMonth() + parseInt(renewalPeriod));

    setBusinesses(prev =>
      prev.map(business =>
        business.id === selectedBusiness.id
          ? {
              ...business,
              licenseExpiry: newExpiryDate,
              status: 'active' as const,
              lastPayment: new Date(),
              nextPayment: newExpiryDate
            }
          : business
      )
    );

    addNotification({
      type: 'success',
      title: 'License Renewed',
      message: `${selectedBusiness.name}'s license has been renewed for ${renewalPeriod} months.`,
      businessId: selectedBusiness.id,
      businessName: selectedBusiness.name,
      actionRequired: false
    });

    toast({
      title: "License Renewed",
      description: `${selectedBusiness.name}'s license has been renewed successfully.`
    });

    setIsRenewalDialogOpen(false);
    setSelectedBusiness(null);
  };

  const handleSuspendBusiness = (business: Business) => {
    setBusinesses(prev =>
      prev.map(b =>
        b.id === business.id
          ? { ...b, status: 'suspended' as const }
          : b
      )
    );

    addNotification({
      type: 'warning',
      title: 'Business Suspended',
      message: `${business.name} has been suspended.`,
      businessId: business.id,
      businessName: business.name,
      actionRequired: false
    });

    toast({
      title: "Business Suspended",
      description: `${business.name} has been suspended successfully.`
    });
  };

  const handleActivateBusiness = (business: Business) => {
    setBusinesses(prev =>
      prev.map(b =>
        b.id === business.id
          ? { ...b, status: 'active' as const }
          : b
      )
    );

    addNotification({
      type: 'success',
      title: 'Business Activated',
      message: `${business.name} has been activated.`,
      businessId: business.id,
      businessName: business.name,
      actionRequired: false
    });

    toast({
      title: "Business Activated",
      description: `${business.name} has been activated successfully.`
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Business Management</h1>
          <p className="text-muted-foreground">Manage all registered businesses and their licenses</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businesses.length}</div>
            <p className="text-xs text-muted-foreground">Registered businesses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Licenses</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {businesses.filter(b => b.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {businesses.filter(b => getDaysUntilExpiry(b.licenseExpiry) <= 8 && getDaysUntilExpiry(b.licenseExpiry) >= 0).length}
            </div>
            <p className="text-xs text-muted-foreground">Within 8 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(businesses.reduce((sum, b) => sum + b.revenue, 0))}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Business Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Businesses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>License Expiry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {businesses.map((business) => {
                const daysUntilExpiry = getDaysUntilExpiry(business.licenseExpiry);
                return (
                  <TableRow key={business.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{business.name}</div>
                        <div className="text-sm text-muted-foreground">{business.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{business.ownerName}</div>
                        <div className="text-sm text-muted-foreground">{business.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getPlanBadge(business.plan)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm">
                            {business.licenseExpiry.toLocaleDateString()}
                          </div>
                          <div className={`text-xs ${
                            daysUntilExpiry <= 0 ? 'text-destructive' : 
                            daysUntilExpiry <= 8 ? 'text-warning' : 'text-muted-foreground'
                          }`}>
                            {daysUntilExpiry <= 0 
                              ? `Expired ${Math.abs(daysUntilExpiry)} days ago`
                              : `${daysUntilExpiry} days left`
                            }
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(business)}</TableCell>
                    <TableCell>{formatCurrency(business.revenue)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedBusiness(business);
                            setIsRenewalDialogOpen(true);
                          }}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        
                        {business.status === 'active' ? (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Clock className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Suspend Business</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to suspend {business.name}? This will prevent them from accessing the system.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleSuspendBusiness(business)}>
                                  Suspend
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleActivateBusiness(business)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* License Renewal Dialog */}
      <Dialog open={isRenewalDialogOpen} onOpenChange={setIsRenewalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renew License</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Renewing license for <strong>{selectedBusiness?.name}</strong>
              </p>
            </div>
            
            <div>
              <Label htmlFor="renewal-period">Renewal Period (months)</Label>
              <Input
                id="renewal-period"
                type="number"
                value={renewalPeriod}
                onChange={(e) => setRenewalPeriod(e.target.value)}
                min="1"
                max="36"
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleRenewLicense} className="flex-1">
                Renew License
              </Button>
              <Button variant="outline" onClick={() => setIsRenewalDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessManagement;