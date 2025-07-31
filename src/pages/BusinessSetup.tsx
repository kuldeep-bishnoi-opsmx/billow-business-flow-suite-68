import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, FileText, Percent, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BusinessSetup = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [businessProfile, setBusinessProfile] = useState({
    businessName: user?.businessName || '',
    gstNumber: '',
    panNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    email: '',
    website: '',
    businessType: '',
    invoicePrefix: 'INV',
    invoiceStartNumber: '1000',
    logoUrl: ''
  });

  const [gstRates, setGstRates] = useState([
    { id: '1', name: 'No Tax', rate: 0, cgst: 0, sgst: 0, igst: 0 },
    { id: '2', name: 'GST 5%', rate: 5, cgst: 2.5, sgst: 2.5, igst: 5 },
    { id: '3', name: 'GST 12%', rate: 12, cgst: 6, sgst: 6, igst: 12 },
    { id: '4', name: 'GST 18%', rate: 18, cgst: 9, sgst: 9, igst: 18 },
    { id: '5', name: 'GST 28%', rate: 28, cgst: 14, sgst: 14, igst: 28 }
  ]);

  const [newGstRate, setNewGstRate] = useState({
    name: '',
    rate: 0,
    cgst: 0,
    sgst: 0,
    igst: 0
  });

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry'
  ];

  const handleBusinessProfileSave = () => {
    // Validation
    if (!businessProfile.businessName || !businessProfile.gstNumber || !businessProfile.panNumber) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    // Save business profile logic here
    toast({
      title: "Success",
      description: "Business profile updated successfully"
    });
  };

  const handleAddGstRate = () => {
    if (!newGstRate.name || newGstRate.rate <= 0) {
      toast({
        title: "Error",
        description: "Please enter valid GST rate details",
        variant: "destructive"
      });
      return;
    }

    const gstRate = {
      id: Date.now().toString(),
      ...newGstRate
    };

    setGstRates([...gstRates, gstRate]);
    setNewGstRate({ name: '', rate: 0, cgst: 0, sgst: 0, igst: 0 });
    
    toast({
      title: "Success",
      description: "GST rate added successfully"
    });
  };

  const handleGstRateCalculation = (rate: number) => {
    const cgst = rate / 2;
    const sgst = rate / 2;
    const igst = rate;
    
    setNewGstRate({
      ...newGstRate,
      rate,
      cgst,
      sgst,
      igst
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Business Setup</h1>
        <p className="text-muted-foreground">Configure your business profile, GST settings, and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Business Profile
          </TabsTrigger>
          <TabsTrigger value="gst" className="flex items-center gap-2">
            <Percent className="w-4 h-4" />
            GST Configuration
          </TabsTrigger>
          <TabsTrigger value="invoice" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Invoice Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={businessProfile.businessName}
                    onChange={(e) => setBusinessProfile({...businessProfile, businessName: e.target.value})}
                    placeholder="Enter business name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="businessType">Business Type</Label>
                  <Select
                    value={businessProfile.businessType}
                    onValueChange={(value) => setBusinessProfile({...businessProfile, businessType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="proprietorship">Proprietorship</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="llp">LLP</SelectItem>
                      <SelectItem value="private_limited">Private Limited</SelectItem>
                      <SelectItem value="public_limited">Public Limited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="gstNumber">GST Number *</Label>
                  <Input
                    id="gstNumber"
                    value={businessProfile.gstNumber}
                    onChange={(e) => setBusinessProfile({...businessProfile, gstNumber: e.target.value})}
                    placeholder="Enter GST number"
                  />
                </div>

                <div>
                  <Label htmlFor="panNumber">PAN Number *</Label>
                  <Input
                    id="panNumber"
                    value={businessProfile.panNumber}
                    onChange={(e) => setBusinessProfile({...businessProfile, panNumber: e.target.value})}
                    placeholder="Enter PAN number"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={businessProfile.phone}
                    onChange={(e) => setBusinessProfile({...businessProfile, phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={businessProfile.email}
                    onChange={(e) => setBusinessProfile({...businessProfile, email: e.target.value})}
                    placeholder="Enter email"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={businessProfile.website}
                    onChange={(e) => setBusinessProfile({...businessProfile, website: e.target.value})}
                    placeholder="Enter website URL"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={businessProfile.address}
                  onChange={(e) => setBusinessProfile({...businessProfile, address: e.target.value})}
                  placeholder="Enter complete address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={businessProfile.city}
                    onChange={(e) => setBusinessProfile({...businessProfile, city: e.target.value})}
                    placeholder="Enter city"
                  />
                </div>

                <div>
                  <Label htmlFor="state">State</Label>
                  <Select
                    value={businessProfile.state}
                    onValueChange={(value) => setBusinessProfile({...businessProfile, state: value})}
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
                    value={businessProfile.pincode}
                    onChange={(e) => setBusinessProfile({...businessProfile, pincode: e.target.value})}
                    placeholder="Enter pincode"
                  />
                </div>
              </div>

              <div>
                <Label>Business Logo</Label>
                <div className="mt-2 flex items-center gap-4">
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Logo
                  </Button>
                  <span className="text-sm text-muted-foreground">Recommended size: 200x200px</span>
                </div>
              </div>

              <Button onClick={handleBusinessProfileSave} className="w-full">
                Save Business Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gst" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>GST Rate Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Current GST Rates</h3>
                <div className="grid gap-4">
                  {gstRates.map(rate => (
                    <div key={rate.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{rate.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Total: {rate.rate}% | CGST: {rate.cgst}% | SGST: {rate.sgst}% | IGST: {rate.igst}%
                          </p>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Add New GST Rate</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gstName">GST Rate Name</Label>
                    <Input
                      id="gstName"
                      value={newGstRate.name}
                      onChange={(e) => setNewGstRate({...newGstRate, name: e.target.value})}
                      placeholder="e.g., GST 3%"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="gstRate">Total GST Rate (%)</Label>
                    <Input
                      id="gstRate"
                      type="number"
                      value={newGstRate.rate}
                      onChange={(e) => handleGstRateCalculation(Number(e.target.value))}
                      placeholder="Enter GST rate"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cgst">CGST (%)</Label>
                    <Input
                      id="cgst"
                      type="number"
                      value={newGstRate.cgst}
                      onChange={(e) => setNewGstRate({...newGstRate, cgst: Number(e.target.value)})}
                      placeholder="CGST rate"
                    />
                  </div>

                  <div>
                    <Label htmlFor="sgst">SGST (%)</Label>
                    <Input
                      id="sgst"
                      type="number"
                      value={newGstRate.sgst}
                      onChange={(e) => setNewGstRate({...newGstRate, sgst: Number(e.target.value)})}
                      placeholder="SGST rate"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="igst">IGST (%)</Label>
                    <Input
                      id="igst"
                      type="number"
                      value={newGstRate.igst}
                      onChange={(e) => setNewGstRate({...newGstRate, igst: Number(e.target.value)})}
                      placeholder="IGST rate"
                    />
                  </div>
                </div>
                
                <Button onClick={handleAddGstRate} className="mt-4">
                  Add GST Rate
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoice" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
                  <Input
                    id="invoicePrefix"
                    value={businessProfile.invoicePrefix}
                    onChange={(e) => setBusinessProfile({...businessProfile, invoicePrefix: e.target.value})}
                    placeholder="e.g., INV, BILL"
                  />
                </div>
                
                <div>
                  <Label htmlFor="invoiceStartNumber">Starting Invoice Number</Label>
                  <Input
                    id="invoiceStartNumber"
                    value={businessProfile.invoiceStartNumber}
                    onChange={(e) => setBusinessProfile({...businessProfile, invoiceStartNumber: e.target.value})}
                    placeholder="e.g., 1000"
                  />
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-muted/50">
                <h4 className="font-medium mb-2">Invoice Preview</h4>
                <p className="text-sm text-muted-foreground">
                  Next invoice number: <span className="font-mono">{businessProfile.invoicePrefix}-{businessProfile.invoiceStartNumber}</span>
                </p>
              </div>

              <Button onClick={handleBusinessProfileSave} className="w-full">
                Save Invoice Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessSetup;