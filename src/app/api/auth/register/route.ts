import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { studentId, name, email, password, year } = await request.json();

    // Basic validation
    if (!studentId || !name || !email || !password || !year) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Here you would typically save to a database
    // For now, just return success
    console.log('Registration data:', { studentId, name, email, year });

    return NextResponse.json({ message: 'Registration successful' }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
