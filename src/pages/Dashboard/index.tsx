import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import SuperAdminDashboard from './SuperAdminDashboard';
import BusinessOwnerDashboard from './BusinessOwnerDashboard';
import OperatorDashboard from './OperatorDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'super_admin':
      return <SuperAdminDashboard />;
    case 'business_owner':
      return <BusinessOwnerDashboard />;
    case 'operator':
      return <OperatorDashboard />;
    default:
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-muted-foreground">
              Invalid user role
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Please contact administrator
            </p>
          </div>
        </div>
      );
  }
};

export default Dashboard;