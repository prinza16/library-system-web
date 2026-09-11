"use client";

import { getToken, getUserFromCookie, logout } from "@/lib/session";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MdDashboard, MdLibraryBooks } from "react-icons/md";
import {
  FaBook,
  FaExchangeAlt,
  FaExclamationTriangle,
  FaUsers,
} from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = getToken();
    const userData = getUserFromCookie();

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    setUser(userData);
    setChecking(false);
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        กำลังตรวจสอบสิทธิ์...
      </div>
    );
  }
  return (
    <div className="min-h-screen flex">
      <aside className="w-56 bg-gray-800 text-white p-4">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
          <MdLibraryBooks size={20} /> Library System
        </h2>
        <nav className="space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 hover:bg-gray-700 px-3 py-2 rounded"
          >
            <MdDashboard size={18} /> Dashboard
          </Link>
          <Link
            href="/books"
            className="flex items-center gap-2 hover:bg-gray-700 px-3 py-2 rounded"
          >
            <FaBook size={16} /> หนังสือ
          </Link>
          <Link
            href="/borrowings"
            className="flex items-center gap-2 hover:bg-gray-700 px-3 py-2 rounded"
          >
            <FaExchangeAlt size={16} /> ยืม-คืน
          </Link>
          {(user?.role === "admin" || user?.role === "librarian") && (
            <>
              <Link
                href="/borrowings/overdue"
                className="flex items-center gap-2 hover:bg-gray-700 px-3 py-2 rounded"
              >
                <FaExclamationTriangle size={16} /> รายงานเกินกำหนด
              </Link>
              <Link
                href="/users"
                className="flex items-center gap-2 hover:bg-gray-700 px-3 py-2 rounded"
              >
                <FaUsers size={16} /> สมาชิก
              </Link>
            </>
          )}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <span className="text-sm text-gray-600">
            สวัสดี, <strong>{user?.full_name}</strong> ({user?.role})
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-sm px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer"
          >
            <FiLogOut size={14} /> ออกจากระบบ
          </button>
        </header>

        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
};
export default ProtectedLayout;
