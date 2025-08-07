import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, GraduationCap } from 'lucide-react';

export default function DemoVerify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const email = searchParams.get('email');
    const code = searchParams.get('code');

    if (!email || !code) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    // Call verification endpoint
    fetch(`/api/demo-verify?email=${encodeURIComponent(email)}&code=${code}`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setStatus('success');
          setMessage(data.message);
        } else {
          setStatus('error');
          setMessage(data.message);
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Verification failed');
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-slate-800/50 border-blue-500/30 backdrop-blur-sm shadow-2xl shadow-blue-500/20">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-white">Email Verification</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            {status === 'loading' && (
              <div className="space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-blue-400 mx-auto" />
                <p className="text-slate-400">Verifying your email...</p>
              </div>
            )}

            {status === 'success' && (
              <div className="space-y-4">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">Verification Successful!</h3>
                  <p className="text-slate-400">{message}</p>
                </div>
                <Button 
                  onClick={() => navigate('/login')}
                  className="btn-neon text-white font-semibold w-full"
                >
                  Go to Login
                </Button>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <XCircle className="w-12 h-12 text-red-400 mx-auto" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">Verification Failed</h3>
                  <p className="text-slate-400">{message}</p>
                </div>
                <Button 
                  onClick={() => navigate('/signup')}
                  className="btn-neon text-white font-semibold w-full"
                >
                  Back to Signup
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
