import { getToken } from './session';

const API_URL = 'http://localhost:3000';

export async function getUsers() {
  const res = await fetch(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error('โหลดข้อมูลสมาชิกไม่สำเร็จ');
  return res.json();
}

export async function createUser(username: string, password: string, fullName: string, role: string) {
  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ username, password, fullName, role }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'สร้างสมาชิกไม่สำเร็จ');
  }
  return res.json();
}