'use client'

import { getOverdueBorrowings } from "@/lib/borrowings";
import { useEffect, useState } from "react";

const OverdueBorrowingsPage = () => {
  const [overdue, setOverdue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getOverdueBorrowings()
      .then(setOverdue)
      .catch(() => setError('โหลดข้อมูลไม่สำเร็จ (ต้องเป็น admin หรือ librarian เท่านั้น)'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>กำลังโหลด...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">รายการเกินกำหนดคืน</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {!error && overdue.length === 0 && (
        <p className="text-gray-500">ไม่มีรายการเกินกำหนดคืนในตอนนี้ 🎉</p>
      )}

      {overdue.length > 0 && (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">หนังสือ</th>
                <th className="p-3">ผู้ยืม</th>
                <th className="p-3">วันครบกำหนด</th>
                <th className="p-3">เกินมา (วัน)</th>
                <th className="p-3">ค่าปรับโดยประมาณ</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {overdue.map((row) => (
                <tr key={row.borrow_id}>
                  <td className="p-3">{row.book_title}</td>
                  <td className="p-3">{row.borrower_name}</td>
                  <td className="p-3">{new Date(row.due_date).toLocaleDateString('th-TH')}</td>
                  <td className="p-3 text-red-600 font-medium">{row.days_overdue}</td>
                  <td className="p-3">{row.estimated_fine} บาท</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
export default OverdueBorrowingsPage