import { getToken } from './session';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getBooks() {
  const res = await fetch(`${API_URL}/books`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error('โหลดข้อมูลหนังสือไม่สำเร็จ');
  return res.json();
}

export async function createBook(title: string, author: string, publishedYear: number) {
  const res = await fetch(`${API_URL}/books`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ title, author, publishedYear }),
  });
  if (!res.ok) throw new Error('เพิ่มหนังสือไม่สำเร็จ');
  return res.json();
}

export async function updateBook(bookId: number, title: string, author: string, publishedYear: number) {
  const res = await fetch(`${API_URL}/books/${bookId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ title, author, publishedYear }),
  });
  if (!res.ok) throw new Error('แก้ไขหนังสือไม่สำเร็จ');
  return res.json();
}

export async function deleteBook(bookId: number) {
  const res = await fetch(`${API_URL}/books/${bookId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error('ลบหนังสือไม่สำเร็จ');
  return res.json();
}