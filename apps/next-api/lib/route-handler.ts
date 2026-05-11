import { NextResponse } from 'next/server';
import { ApiError } from './errors';
import { ZodError } from 'zod';

export function createHandler(
  handler: (req: Request, context: any) => Promise<any>,
) {
  return async (req: Request, context: any) => {
    try {
      const result = await handler(req, context);
      if (result instanceof NextResponse) return result;
      return NextResponse.json(result);
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json(
          { message: error.message, code: error.code },
          { status: error.status },
        );
      }
      if (error instanceof ZodError) {
        return NextResponse.json(
          { message: 'Validation Error', errors: error.issues },
          { status: 400 },
        );
      }
      console.error('[Unhandled Error]', error);
      return NextResponse.json(
        { message: 'Internal Server Error' },
        { status: 500 },
      );
    }
  };
}
