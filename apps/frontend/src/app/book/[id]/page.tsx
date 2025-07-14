'use client';

import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { BookModal } from '@/components/books/BookModal';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BookPage() {
  const params = useParams();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const bookId = params.id as string;

  const handleClose = () => {
    setIsModalOpen(false);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <BookModal
        bookId={bookId}
        isOpen={isModalOpen}
        onClose={handleClose}
      />
    </div>
  );
}
