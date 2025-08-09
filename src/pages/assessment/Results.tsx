import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useGetResultsQuery } from '@/store/api/assessmentApi';
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
import { AssessmentResult, PaginationParams } from '@/types';
import { Trophy, Search, TrendingUp, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

const Results: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    page: 1,
    limit: 10,
    sortBy: 'completedAt',
    sortOrder: 'desc',
    search: '',
  });

  const { data: resultsData, isLoading, error } = useGetResultsQuery();

  const handleSearch = (search: string) => {
    setPaginationParams(prev => ({
      ...prev,
      search,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setPaginationParams(prev => ({
      ...prev,
      page,
    }));
  };

  const handleSort = (sortBy: string) => {
    setPaginationParams(prev => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getStepBadgeVariant = (step: number) => {
    switch (step) {
      case 1: return 'outline';
      case 2: return 'secondary';
      case 3: return 'default';
      default: return 'outline';
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

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Please log in to view your assessment results.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate statistics
  const stats = resultsData?.data ? {
    totalAssessments: resultsData.data.length,
    averageScore: resultsData.data.reduce((acc, result) => acc + result.percentage, 0) / resultsData.data.length || 0,
    highestLevel: resultsData.data.reduce((highest, result) => {
      if (!result.levelAchieved) return highest;
      const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
      const currentIndex = levels.indexOf(result.levelAchieved);
      const highestIndex = levels.indexOf(highest);
      return currentIndex > highestIndex ? result.levelAchieved : highest;
    }, 'A1'),
    passRate: (resultsData.data.filter(result => result.canProceed).length / resultsData.data.length * 100) || 0,
  } : null;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Assessment Results & Analytics</h1>
          <p className="text-muted-foreground">
            Track your progress and analyze your performance across all assessments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-8 w-8 text-primary" />
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Trophy className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalAssessments}</p>
                  <p className="text-sm text-muted-foreground">Total Assessments</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-success" />
                <div>
                  <p className="text-2xl font-bold">{stats.averageScore.toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Badge variant={getLevelBadgeVariant(stats.highestLevel)} className="text-lg px-3 py-1">
                  {stats.highestLevel}
                </Badge>
                <div>
                  <p className="text-sm text-muted-foreground">Highest Level</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <p className="text-2xl font-bold">{stats.passRate.toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">Pass Rate</p>
                  <Progress value={stats.passRate} className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search results..."
                  value={paginationParams.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Assessment History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p>Loading results...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              <p>Error loading results</p>
            </div>
          ) : resultsData?.data.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No assessment results found</p>
              <p className="text-sm text-muted-foreground mt-2">
                Take your first assessment to see results here!
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('step')}
                    >
                      Step
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('score')}
                    >
                      Score
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('percentage')}
                    >
                      Percentage
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('levelAchieved')}
                    >
                      Level Achieved
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('timeSpent')}
                    >
                      Time Spent
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('completedAt')}
                    >
                      Completed
                    </TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resultsData?.data.map((result: AssessmentResult) => (
                    <TableRow key={result.id}>
                      <TableCell>
                        <Badge variant={getStepBadgeVariant(result.step)}>
                          Step {result.step}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {result.score} / {result.questions.length}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{result.percentage.toFixed(1)}%</span>
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
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {formatDuration(result.timeSpent)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {format(new Date(result.completedAt), 'MMM dd, yyyy')}
                        </div>
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

              {/* Pagination */}
              {resultsData && (resultsData as any).totalPages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(Math.max(1, paginationParams.page - 1))}
                          className={paginationParams.page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: (resultsData as any).totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            isActive={page === paginationParams.page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => handlePageChange(Math.min((resultsData as any).totalPages, paginationParams.page + 1))}
                          className={paginationParams.page === (resultsData as any).totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
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
    </div>
  );
};

export default Results;