import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { Building, Lock, User, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const { user, login, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!username || !password) {
      setError('Please enter both username and password');
      setIsSubmitting(false);
      return;
    }

    const success = await login(username, password);
    
    if (!success) {
      setError('Invalid username or password');
    }
    
    setIsSubmitting(false);
  };

  const demoCredentials = [
    { role: 'Super Admin', username: 'super', password: '7588351751' },
    { role: 'Business Owner', username: 'demo_business', password: 'password123' },
    { role: 'Operator', username: 'demo_operator', password: 'password123' },
  ];

  return (
    <div className="min-h-screen bg-gradient-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-slide-up">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 bg-gradient-primary rounded-2xl shadow-business">
              <Building className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">GST Billing System</h1>
          <p className="text-muted-foreground">
            Complete Business Management Solution
          </p>
        </div>

        {/* Login Form */}
        <Card className="shadow-elevated border-0">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-xl">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                variant="business"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Demo Credentials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoCredentials.map((cred, index) => (
              <div key={index} className="p-3 bg-muted rounded-lg">
                <div className="text-xs font-medium text-muted-foreground mb-1">
                  {cred.role}
                </div>
                <div className="text-sm space-y-1">
                  <div><span className="font-medium">User:</span> {cred.username}</div>
                  <div><span className="font-medium">Pass:</span> {cred.password}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;