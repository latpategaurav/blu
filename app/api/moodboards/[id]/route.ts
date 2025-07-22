import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: { params: Record<string, string> }
) {
  return NextResponse.json({ id: context.params.id });
} 