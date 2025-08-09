import React, { useState } from 'react';
import { 
  useGetDashboardStatsQuery,
  useGetUsersQuery,
  useGetAssessmentResultsQuery,
  useToggleUserBlockMutation,
  useLazyExportUsersQuery,
  useLazyExportResultsQuery
} from '@/store/api/adminApi';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { PaginationParams, User, AssessmentResult } from '@/types';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Award, 
  Search, 
  Download,
  UserCheck,
  UserX,
  BarChart3
} from 'lucide-react';
import { format } from 'date-fns';

const AdminDashboard: React.FC = () => {
  const [userPagination, setUserPagination] = useState<PaginationParams>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    search: '',
  });

  const [resultsPagination, setResultsPagination] = useState<PaginationParams>({
    page: 1,
    limit: 10,
    sortBy: 'completedAt',
    sortOrder: 'desc',
    search: '',
  });

  const { data: dashboardStats, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const { data: usersData, isLoading: usersLoading } = useGetUsersQuery(userPagination);
  const { data: resultsData, isLoading: resultsLoading } = useGetAssessmentResultsQuery(resultsPagination);
  
  const [toggleUserBlock] = useToggleUserBlockMutation();
  const [exportUsers] = useLazyExportUsersQuery();
  const [exportResults] = useLazyExportResultsQuery();

  const handleUserSearch = (search: string) => {
    setUserPagination(prev => ({
      ...prev,
      search,
      page: 1,
    }));
  };

  const handleResultsSearch = (search: string) => {
    setResultsPagination(prev => ({
      ...prev,
      search,
      page: 1,
    }));
  };

  const handleUserPageChange = (page: number) => {
    setUserPagination(prev => ({
      ...prev,
      page,
    }));
  };

  const handleResultsPageChange = (page: number) => {
    setResultsPagination(prev => ({
      ...prev,
      page,
    }));
  };

  const handleToggleUserBlock = async (userId: string, isBlocked: boolean) => {
    try {
      await toggleUserBlock({ id: userId, isBlocked: !isBlocked }).unwrap();
      toast({
        title: "User Updated",
        description: `User has been ${!isBlocked ? 'blocked' : 'unblocked'} successfully.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.data?.message || 'Failed to update user status',
        variant: "destructive",
      });
    }
  };

  const handleExportUsers = async () => {
    try {
      const [trigger, result] = exportUsers();
      const blob = await trigger().unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Export Started",
        description: "Users data is being downloaded.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export users data",
        variant: "destructive",
      });
    }
  };

  const handleExportResults = async () => {
    try {
      const [trigger, result] = exportResults();
      const blob = await trigger().unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `results-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Export Started",
        description: "Results data is being downloaded.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export results data",
        variant: "destructive",
      });
    }
  };

  const getUserRoleBadge = (role: string) => {
    switch (role) {
      case 'admin': return <Badge variant="default">Admin</Badge>;
      case 'supervisor': return <Badge variant="secondary">Supervisor</Badge>;
      case 'student': return <Badge variant="outline">Student</Badge>;
      default: return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getLevelBadgeVariant = (level: string | null) => {
    if (!level) return 'destructive';
    switch (level) {
      case 'C2': return 'default';
      case 'C1': return 'secondary';
      case 'B2': return 'outline';
      case 'B1': return 'outline';
      case 'A2': return 'outline';
      case 'A1': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users, monitor assessments, and analyze platform performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-primary" />
        </div>
      </div>

      {/* Dashboard Statistics */}
      {dashboardStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{dashboardStats.data?.totalUsers}</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-success" />
                <div>
                  <p className="text-2xl font-bold">{dashboardStats.data?.totalAssessments}</p>
                  <p className="text-sm text-muted-foreground">Total Assessments</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-warning" />
                <div>
                  <p className="text-2xl font-bold">{dashboardStats.data?.passRate.toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">Pass Rate</p>
                  <Progress value={dashboardStats.data?.passRate} className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Award className="h-8 w-8 text-info" />
                <div>
                  <p className="text-2xl font-bold">{dashboardStats.data?.averageScore.toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Level Distribution Chart */}
      {dashboardStats && (
        <Card>
          <CardHeader>
            <CardTitle>Level Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardStats.data && Object.entries(dashboardStats.data.levelDistribution).map(([level, count]) => (
                <div key={level} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={getLevelBadgeVariant(level)}>{level}</Badge>
                    <span className="text-sm">{count as number} users</span>
                  </div>
                  <Progress 
                    value={((count as number) / (dashboardStats.data?.totalUsers || 1)) * 100} 
                    className="w-32" 
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs for Users and Results */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="results">Assessment Results</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>User Management</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleExportUsers}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Users
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="mb-4">
                <div className="relative max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search users..."
                    value={userPagination.search}
                    onChange={(e) => handleUserSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {usersLoading ? (
                <div className="text-center py-8">Loading users...</div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Current Level</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usersData?.data?.data.map((user: User) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.firstName} {user.lastName}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{getUserRoleBadge(user.role)}</TableCell>
                          <TableCell>
                            {user.currentLevel ? (
                              <Badge variant={getLevelBadgeVariant(user.currentLevel)}>
                                {user.currentLevel}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">Not assessed</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {user.isBlocked ? (
                              <Badge variant="destructive">Blocked</Badge>
                            ) : (
                              <Badge variant="default">Active</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleUserBlock(user.id, user.isBlocked)}
                            >
                              {user.isBlocked ? (
                                <><UserCheck className="h-4 w-4 mr-1" /> Unblock</>
                              ) : (
                                <><UserX className="h-4 w-4 mr-1" /> Block</>
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Users Pagination */}
                  {usersData?.data && usersData.data.totalPages > 1 && (
                    <div className="mt-4">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => handleUserPageChange(Math.max(1, userPagination.page - 1))}
                              className={userPagination.page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                          
                          {Array.from({ length: usersData.data.totalPages }, (_, i) => i + 1).map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => handleUserPageChange(page)}
                                isActive={page === userPagination.page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          
                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => handleUserPageChange(Math.min(usersData.data.totalPages, userPagination.page + 1))}
                              className={userPagination.page === usersData.data.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Assessment Results</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleExportResults}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Results
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="mb-4">
                <div className="relative max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search results..."
                    value={resultsPagination.search}
                    onChange={(e) => handleResultsSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {resultsLoading ? (
                <div className="text-center py-8">Loading results...</div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Step</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Percentage</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Completed</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {resultsData?.data?.data.map((result: AssessmentResult) => (
                        <TableRow key={result.id}>
                          <TableCell className="font-medium">
                            User {result.userId.slice(-8)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">Step {result.step}</Badge>
                          </TableCell>
                          <TableCell>
                            {result.score} / {result.questions.length}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{result.percentage.toFixed(1)}%</span>
                              <Progress value={result.percentage} className="w-16" />
                            </div>
                          </TableCell>
                          <TableCell>
                            {result.levelAchieved ? (
                              <Badge variant={getLevelBadgeVariant(result.levelAchieved)}>
                                {result.levelAchieved}
                              </Badge>
                            ) : (
                              <Badge variant="destructive">Failed</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {format(new Date(result.completedAt), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell>
                            {result.canProceed ? (
                              <Badge variant="default">Can Proceed</Badge>
                            ) : (
                              <Badge variant="outline">Complete</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Results Pagination */}
                  {resultsData?.data && resultsData.data.totalPages > 1 && (
                    <div className="mt-4">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => handleResultsPageChange(Math.max(1, resultsPagination.page - 1))}
                              className={resultsPagination.page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                          
                          {Array.from({ length: resultsData.data.totalPages }, (_, i) => i + 1).map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => handleResultsPageChange(page)}
                                isActive={page === resultsPagination.page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          
                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => handleResultsPageChange(Math.min(resultsData.data.totalPages, resultsPagination.page + 1))}
                              className={resultsPagination.page === resultsData.data.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;