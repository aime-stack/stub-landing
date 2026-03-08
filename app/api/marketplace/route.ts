import { NextResponse } from 'next/server';
import { createProduct, searchProducts } from '@/services/marketplace';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || undefined;
    const category = searchParams.get('category') || undefined;

    const products = await searchProducts(query, category);
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const product = await createProduct(body);
    return NextResponse.json(product);
  } catch (error: any) {
    const status = error.message === 'Unauthorized' ? 41 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
