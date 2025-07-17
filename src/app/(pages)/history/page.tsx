"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingState } from '@/components/home';

export default function HistoryPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/games/history');
  }, [router]);

  return <LoadingState />;
} 