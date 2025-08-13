'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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

interface OccupancyTrendChartProps {
  properties: Property[];
  title?: string;
}

export function OccupancyTrendChart({ properties, title = "Occupancy Rate by Property" }: OccupancyTrendChartProps) {
  // Sort properties by occupancy for better visualization
  const sortedProperties = [...properties].sort((a, b) => a.occupancy - b.occupancy);
  
  const chartData = sortedProperties.map((property, index) => ({
    index: index + 1,
    name: property.name.length > 20 ? `${property.name.substring(0, 20)}...` : property.name,
    fullName: property.name,
    city: property.city,
    occupancy: Math.round(property.occupancy * 100),
    adr: property.adr,
    revpar: property.revpar
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{data.fullName}</p>
          <p className="text-sm text-gray-600">{data.city}</p>
          <div className="mt-2 space-y-1">
            <p style={{ color: payload[0].color }}>
              Occupancy: {data.occupancy}%
            </p>
            <p className="text-gray-600">ADR: ${data.adr}</p>
            <p className="text-gray-600">RevPAR: ${data.revpar}</p>
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
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
                domain={[0, 100]}
                label={{ value: 'Occupancy %', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="occupancy" 
                stroke="#8884d8" 
                strokeWidth={3}
                dot={{ fill: '#8884d8', strokeWidth: 2, r: 6 }}
                name="Occupancy %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
