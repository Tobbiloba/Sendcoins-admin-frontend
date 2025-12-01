import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Filter, Add, RecordCircle, ArrowDown2, ShieldTick } from 'iconsax-react';

export default function Users() {
  const users = Array(6).fill({
    id: '902A3',
    name: 'Olivia Rhye',
    email: 'olivia@untitledui.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    type: 'Individual',
    kyc: 'Verified',
    lastActivity: 'Nov 2, 2025...',
    status: 'Active',
    wallets: '2,000',
    amount: '2,000',
    dateJoined: '3'
  });

  return (
    <DashboardLayout title="Users">
      {/* Filters & Actions */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-600 flex items-center gap-2 hover:bg-gray-100 transition-colors">
            <Filter size="16" />
            Filter
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center">1</span>
          </button>

          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
            wallets includes
            <div className="flex -space-x-1">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-[10px]">🇳🇬</div>
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-[10px]">🇨🇦</div>
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px]">🌐</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
            Users includes
            <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-5 h-5 rounded-full bg-gray-200 border border-white" />
              ))}
              <div className="w-5 h-5 rounded-full bg-gray-200 border border-white flex items-center justify-center text-[10px] font-medium text-gray-600">
                +5
              </div>
            </div>
          </div>
        </div>

        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
          <Add size="16" />
          Add new user
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-5 gap-8 mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-3 h-3 border border-blue-500 rounded-sm flex items-center justify-center">
               <div className="w-1.5 h-1.5 bg-blue-500 rounded-sm" />
            </div>
            Total users
          </div>
          <div className="text-2xl font-bold">5,000</div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-3 h-3 border border-green-500 rounded-sm" />
            Active users
          </div>
          <div className="text-2xl font-bold">3,000</div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-3 h-3 border border-yellow-500 rounded-sm" />
            Pending users
          </div>
          <div className="text-2xl font-bold">200</div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-3 h-3 border border-red-500 rounded-sm" />
            Flagged users
          </div>
          <div className="text-2xl font-bold">1,800</div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-3 h-3 border border-gray-500 rounded-sm" />
            Deactivated users
          </div>
          <div className="text-2xl font-bold">1,800</div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50/50 text-gray-500 uppercase text-[10px] font-medium tracking-wider">
            <tr>
              <th className="px-6 py-4">User ID</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Account Type</th>
              <th className="px-6 py-4">KYC</th>
              <th className="px-6 py-4">Last Activity</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">No of Wallets</th>
              <th className="px-6 py-4">Total Amount ($)</th>
              <th className="px-6 py-4">Date Joined</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{user.id}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{user.type}</td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                     {user.kyc}
                     <ShieldTick size="14" variant="Bold" />
                   </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{user.lastActivity}</td>
                <td className="px-6 py-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-green-700 bg-green-50">
                    {user.status}
                    <ArrowDown2 size="10" />
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{user.wallets}</td>
                <td className="px-6 py-4 text-gray-600">{user.amount}</td>
                <td className="px-6 py-4 text-gray-600">{user.dateJoined}</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1 hover:bg-gray-100 rounded-full text-gray-400">
                    <RecordCircle size="16" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between text-sm text-gray-500">
          <div>Page 1 of 1</div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
