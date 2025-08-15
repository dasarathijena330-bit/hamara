import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { loans } from '@/db/schema';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single loan by ID
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const loan = await db.select()
        .from(loans)
        .where(eq(loans.id, parseInt(id)))
        .limit(1);

      if (loan.length === 0) {
        return NextResponse.json({ 
          error: 'Loan not found',
          code: 'LOAN_NOT_FOUND' 
        }, { status: 404 });
      }

      return NextResponse.json(loan[0]);
    }

    // List loans with pagination, search, filtering, and sorting
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    // Build where conditions
    const conditions = [];
    
    if (search) {
      conditions.push(like(loans.borrowerName, `%${search}%`));
    }
    
    if (status) {
      conditions.push(eq(loans.status, status));
    }

    // Start building the query
    let query = db.select().from(loans)
      .$dynamic(); // Use $dynamic() for conditional chaining

    // Add sorting
    // Apply where clause if conditions exist
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    if ((sort === 'amount' || sort === 'startDate' || sort === 'createdAt') && (order === 'asc' || order === 'desc')) {
      query = order === 'asc' 
        ? query.orderBy(asc(loans.amount))
        : query.orderBy(desc(loans.amount));
    } else if (sort === 'startDate') {
      query = order === 'asc' 
        ? query.orderBy(asc(loans.startDate))
        : query.orderBy(desc(loans.startDate));
    } else {
      query = order === 'asc' 
        ? query.orderBy(asc(loans.createdAt))
        : query.orderBy(desc(loans.createdAt));
    }

    const results = await query.limit(limit).offset(offset).execute();
    return NextResponse.json(results);

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.borrowerName || typeof body.borrowerName !== 'string') {
      return NextResponse.json({ 
        error: "Borrower name is required",
        code: "MISSING_BORROWER_NAME" 
      }, { status: 400 });
    }

    if (!body.amount || typeof body.amount !== 'number' || body.amount <= 0) {
      return NextResponse.json({ 
        error: "Amount is required and must be a positive number",
        code: "INVALID_AMOUNT" 
      }, { status: 400 });
    }

    if (!body.interestRate || typeof body.interestRate !== 'number' || body.interestRate < 0 || body.interestRate > 100) {
      return NextResponse.json({ 
        error: "Interest rate is required and must be between 0 and 100",
        code: "INVALID_INTEREST_RATE" 
      }, { status: 400 });
    }

    if (!body.startDate || typeof body.startDate !== 'string') {
      return NextResponse.json({ 
        error: "Start date is required",
        code: "MISSING_START_DATE" 
      }, { status: 400 });
    }

    // Validate date format
    const dateTest = new Date(body.startDate);
    if (isNaN(dateTest.getTime())) {
      return NextResponse.json({ 
        error: "Start date must be a valid date string",
        code: "INVALID_START_DATE" 
      }, { status: 400 });
    }

    // Sanitize and prepare data
    const loanData = {
      borrowerName: body.borrowerName.trim(),
      amount: body.amount,
      interestRate: body.interestRate,
      startDate: body.startDate,
      notes: body.notes ? body.notes.trim() : null,
      status: body.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newLoan = await db.insert(loans)
      .values(loanData)
      .returning();

    return NextResponse.json(newLoan[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if loan exists
    const existingLoan = await db.select()
      .from(loans)
      .where(eq(loans.id, parseInt(id)))
      .limit(1);

    if (existingLoan.length === 0) {
      return NextResponse.json({ 
        error: 'Loan not found',
        code: 'LOAN_NOT_FOUND' 
      }, { status: 404 });
    }

    const body = await request.json();
    const updates: any = {};

    // Validate and sanitize fields if provided
    if (body.borrowerName !== undefined) {
      if (!body.borrowerName || typeof body.borrowerName !== 'string') {
        return NextResponse.json({ 
          error: "Borrower name must be a non-empty string",
          code: "INVALID_BORROWER_NAME" 
        }, { status: 400 });
      }
      updates.borrowerName = body.borrowerName.trim();
    }

    if (body.amount !== undefined) {
      if (typeof body.amount !== 'number' || body.amount <= 0) {
        return NextResponse.json({ 
          error: "Amount must be a positive number",
          code: "INVALID_AMOUNT" 
        }, { status: 400 });
      }
      updates.amount = body.amount;
    }

    if (body.interestRate !== undefined) {
      if (typeof body.interestRate !== 'number' || body.interestRate < 0 || body.interestRate > 100) {
        return NextResponse.json({ 
          error: "Interest rate must be between 0 and 100",
          code: "INVALID_INTEREST_RATE" 
        }, { status: 400 });
      }
      updates.interestRate = body.interestRate;
    }

    if (body.startDate !== undefined) {
      if (!body.startDate || typeof body.startDate !== 'string') {
        return NextResponse.json({ 
          error: "Start date must be a valid date string",
          code: "INVALID_START_DATE" 
        }, { status: 400 });
      }
      const dateTest = new Date(body.startDate);
      if (isNaN(dateTest.getTime())) {
        return NextResponse.json({ 
          error: "Start date must be a valid date string",
          code: "INVALID_START_DATE" 
        }, { status: 400 });
      }
      updates.startDate = body.startDate;
    }

    if (body.notes !== undefined) {
      updates.notes = body.notes ? body.notes.trim() : null;
    }

    if (body.status !== undefined) {
      if (typeof body.status !== 'string') {
        return NextResponse.json({ 
          error: "Status must be a string",
          code: "INVALID_STATUS" 
        }, { status: 400 });
      }
      updates.status = body.status;
    }

    // Always update updatedAt
    updates.updatedAt = new Date().toISOString();

    const updatedLoan = await db.update(loans)
      .set(updates)
      .where(eq(loans.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedLoan[0]);

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if loan exists
    const existingLoan = await db.select()
      .from(loans)
      .where(eq(loans.id, parseInt(id)))
      .limit(1);

    if (existingLoan.length === 0) {
      return NextResponse.json({ 
        error: 'Loan not found',
        code: 'LOAN_NOT_FOUND' 
      }, { status: 404 });
    }

    const deletedLoan = await db.delete(loans)
      .where(eq(loans.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Loan deleted successfully',
      deletedLoan: deletedLoan[0]
    });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}