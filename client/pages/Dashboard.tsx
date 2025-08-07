import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, Users, TrendingUp, AlertTriangle, Target, Bell, LogOut, Loader2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    const userObj = JSON.parse(userData);
    setUser(userObj);

    // Fetch analytics data
    fetchAnalytics(userObj.id);
  }, [navigate]);

  const fetchAnalytics = async (facultyId: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/faculty/${facultyId}/analytics`);
      const data = await response.json();

      if (data.success) {
        setAnalytics(data.data);
      } else {
        console.error('Failed to fetch analytics:', data.message);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleImportData = () => {
    setShowUploadModal(true);
  };

  const handleExport = () => {
    // Export student data as CSV
    if (analytics?.studentsList) {
      const csvContent = generateCSV(analytics.studentsList);
      downloadCSV(csvContent, `student-data-${user.name.replace(' ', '-')}-${new Date().toISOString().split('T')[0]}.csv`);
    } else {
      alert('No student data available to export');
    }
  };

  const generateCSV = (students: any[]) => {
    const headers = ['Name', 'Student ID', 'Overall Grade', 'Overall Attendance', 'Status', 'Mathematics', 'Physics', 'Chemistry', 'English', 'Biology'];
    const rows = students.map(student => [
      student.name,
      student.studentId,
      student.overallGrade,
      student.overallAttendance,
      student.status,
      student.subjects.Mathematics?.score || 'N/A',
      student.subjects.Physics?.score || 'N/A',
      student.subjects.Chemistry?.score || 'N/A',
      student.subjects.English?.score || 'N/A',
      student.subjects.Biology?.score || 'N/A'
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleRefreshData = () => {
    if (user) {
      fetchAnalytics(user.id);
    }
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto" />
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/30 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-blue-500/30 shadow-lg shadow-blue-500/10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">Student Performance Dashboard</h1>
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30">
              Academic Year 2024-25
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleImportData}
              className="btn-neon text-white font-semibold"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import Data
            </Button>

            <Button
              onClick={handleRefreshData}
              variant="outline"
              className="btn-neon-outline"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Refresh'
              )}
            </Button>

            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <Bell className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30">
                  {user.name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-slate-400">{user.department}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-400"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-blue-500/20 backdrop-blur-sm shadow-lg shadow-blue-500/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Total Students</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analytics?.totalStudents || 0}</div>
              <p className="text-xs text-green-400 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +2% from last month
              </p>
              <p className="text-xs text-slate-400 mt-1">Excellent this semester</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-blue-500/20 backdrop-blur-sm shadow-lg shadow-blue-500/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Top Performers</CardTitle>
              <Target className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analytics?.topPerformers || 0}</div>
              <p className="text-xs text-green-400 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                15% from last month
              </p>
              <p className="text-xs text-slate-400 mt-1">Excellent grade students</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-blue-500/20 backdrop-blur-sm shadow-lg shadow-blue-500/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Average Attendance</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analytics?.averageAttendance || 0}%</div>
              <p className="text-xs text-green-400 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +7% from last month
              </p>
              <p className="text-xs text-slate-400 mt-1">Class-wide attendance rate</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-blue-500/20 backdrop-blur-sm shadow-lg shadow-blue-500/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">At-Risk Students</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analytics?.atRiskStudents || 0}</div>
              <p className="text-xs text-green-400 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                -1% from last month
              </p>
              <p className="text-xs text-slate-400 mt-1">Need immediate attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Trends Chart */}
          <Card className="bg-slate-800/50 border-blue-500/20 backdrop-blur-sm shadow-lg shadow-blue-500/10">
            <CardHeader>
              <CardTitle className="text-white">Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics?.performanceTrends || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="month"
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      fontSize={12}
                      domain={[0, 100]}
                    />
                    <Line
                      type="monotone"
                      dataKey="performance"
                      stroke="#0EA5E9"
                      strokeWidth={3}
                      dot={{ fill: '#0EA5E9', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, fill: '#3B82F6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Subject-wise Performance Chart */}
          <Card className="bg-slate-800/50 border-blue-500/20 backdrop-blur-sm shadow-lg shadow-blue-500/10">
            <CardHeader>
              <CardTitle className="text-white">Subject-wise Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics?.subjectPerformance || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="subject"
                      stroke="#9CA3AF"
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      fontSize={12}
                      domain={[0, 100]}
                    />
                    <Bar
                      dataKey="score"
                      fill="#8B5CF6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student Performance Overview */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Student Performance Overview</CardTitle>
            <Button 
              onClick={handleExport}
              variant="outline" 
              className="border-slate-600 text-slate-200 hover:bg-slate-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-slate-400">
              Detailed student performance data would be displayed here. 
              Click "Import Data" to upload student information and see comprehensive analytics.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Modal (simplified for now) */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-slate-800 border-slate-700 w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-white">Upload Student Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-slate-400">
                Upload your student data file (CSV, Excel) to get detailed analytics and performance insights.
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={() => setShowUploadModal(false)}
                  variant="outline"
                  className="border-slate-600 text-slate-200 hover:bg-slate-700"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    setShowUploadModal(false);
                    alert('File upload functionality would be implemented here');
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Upload File
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
