import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const menus = await prisma.menu.findMany({
      orderBy: {
        depth: 'asc',
      },
    });

    return NextResponse.json(menus);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch menus' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, parentId, parentName, depth } = body;

    const menu = await prisma.menu.create({
      data: {
      id,
      name,
      parentId,
      parentName,
      depth,
      },
    });

    return NextResponse.json(menu);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}