'use client';

import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import TransactionPartnerDetail from '@/components/TransactionPartnerDetail';

function DetailFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

export default function TransactionPartnerDetailPage() {
  return (
    <Suspense fallback={<DetailFallback />}>
      <TransactionPartnerDetail />
    </Suspense>
  );
}
