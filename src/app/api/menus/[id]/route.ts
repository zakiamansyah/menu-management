import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const menu = await prisma.menu.findUnique({
      where: {
        id: params.id,
      }
    });

    if (!menu) {
      return NextResponse.json(
        { error: 'Menu not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(menu);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch menu' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, parentId, parentName, depth } = body;

    const menu = await prisma.menu.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        parentId,
        parentName,
        depth,
      },
    });

    return NextResponse.json(menu);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update menu' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.menu.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete menu' },
      { status: 500 }
    );
  }
}