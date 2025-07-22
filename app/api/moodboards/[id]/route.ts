import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: any
) {
  return NextResponse.json({ id: context.params.id });
} 