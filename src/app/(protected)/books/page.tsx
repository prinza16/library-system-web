"use client";

import { createBook, deleteBook, getBooks, updateBook } from "@/lib/books";
import { getUserFromCookie } from "@/lib/session";
import { useEffect, useState } from "react";
import { FaPencilAlt, FaPlus, FaTrash } from "react-icons/fa";

const BooksPage = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");

  const user = getUserFromCookie();
  const canManage = user?.role === "admin" || user?.role === "librarian";

  const [editingId, setEditingId] = useState<number | null>(null);

  const loadBooks = async () => {
    try {
      const data = await getBooks();
      setBooks(data);
    } catch (err) {
      setError("โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const startEdit = (book: any) => {
    setEditingId(book.book_id);
    setTitle(book.title);
    setAuthor(book.author);
    setYear(String(book.published_year));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setAuthor("");
    setYear("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await updateBook(editingId, title, author, parseInt(year));
      } else {
        await createBook(title, author, parseInt(year));
      }
      cancelEdit();
      loadBooks();
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาด");
    }
  };

  const handleDelete = async (bookId: number) => {
    if (!confirm("ยืนยันการลบหนังสือเล่มนี้?")) return;
    try {
      await deleteBook(bookId);
      loadBooks();
    } catch (err: any) {
      setError(err.message || "ลบไม่สำเร็จ");
    }
  };

  if (loading) return <p>กำลังโหลด...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">รายการหนังสือ</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {canManage && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded shadow mb-6 flex gap-2"
        >
          <input
            placeholder="ชื่อหนังสือ"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded px-3 py-2 flex-1"
            required
          />
          <input
            placeholder="ผู้แต่ง"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="border rounded px-3 py-2 flex-1"
          />
          <input
            placeholder="ปีที่พิมพ์"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border rounded px-3 py-2 w-32"
          />
          <button
            type="submit"
            className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
          >
            <FaPlus size={12} /> {editingId ? 'บันทึก' : 'เพิ่ม'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 cursor-pointer"
            >
              ยกเลิก
            </button>
          )}
        </form>
      )}

      <div className="bg-white rounded shadow divide-y">
        {books.map((book) => (
          <div
            key={book.book_id}
            className="p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{book.title}</p>
              <p className="text-sm text-gray-500">
                {book.author} · {book.published_year}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`text-sm px-2 py-1 rounded ${book.is_available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              >
                {book.is_available ? "ว่าง" : "ถูกยืม"}
              </span>
              {canManage && (
                <>
                  <button
                    onClick={() => startEdit(book)}
                    className="flex items-center gap-1 text-sm px-3 py-1.5 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer"
                  >
                    <FaPencilAlt size={12} /> แก้ไข
                  </button>
                  <button
                    onClick={() => handleDelete(book.book_id)}
                    className="flex items-center gap-1 text-sm px-3 py-1.5 rounded bg-red-100 text-red-700 hover:bg-red-200 cursor-pointer"
                  >
                    <FaTrash size={12} /> ลบ
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default BooksPage;
