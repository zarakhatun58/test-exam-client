import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { 
  useGetCertificatesQuery, 
  useGenerateCertificateMutation,
  useLazyDownloadCertificateQuery
} from '@/store/api/assessmentApi';
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
import { toast } from '@/hooks/use-toast';
import { Certificate, PaginationParams } from '@/types';
import { Download, Award, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';

const Certificates: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    page: 1,
    limit: 10,
    sortBy: 'issuedAt',
    sortOrder: 'desc',
    search: '',
  });

  const { data: certificatesData, isLoading, error } = useGetCertificatesQuery();
  const [generateCertificate, { isLoading: isGenerating }] = useGenerateCertificateMutation();
  const [downloadCertificate] = useLazyDownloadCertificateQuery();

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

  const handleGenerateCertificate = async (level: string) => {
    try {
      await generateCertificate({ level: level as any }).unwrap();
      toast({
        title: "Certificate Generated",
        description: `Your ${level} certificate has been generated successfully!`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.data?.message || 'Failed to generate certificate',
        variant: "destructive",
      });
    }
  };

  const handleDownloadCertificate = async (certificateId: string) => {
    try {
      const blob = await downloadCertificate(certificateId).unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${certificateId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download Started",
        description: "Your certificate is being downloaded.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to download certificate",
        variant: "destructive",
      });
    }
  };

  const getLevelBadgeVariant = (level: string) => {
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

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Please log in to view your certificates.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Certificates</h1>
          <p className="text-muted-foreground">
            View and download your digital competency certificates
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Award className="h-8 w-8 text-primary" />
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search certificates..."
                  value={paginationParams.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Certificates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Certificate Records</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p>Loading certificates...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              <p>Error loading certificates</p>
            </div>
          ) : certificatesData?.data?.length === 0 ? (
            <div className="text-center py-8">
              <Award className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No certificates found</p>
              <p className="text-sm text-muted-foreground mt-2">
                Complete assessments to earn your first certificate!
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('studentName')}
                    >
                      Student Name
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('userId')}
                    >
                      Student ID
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('level')}
                    >
                      Level Achieved
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('issuedAt')}
                    >
                      Issue Date
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {certificatesData?.data?.map((certificate: Certificate) => (
                    <TableRow key={certificate.id}>
                      <TableCell className="font-medium">
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {certificate.userId.slice(-8).toUpperCase()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getLevelBadgeVariant(certificate.level)}>
                          {certificate.level}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(certificate.issuedAt), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadCertificate(certificate.id)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {certificatesData && (certificatesData as any).totalPages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(Math.max(1, paginationParams.page - 1))}
                          className={paginationParams.page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: (certificatesData as any).totalPages }, (_, i) => i + 1).map((page) => (
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
                          onClick={() => handlePageChange(Math.min((certificatesData as any).totalPages, paginationParams.page + 1))}
                          className={paginationParams.page === (certificatesData as any).totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
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

      {/* Generate New Certificate Section */}
      {user.currentLevel && (
        <Card>
          <CardHeader>
            <CardTitle>Generate New Certificate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Current Level: {user.currentLevel}</p>
                <p className="text-sm text-muted-foreground">
                  Generate a new certificate for your current achievement level
                </p>
              </div>
              <Button 
                onClick={() => handleGenerateCertificate(user.currentLevel!)}
                disabled={isGenerating}
              >
                <Award className="h-4 w-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate Certificate'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Certificates;