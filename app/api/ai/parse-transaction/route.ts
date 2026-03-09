import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import OpenAI from 'openai';
import { z } from 'zod';

// Initialize Groq client using OpenAI SDK (Groq is OpenAI-compatible)
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || '',
  baseURL: 'https://api.groq.com/openai/v1',
});

// Validation schema for parsed transaction
const parsedTransactionSchema = z.object({
  amount: z.number().positive(),
  category: z.string().min(1),
  type: z.enum(['INCOME', 'EXPENSE', 'INVESTMENT']),
  date: z.string().datetime(),
  notes: z.string().optional(),
});

// POST /api/ai/parse-transaction - Parse natural language transaction
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'Groq API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { message, conversationHistory } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // System prompt for transaction parsing
    const systemPrompt = `You are a financial transaction parser. Extract transaction details from natural language and return them in JSON format.

Current date: ${new Date().toISOString()}

Valid transaction types:
- INCOME: salary, business, passive, other
- EXPENSE: food, rent, travel, shopping, bills, entertainment, healthcare, education, other
- INVESTMENT: stocks, mutual_funds, gold, real_estate, fixed_deposits, crypto, other

Rules:
1. Parse relative dates (yesterday, last week, March 5, etc.) to ISO 8601 format
2. Extract amount as a positive number
3. Determine transaction type (INCOME/EXPENSE/INVESTMENT)
4. Map to appropriate category
5. Extract any additional context as notes
6. If multiple transactions in one message, return an array
7. Default to today's date if not specified
8. For expenses, common patterns: "spent", "paid", "bought"
9. For income, common patterns: "received", "earned", "got paid"
10. For investments, common patterns: "invested", "bought stocks", "deposited"

Response format (single transaction):
{
  "amount": 5000,
  "category": "salary",
  "type": "INCOME",
  "date": "2026-03-09T00:00:00.000Z",
  "notes": "Monthly salary"
}

Response format (multiple transactions):
{
  "transactions": [
    { "amount": 500, "category": "food", "type": "EXPENSE", "date": "2026-03-08T00:00:00.000Z", "notes": "Groceries" },
    { "amount": 200, "category": "travel", "type": "EXPENSE", "date": "2026-03-08T00:00:00.000Z", "notes": "Uber" }
  ]
}

Examples:
- "Spent 500 on groceries yesterday" → EXPENSE, food, yesterday's date
- "Received salary of 50000" → INCOME, salary, today's date
- "Invested 10000 in mutual funds on March 1" → INVESTMENT, mutual_funds, March 1
- "Paid rent 15000 and electricity bill 2000 last week" → Multiple EXPENSE transactions

IMPORTANT: Return ONLY valid JSON. Do not include any markdown formatting or code blocks.`;

    // Build messages array for chat completion
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
    ];
    
    // Add conversation history if provided
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.forEach((msg: any) => {
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({
            role: msg.role,
            content: msg.content,
          });
        }
      });
    }
    
    // Add current user message
    messages.push({ role: 'user', content: message });

    // Call Groq API using OpenAI SDK
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: messages,
      temperature: 0.3,
      max_tokens: 1024,
      response_format: { type: 'json_object' }, // Enable JSON mode
    });

    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      );
    }

    // Parse AI response (should be valid JSON due to json_object mode)
    const parsedResponse = JSON.parse(responseContent);

    // Validate and normalize the response
    let transactions = [];
    
    if (parsedResponse.transactions && Array.isArray(parsedResponse.transactions)) {
      // Multiple transactions
      transactions = parsedResponse.transactions;
    } else if (parsedResponse.amount) {
      // Single transaction
      transactions = [parsedResponse];
    } else {
      return NextResponse.json(
        { error: 'Could not parse transaction from message' },
        { status: 400 }
      );
    }

    // Validate each transaction
    const validatedTransactions = transactions.map((t: any) => {
      try {
        return parsedTransactionSchema.parse(t);
      } catch (error) {
        console.error('Validation error:', error);
        throw new Error(`Invalid transaction data: ${JSON.stringify(t)}`);
      }
    });

    return NextResponse.json({
      transactions: validatedTransactions,
      aiResponse: {
        role: 'assistant',
        content: responseContent,
      },
    });

  } catch (error: any) {
    console.error('Error parsing transaction:', error);
    
    if (error.message?.includes('Invalid transaction data')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to parse transaction. Please try rephrasing your message.' },
      { status: 500 }
    );
  }
}

// Made with Bob