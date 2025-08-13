'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  PropertyMetricsChart, 
  OccupancyTrendChart, 
  RevenueAnalysisChart, 
  PropertySummaryCards 
} from '@/components/charts';
import Navbar from '@/components/navbar';
import { mockProperties } from '@/lib/mock-data';
import { RefreshCw, BarChart3, TrendingUp, DollarSign } from 'lucide-react';

type Property = {
  id: string;
  name: string;
  city: string;
  state: string;
  rooms: number;
  adr: number;
  occupancy: number;
  revpar: number;
  rating?: number;
  status?: string;
  createdAt: string;
};

export default function Dashboard() {
  const [refreshing, setRefreshing] = useState(false);

  // Fetch properties data with fallback to mock data
  const { data: properties = [], isLoading, error, refetch } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/properties');
        if (!res.ok) throw new Error('Failed to fetch properties');
        return res.json();
      } catch (error) {
        console.warn('API failed, using mock data:', error);
        // Return mock data if API fails
        return mockProperties;
      }
    },
    retry: false, // Don't retry failed requests, just use mock data
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-red-600">Error Loading Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                {error instanceof Error ? error.message : 'Failed to load properties data'}
              </p>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Property Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Comprehensive insights into your property portfolio performance
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="px-3 py-1">
                {properties.length} Properties
              </Badge>
              {properties === mockProperties && (
                <Badge variant="secondary" className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200">
                  📊 Demo Data
                </Badge>
              )}
            </div>
            <Button 
              onClick={handleRefresh} 
              variant="outline" 
              disabled={refreshing}
              className="min-w-[100px]"
            >
              {refreshing ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <PropertySummaryCards properties={properties} />

        {/* Charts Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="occupancy" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Occupancy
            </TabsTrigger>
            <TabsTrigger value="revenue" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Revenue
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Performance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PropertyMetricsChart 
                properties={properties} 
                title="Property Performance Overview"
              />
              <OccupancyTrendChart 
                properties={properties}
                title="Occupancy Rates Comparison"
              />
            </div>
            <RevenueAnalysisChart 
              properties={properties}
              title="Revenue Performance Analysis"
            />
          </TabsContent>

          <TabsContent value="occupancy" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <OccupancyTrendChart 
                properties={properties}
                title="Detailed Occupancy Analysis"
              />
              <Card>
                <CardHeader>
                  <CardTitle>Occupancy Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {properties.length > 0 ? Math.max(...properties.map(p => p.occupancy * 100)).toFixed(1) : 0}%
                      </div>
                      <div className="text-sm text-gray-600">Highest Occupancy</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {properties.length > 0 ? (properties.reduce((sum, p) => sum + p.occupancy, 0) / properties.length * 100).toFixed(1) : 0}%
                      </div>
                      <div className="text-sm text-gray-600">Average Occupancy</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {properties.length > 0 ? Math.min(...properties.map(p => p.occupancy * 100)).toFixed(1) : 0}%
                      </div>
                      <div className="text-sm text-gray-600">Lowest Occupancy</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            <RevenueAnalysisChart 
              properties={properties}
              title="Comprehensive Revenue Analysis"
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Leaders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {properties
                      .sort((a, b) => b.revpar - a.revpar)
                      .slice(0, 5)
                      .map((property, index) => (
                        <div key={property.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium">{property.name}</div>
                            <div className="text-sm text-gray-600">{property.city}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-600">${property.revpar.toFixed(2)}</div>
                            <div className="text-sm text-gray-600">RevPAR</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>ADR Leaders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {properties
                      .sort((a, b) => b.adr - a.adr)
                      .slice(0, 5)
                      .map((property, index) => (
                        <div key={property.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium">{property.name}</div>
                            <div className="text-sm text-gray-600">{property.city}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-blue-600">${property.adr.toFixed(2)}</div>
                            <div className="text-sm text-gray-600">ADR</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <PropertyMetricsChart 
              properties={properties}
              title="Comprehensive Performance Metrics"
            />
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Property Performance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Property</th>
                          <th className="text-left p-2">City</th>
                          <th className="text-right p-2">Rooms</th>
                          <th className="text-right p-2">ADR</th>
                          <th className="text-right p-2">Occupancy</th>
                          <th className="text-right p-2">RevPAR</th>
                        </tr>
                      </thead>
                      <tbody>
                        {properties.map((property) => (
                          <tr key={property.id} className="border-b hover:bg-gray-50">
                            <td className="p-2 font-medium">{property.name}</td>
                            <td className="p-2 text-gray-600">{property.city}</td>
                            <td className="p-2 text-right">{property.rooms}</td>
                            <td className="p-2 text-right">${property.adr.toFixed(2)}</td>
                            <td className="p-2 text-right">{(property.occupancy * 100).toFixed(1)}%</td>
                            <td className="p-2 text-right font-medium">${property.revpar.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
