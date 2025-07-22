/**
 * Individual Moodboard API
 * Get detailed moodboard information with models
 * Updated for 30-day challenge structure
 */

import { NextResponse } from 'next/server';
import { getMoodboardDetails } from '@/lib/data/moodboard-cache'

export async function GET(
  request: Request,
  context: { params: Record<string, string> }
) {
  // Example: return the id param as JSON
  return NextResponse.json({ id: context.params.id });
} 