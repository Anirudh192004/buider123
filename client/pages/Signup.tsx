import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Loader2, GraduationCap, CheckCircle, Mail, AlertCircle, Zap, Clock } from 'lucide-react';

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
  const [step, setStep] = useState<'signup' | 'processing' | 'email-sent'>('signup');
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
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
    setStep('processing');
    setProgress(0);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      setStep('signup');
      return;
    }

    try {
      // Progress: Validating form
      setStatusMessage('Validating form data...');
      setProgress(20);
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for UX

      // Progress: Creating account
      setStatusMessage('Creating account with Supabase...');
      setProgress(50);

      const endpoint = '/api/auth/signup';
      const response = await fetch(endpoint, {
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

      // Progress: Processing response
      setStatusMessage('Processing response...');
      setProgress(80);

      // Check if response is ok and has content
      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          setError(errorData.message || `Error: ${response.status}`);
        } catch {
          setError(`Server error: ${response.status} ${response.statusText}`);
        }
        return;
      }

      const data = await response.json();

      if (data.success) {
        setProgress(100);
        setStatusMessage('Account created successfully!');
        setStatusMessage('Sending verification email...');
        setTimeout(() => setStep('email-sent'), 1000);
      } else {
        setError(data.message);
        setStep('signup');
        setProgress(0);

        // If account already exists, redirect to login
        if (data.message.includes('already exists') || data.message.includes('already registered')) {
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError(`Network error: ${error.message || 'Please try again.'}`);
      setStep('signup');
      setProgress(0);
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

      <div className="flex items-center space-x-3 p-4 bg-blue-900/20 rounded-lg border border-blue-500/30 transition-all duration-300 hover:bg-blue-900/30">
        <input
          type="checkbox"
          id="demoMode"
          checked={useDemoMode}
          onChange={(e) => setUseDemoMode(e.target.checked)}
          className="rounded border-blue-500 text-blue-500 focus:ring-blue-500 w-4 h-4"
        />
        <div className="flex-1">
          <label htmlFor="demoMode" className="text-sm font-medium text-slate-200 flex items-center cursor-pointer">
            <Zap className="mr-2 h-4 w-4 text-blue-400" />
            Use Demo Mode
          </label>
          <p className="text-xs text-slate-400 mt-1">
            {useDemoMode ?
              '⚡ Verification link will open in browser instantly' :
              '📧 Email verification (requires Supabase setup)'
            }
          </p>
        </div>
      </div>

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

  const renderProcessingForm = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Creating Your Account</h3>
        <p className="text-slate-400">{statusMessage}</p>

        <div className="space-y-2">
          <Progress value={progress} className="w-full h-2" />
          <p className="text-xs text-slate-500">{progress}% complete</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 text-sm text-slate-400">
        <Clock className="w-4 h-4" />
        <span>This usually takes a few seconds...</span>
      </div>
    </div>
  );

  const renderEmailSentForm = () => (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
        <Mail className="w-8 h-8 text-white" />
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">
          {useDemoMode ? 'Verification Link Created!' : 'Check Your Email'}
        </h3>
        <p className="text-slate-400">
          {useDemoMode ? (
            <>We've opened a verification link in a new tab. If it didn't open, check your browser's popup blocker.</>
          ) : (
            <>We've sent a verification link to <strong className="text-white">{formData.email}</strong></>
          )}
        </p>

        {!useDemoMode && (
          <div className="p-3 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
            <div className="flex items-center space-x-2 text-yellow-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Email not arriving?</span>
            </div>
            <p className="text-xs text-yellow-300 mt-1">
              Check your spam folder or try Demo Mode for instant verification
            </p>
          </div>
        )}

        <p className="text-sm text-slate-500">
          {useDemoMode ?
            'Complete the verification, then return here to log in.' :
            'Click the link in your email to verify your account, then return here to log in.'
          }
        </p>
      </div>

      <div className="space-y-4">
        {error && (
          <Alert className="bg-red-900/50 border-red-700">
            <AlertDescription className="text-red-200">{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          {!useDemoMode && (
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
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Resend Verification Email
                </>
              )}
            </Button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => {
                setUseDemoMode(true);
                setStep('signup');
              }}
              variant="outline"
              className="btn-neon-outline text-sm"
            >
              <Zap className="mr-1 h-3 w-3" />
              Try Demo Mode
            </Button>

            <Button
              onClick={() => navigate('/login')}
              className="btn-neon text-white font-semibold text-sm"
            >
              Go to Login
            </Button>
          </div>
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
                {step === 'signup' ? 'Create Faculty Account' :
                 step === 'processing' ? 'Creating Account' : 'Verify Your Email'}
              </CardTitle>
              <CardDescription className="text-slate-400">
                {step === 'signup' ? 'Join our academic community' :
                 step === 'processing' ? 'Setting up your account...' :
                 'Complete your registration process'}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {step === 'signup' && renderSignupForm()}
            {step === 'processing' && renderProcessingForm()}
            {step === 'email-sent' && renderEmailSentForm()}

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
