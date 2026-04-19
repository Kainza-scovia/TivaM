import { NextRequest, NextResponse } from 'next/server';

// In-memory store for vendors (in production, this would be a database)
const vendorsStore: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessName, businessCategory, whatsappNumber, description, photos } = body;

    // Validation
    if (!businessName || !businessCategory || !whatsappNumber || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create vendor object
    const vendor = {
      id: Date.now(),
      business_name: businessName,
      business_category: businessCategory,
      whatsapp_number: whatsappNumber,
      description: description,
      photos: photos || [],
      created_at: new Date().toISOString(),
      rating: 0,
      review_count: 0,
    };

    // Store vendor
    vendorsStore.push(vendor);

    return NextResponse.json(
      { vendor, message: 'Vendor profile created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');

    if (category) {
      // Filter vendors by category
      const filteredVendors = vendorsStore.filter(
        (vendor) => vendor.business_category === category
      );
      return NextResponse.json({ vendors: filteredVendors });
    }

    // Return all vendors
    return NextResponse.json({ vendors: vendorsStore });
  } catch (error) {
    console.error('[v0] API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vendors' },
      { status: 500 }
    );
  }
}
