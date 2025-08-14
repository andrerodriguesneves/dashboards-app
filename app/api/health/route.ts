import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    message: 'Health check successful'
  });
}

export async function POST() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    method: 'POST',
    message: 'POST request successful'
  });
}
