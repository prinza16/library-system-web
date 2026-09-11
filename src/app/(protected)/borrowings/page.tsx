'use client'

import { getBooks } from "@/lib/books";
import { borrowBook, getMyBorrowings, returnBook } from "@/lib/borrowings";
import { useEffect, useState } from "react";

const BorrowingsPage = () => {
  const [borrowings, setBorrowings] = useState<any[]>([]);
  const [availableBooks, setAvailableBooks] = useState<any[]>([]);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [myBorrowings, books] = await Promise.all([getMyBorrowings(), getBooks()]);
      setBorrowings(myBorrowings);
      setAvailableBooks(books.filter((b: any) => b.is_available));
    } catch (err) {
      setError('โหลดข้อมูลไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await borrowBook(parseInt(selectedBookId));
      setSelectedBookId('');
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleReturn = async (borrowId: number) => {
    setError('');
    try {
      await returnBook(borrowId);
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <p>กำลังโหลด...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">ยืม-คืนหนังสือ</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleBorrow} className="bg-white p-4 rounded shadow mb-6 flex gap-2">
        <select
          value={selectedBookId}
          onChange={(e) => setSelectedBookId(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
          required
        >
          <option value="">เลือกหนังสือที่จะยืม</option>
          {availableBooks.map((book) => (
            <option key={book.book_id} value={book.book_id}>
              {book.title}
            </option>
          ))}
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer">
          ยืมหนังสือ
        </button>
      </form>

      <h2 className="text-lg font-semibold mb-2">รายการที่ยืมของฉัน</h2>
      <div className="bg-white rounded shadow divide-y">
        {borrowings.length === 0 && <p className="p-4 text-gray-500">ยังไม่มีรายการยืม</p>}
        {borrowings.map((b) => (
          <div key={b.borrow_id} className="p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">{b.book_title}</p>
              <p className="text-sm text-gray-500">
                ยืม: {new Date(b.borrow_date).toLocaleDateString('th-TH')} · กำหนดคืน: {new Date(b.due_date).toLocaleDateString('th-TH')}
              </p>
              {b.status === 'returned' && (
                <p className="text-sm text-gray-500">คืนแล้ว · ค่าปรับ {b.fine_amount} บาท</p>
              )}
            </div>
            {b.status !== 'returned' && (
              <button
                onClick={() => handleReturn(b.borrow_id)}
                className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700"
              >
                คืนหนังสือ
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
export default BorrowingsPage