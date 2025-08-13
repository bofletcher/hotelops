'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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

interface PropertyMetricsChartProps {
  properties: Property[];
  title?: string;
}

export function PropertyMetricsChart({ properties, title = "Property Performance Metrics" }: PropertyMetricsChartProps) {
  // Transform data for the chart
  const chartData = properties.map(property => ({
    name: property.name.length > 15 ? `${property.name.substring(0, 15)}...` : property.name,
    fullName: property.name,
    city: property.city,
    ADR: Math.round(property.adr * 100) / 100,
    'Occupancy %': Math.round(property.occupancy * 100),
    RevPAR: Math.round(property.revpar * 100) / 100,
    Rooms: property.rooms
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{data.fullName}</p>
          <p className="text-sm text-gray-600">{data.city}</p>
          <div className="mt-2 space-y-1">
            {payload.map((entry: any, index: number) => (
              <p key={index} style={{ color: entry.color }}>
                {entry.dataKey}: {
                  entry.dataKey === 'Occupancy %' ? `${entry.value}%` :
                  entry.dataKey === 'ADR' || entry.dataKey === 'RevPAR' ? `$${entry.value}` :
                  entry.value
                }
              </p>
            ))}
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
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
                fontSize={12}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="ADR" fill="#8884d8" name="ADR ($)" />
              <Bar dataKey="Occupancy %" fill="#82ca9d" name="Occupancy %" />
              <Bar dataKey="RevPAR" fill="#ffc658" name="RevPAR ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
