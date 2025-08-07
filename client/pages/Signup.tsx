import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, GraduationCap, CheckCircle, Mail } from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'signup' | 'email-sent'>('signup');
  const [useDemoMode, setUseDemoMode] = useState(false);
  const navigate = useNavigate();

  const departments = [
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'Engineering',
    'Business Administration',
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          department: formData.department,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStep('email-sent');
      } else {
        setError(data.message);

        // If account already exists, redirect to login
        if (data.message.includes('already exists') || data.message.includes('already registered')) {
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setError(''); // Clear any previous errors
        alert('Verification email sent successfully!');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderSignupForm = () => (
    <form onSubmit={handleSignup} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-slate-200">Full Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          required
          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 input-neon"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-200">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your university email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          required
          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 input-neon"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="department" className="text-slate-200">Department</Label>
        <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
          <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white input-neon">
            <SelectValue placeholder="Select your department" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600">
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept} className="text-white hover:bg-slate-700">
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-slate-200">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          required
          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 input-neon"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-slate-200">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          required
          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 input-neon"
        />
      </div>

      {error && (
        <Alert className="bg-red-900/50 border-red-700">
          <AlertDescription className="text-red-200">{error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full btn-neon text-white font-semibold"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          'Create Account'
        )}
      </Button>
    </form>
  );

  const renderEmailSentForm = () => (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <Mail className="w-8 h-8 text-white" />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white">Check Your Email</h3>
        <p className="text-slate-400">
          We've sent a verification link to <strong className="text-white">{formData.email}</strong>
        </p>
        <p className="text-sm text-slate-500">
          Click the link in your email to verify your account, then return here to log in.
        </p>
      </div>

      <div className="space-y-4">
        {error && (
          <Alert className="bg-red-900/50 border-red-700">
            <AlertDescription className="text-red-200">{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Button
            onClick={handleResendVerification}
            disabled={loading}
            variant="outline"
            className="w-full btn-neon-outline"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Resend Verification Email'
            )}
          </Button>

          <Button
            onClick={() => navigate('/login')}
            className="w-full btn-neon text-white font-semibold"
          >
            Go to Login
          </Button>
        </div>
      </div>

      <Button
        variant="ghost"
        onClick={() => setStep('signup')}
        className="text-slate-400 hover:text-white"
      >
        Back to Signup
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-slate-800/50 border-blue-500/30 backdrop-blur-sm shadow-2xl shadow-blue-500/20">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-white">
                {step === 'signup' ? 'Create Faculty Account' : 'Verify Your Email'}
              </CardTitle>
              <CardDescription className="text-slate-400">
                {step === 'signup'
                  ? 'Join our academic community'
                  : 'Complete your registration process'
                }
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {step === 'signup' ? renderSignupForm() : renderEmailSentForm()}

            {step === 'signup' && (
              <div className="mt-6 text-center">
                <p className="text-slate-400">
                  Already have an account?{' '}
                  <Link to="/login" className="text-blue-400 hover:text-cyan-300 underline text-neon">
                    Sign in here
                  </Link>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
