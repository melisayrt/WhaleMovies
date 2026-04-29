import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("-> Next.js Bridge: Sending data to Python...");

    const response = await fetch('http://127.0.0.1:8000/daily-picks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error("-> Python Error:", response.status);
      return NextResponse.json({ error: "Python side error" }, { status: 500 });
    }

    const data = await response.json();
    console.log("-> Success: Received", data.length, "movies from Python.");
    return NextResponse.json(data);
  } catch (error) {
    console.error("-> CRITICAL ERROR:", error);
    return NextResponse.json({ error: "Connection to Python failed" }, { status: 500 });
  }
}