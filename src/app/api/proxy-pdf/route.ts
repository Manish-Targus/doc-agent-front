import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pdfUrl = searchParams.get('url');

  if (!pdfUrl) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

  try {
    const response = await fetch(pdfUrl);
    const data = await response.arrayBuffer();

    return new NextResponse(data, {
      headers: {
        'Content-Type': 'application/pdf',
        // This bypasses the browser's insecure connection check because 
        // the file is now coming from YOUR secure domain.
        'Content-Disposition': 'inline; filename="document.pdf"',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch PDF' }, { status: 500 });
  }
}