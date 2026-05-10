import { createHandler } from '@/lib/route-handler';
import { requireAdminAuth } from '@/lib/auth-utils';
import { uploadFile } from '@/lib/s3cloud';
import { ValidationError } from '@/lib/errors';
import { NextResponse } from 'next/server';

export const POST = createHandler(async (req) => {
  await requireAdminAuth();
  
  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    throw new ValidationError('No file provided');
  }

  console.log('[Upload] Processing file:', {
    name: file.name,
    size: file.size,
    type: file.type,
  });

  const url = await uploadFile(file);
  return NextResponse.json({ url }, { status: 201 });
});
