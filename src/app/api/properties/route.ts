import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const props = await prisma.property.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(props);
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { 
        error: 'Database connection failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const schema = z.object({
      name: z.string().min(1),
      city: z.string().min(1),
      state: z.string().length(2),
      rooms: z.number().int().positive(),
      adr: z.number().nonnegative(),
      occupancy: z.number().min(0).max(1),
      revpar: z.number().nonnegative(),
    });

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(parsed.error.format(), { status: 400 });
    }

    const created = await prisma.property.create({ data: parsed.data });
    
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create property', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
