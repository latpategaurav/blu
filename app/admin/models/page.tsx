import { NextResponse, type NextRequest } from 'next/server';

export async function GET(
  request: Request,
  context: { params: Record<string, string> }
) {
  // use context.params.id
} 