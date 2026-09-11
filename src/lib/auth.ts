const API_URL = process.env.NEXT_PUBLIC_API_URL ;

export async function login(username: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error('เข้าสู่ระบบไม่สำเร็จ');
  }

  return res.json(); // { access_token, user }
}