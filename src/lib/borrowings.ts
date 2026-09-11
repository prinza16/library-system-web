import { getToken } from './session';

const API_URL = 'http://localhost:3000';

async function authFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'เกิดข้อผิดพลาด');
  }
  return res.json();
}

export const getMyBorrowings = () => authFetch('/borrowings/my');
export const borrowBook = (bookId: number) =>
  authFetch('/borrowings/borrow', { method: 'POST', body: JSON.stringify({ bookId }) });
export const returnBook = (borrowId: number) =>
  authFetch(`/borrowings/return/${borrowId}`, { method: 'POST' });
export const getAllBorrowings = () => authFetch('/borrowings');
export const getOverdueBorrowings = () => authFetch('/borrowings/overdue');