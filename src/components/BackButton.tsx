'use client';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      className="cursor-pointer w-auto self-start"
      variant="secondary"
      onClick={() => router.back()}
    >
      <ArrowLeft />
      Back
    </Button>
  );
}
