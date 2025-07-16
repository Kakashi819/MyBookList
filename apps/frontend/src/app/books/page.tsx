import { Suspense } from 'react';
import BooksPageClient from './BooksPageClient';

export default function BooksPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BooksPageClient />
    </Suspense>
  );
}
