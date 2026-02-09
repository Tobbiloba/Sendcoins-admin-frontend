import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Filter, Add, Edit2, Trash, ArrowDown2 } from 'iconsax-react';

export default function PartnerAccounts() {
  const accounts = [
    {
      name: 'Sendcoins_Acc',
      bank: 'First Bank',
      corridor: 'Nigeria',
      flag: '🇳🇬',
      currency: 'NGN',
      accountNumber: '0123456789',
      totalTx: '10,000',
      pendingTx: '2,000',
      completedTx: '8,000',
      status: 'Active'
    },
    {
      name: 'Sendcoins_Acc',
      bank: 'Gurantee trust bank',
      corridor: 'Nigeria',
      flag: '🇳🇬',
      currency: 'NGN',
      accountNumber: '0123456789',
      totalTx: '10,000',
      pendingTx: '2,000',
      completedTx: '8,000',
      status: 'Active'
    },
    {
      name: 'Sendcoins_Acc',
      bank: 'UBA',
      corridor: 'Nigeria',
      flag: '🇳🇬',
      currency: 'NGN',
      accountNumber: '0123456789',
      totalTx: '10,000',
      pendingTx: '2,000',
      completedTx: '8,000',
      status: 'Active'
    }
  ];

  return (
    <DashboardLayout title="Partner receiving accounts">
      {/* Filters & Actions */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-600 flex items-center gap-2 hover:bg-gray-100 transition-colors">
            <Filter size="16" />
            Filter
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center">1</span>
          </button>

          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
            Currency includes
            <div className="flex -space-x-1">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-[10px] border border-white">🇳🇬</div>
              <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center text-[10px] border border-white">₿</div>
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-[10px] border border-white">🇨🇦</div>
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px] border border-white">🌐</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
            Users includes
            <div className="flex -space-x-2">
              {[1,2].map(i => (
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
          Add new account
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50/50 text-gray-500 uppercase text-[10px] font-medium tracking-wider">
            <tr>
              <th className="px-6 py-4">Account Name</th>
              <th className="px-6 py-4">Bank Name</th>
              <th className="px-6 py-4">Corridor</th>
              <th className="px-6 py-4">Currency</th>
              <th className="px-6 py-4">Account Number</th>
              <th className="px-6 py-4">Total Transactions</th>
              <th className="px-6 py-4">Pending Transaction</th>
              <th className="px-6 py-4">Completed Transact</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {accounts.map((acc, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-gray-900">{acc.name}</td>
                <td className="px-6 py-4 text-gray-600">{acc.bank}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-900 font-medium">
                    <span className="text-lg">{acc.flag}</span>
                    {acc.corridor}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{acc.currency}</td>
                <td className="px-6 py-4 text-gray-600 font-mono">{acc.accountNumber}</td>
                <td className="px-6 py-4 text-gray-600">{acc.totalTx}</td>
                <td className="px-6 py-4 text-gray-600">{acc.pendingTx}</td>
                <td className="px-6 py-4 text-gray-600">{acc.completedTx}</td>
                <td className="px-6 py-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-green-700 bg-green-50">
                    {acc.status}
                    <ArrowDown2 size="10" />
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                     <button className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
                      <Trash size="16" />
                    </button>
                    <button className="p-1.5 hover:bg-blue-50 text-gray-400 hover:text-blue-500 rounded-lg transition-colors">
                      <Edit2 size="16" />
                    </button>
                  </div>
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
