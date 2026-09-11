'use client'

import { getUserFromCookie } from "@/lib/session";
import { createUser, getUsers } from "@/lib/users";
import { useEffect, useState } from "react";

const roleLabel: Record<string, string> = {
    admin: 'ผู้ดูแล ระบบ',
    librarian: 'บรรณารักษ์',
    member: 'สมาชิก',
}

const UsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('member');
  const [error, setError] = useState('');

  const currentUser = getUserFromCookie();
  const isAdmin = currentUser?.role === 'admin';

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError('โหลดข้อมูลไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await createUser(username, password, fullName, role);
      setUsername('');
      setPassword('');
      setFullName('');
      setRole('member');
      loadUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <p>กำลังโหลด...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">จัดการสมาชิก</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow mb-6 grid grid-cols-4 gap-2">
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />
        <input
          placeholder="ชื่อ-นามสกุล"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="member">สมาชิก</option>
          {/* librarian สร้างได้แค่ member ตาม backend rule — ซ่อน option นี้ถ้าไม่ใช่ admin */}
          {isAdmin && <option value="librarian">บรรณารักษ์</option>}
          {isAdmin && <option value="admin">ผู้ดูแลระบบ</option>}
        </select>
        <button type="submit" className="col-span-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          เพิ่มสมาชิก
        </button>
      </form>

      <div className="bg-white rounded shadow divide-y">
        {users.map((u) => (
          <div key={u.user_id} className="p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">{u.full_name}</p>
              <p className="text-sm text-gray-500">@{u.username}</p>
            </div>
            <span className="text-sm px-2 py-1 rounded bg-gray-100 text-gray-700">
              {roleLabel[u.role] || u.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
export default UsersPage