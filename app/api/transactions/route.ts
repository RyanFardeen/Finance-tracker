import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema
const transactionSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE', 'INVESTMENT']),
  category: z.string().min(1),
  amount: z.number().positive(),
  date: z.string().datetime(),
  notes: z.string().optional(),
});

// GET /api/transactions - Get all transactions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build where clause
    const where: any = { userId: session.user.id };
    
    if (type) where.type = type;
    if (category) where.category = category;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    // Convert Decimal to number for JSON serialization
    const serializedTransactions = transactions.map(t => ({
      ...t,
      amount: Number(t.amount),
    }));

    return NextResponse.json(serializedTransactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

// POST /api/transactions - Create a new transaction
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify user exists in database
    const userExists = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!userExists) {
      console.error('User not found in database:', session.user.id);
      return NextResponse.json(
        { error: 'User not found. Please sign out and sign in again.' },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Validate transaction data
    const validatedData = transactionSchema.parse(body);

    const transaction = await prisma.transaction.create({
      data: {
        ...validatedData,
        userId: session.user.id,
        date: new Date(validatedData.date),
      },
    });

    // Convert Decimal to number for JSON serialization
    const serializedTransaction = {
      ...transaction,
      amount: Number(transaction.amount),
    };

    return NextResponse.json(serializedTransaction, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid transaction data', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}

// Made with Bob
