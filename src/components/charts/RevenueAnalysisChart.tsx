'use client';

import { ComposedChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Property {
  id: string;
  name: string;
  city: string;
  state: string;
  rooms: number;
  adr: number;
  occupancy: number;
  revpar: number;
}

interface RevenueAnalysisChartProps {
  properties: Property[];
  title?: string;
}

export function RevenueAnalysisChart({ properties, title = "Revenue Analysis: ADR vs RevPAR" }: RevenueAnalysisChartProps) {
  // Sort by RevPAR for better visualization
  const sortedProperties = [...properties].sort((a, b) => b.revpar - a.revpar);
  
  const chartData = sortedProperties.map(property => ({
    name: property.name.length > 15 ? `${property.name.substring(0, 15)}...` : property.name,
    fullName: property.name,
    city: property.city,
    ADR: Math.round(property.adr * 100) / 100,
    RevPAR: Math.round(property.revpar * 100) / 100,
    occupancy: Math.round(property.occupancy * 100),
    rooms: property.rooms,
    // Calculate potential revenue (if at 100% occupancy)
    potentialRevenue: Math.round(property.adr * property.rooms * 100) / 100
  }));

  interface TooltipPayload {
    payload: {
      fullName: string;
      city: string;
      rooms: number;
      ADR: number;
      RevPAR: number;
      occupancy: number;
      potentialRevenue: number;
    };
  }

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{data.fullName}</p>
          <p className="text-sm text-gray-600">{data.city} • {data.rooms} rooms</p>
          <div className="mt-2 space-y-1">
            <p style={{ color: '#8884d8' }}>ADR: ${data.ADR}</p>
            <p style={{ color: '#82ca9d' }}>RevPAR: ${data.RevPAR}</p>
            <p className="text-gray-600">Occupancy: {data.occupancy}%</p>
            <p className="text-gray-500">Daily Potential: ${data.potentialRevenue}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
                fontSize={12}
              />
              <YAxis 
                yAxisId="left"
                label={{ value: 'Revenue ($)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar yAxisId="left" dataKey="ADR" fill="#8884d8" name="ADR ($)" />
              <Area 
                yAxisId="left" 
                type="monotone" 
                dataKey="RevPAR" 
                fill="#82ca9d" 
                fillOpacity={0.6}
                stroke="#82ca9d"
                strokeWidth={2}
                name="RevPAR ($)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
