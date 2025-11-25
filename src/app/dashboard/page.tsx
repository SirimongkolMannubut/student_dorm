'use client';

import { useEffect, useState } from 'react';
import { Building, CreditCard, FileText, Wrench, User, Bell } from 'lucide-react';
import Header from '../../components/Header';
import ProtectedRoute from '../../components/ProtectedRoute';
import { getUserFromToken, isAdmin } from '../../lib/auth';

export default function DashboardPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = getUserFromToken();
    setUser(userData);
    
    // Redirect admin to admin dashboard
    if (isAdmin()) {
      window.location.href = '/admin';
    }
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="pt-20 pb-8">
          <div className="max-w-6xl mx-auto px-4">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                ยินดีต้อนรับ, {user?.name}
              </h1>
              <p className="text-gray-600">
                ระบบจัดการหอพักมหาวิทยาลัยราชภัฏศรีสะเกษ
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <a href="/profile" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">ข้อมูลส่วนตัว</h3>
                    <p className="text-sm text-gray-600">จัดการข้อมูลของคุณ</p>
                  </div>
                </div>
              </a>

              <a href="/rooms" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Building className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">ดูหอพัก</h3>
                    <p className="text-sm text-gray-600">ค้นหาห้องพัก</p>
                  </div>
                </div>
              </a>

              <a href="/payment-history" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <CreditCard className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">ประวัติการชำระ</h3>
                    <p className="text-sm text-gray-600">ดูการชำระเงิน</p>
                  </div>
                </div>
              </a>

              <a href="/maintenance" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <Wrench className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">แจ้งซ่อม</h3>
                    <p className="text-sm text-gray-600">รายงานปัญหา</p>
                  </div>
                </div>
              </a>
            </div>

            {/* Status Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">สถานะการสมัคร</h2>
              <div className="flex items-center">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user?.status === 'approved' ? 'bg-green-100 text-green-800' :
                  user?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {user?.status === 'approved' && 'อนุมัติแล้ว'}
                  {user?.status === 'pending' && 'รออนุมัติ'}
                  {user?.status === 'rejected' && 'ปฏิเสธ'}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}