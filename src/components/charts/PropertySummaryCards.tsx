'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, DollarSign, TrendingUp, Users } from 'lucide-react';

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

interface PropertySummaryCardsProps {
  properties: Property[];
}

export function PropertySummaryCards({ properties }: PropertySummaryCardsProps) {
  // Calculate summary statistics
  const totalProperties = properties.length;
  const totalRooms = properties.reduce((sum, prop) => sum + prop.rooms, 0);
  const avgADR = properties.length > 0 
    ? properties.reduce((sum, prop) => sum + prop.adr, 0) / properties.length 
    : 0;
  const avgOccupancy = properties.length > 0 
    ? properties.reduce((sum, prop) => sum + prop.occupancy, 0) / properties.length 
    : 0;
  const avgRevPAR = properties.length > 0 
    ? properties.reduce((sum, prop) => sum + prop.revpar, 0) / properties.length 
    : 0;
  // const totalRevenue = properties.reduce((sum, prop) => sum + (prop.revpar * prop.rooms), 0);

  const summaryCards = [
    {
      title: "Total Properties",
      value: totalProperties.toString(),
      icon: Building,
      description: `${totalRooms} total rooms`,
      color: "text-blue-600"
    },
    {
      title: "Average ADR",
      value: `$${avgADR.toFixed(2)}`,
      icon: DollarSign,
      description: "Average Daily Rate",
      color: "text-green-600"
    },
    {
      title: "Average Occupancy",
      value: `${(avgOccupancy * 100).toFixed(1)}%`,
      icon: Users,
      description: "Across all properties",
      color: "text-purple-600"
    },
    {
      title: "Average RevPAR",
      value: `$${avgRevPAR.toFixed(2)}`,
      icon: TrendingUp,
      description: "Revenue per Available Room",
      color: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {summaryCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-gray-500 mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
