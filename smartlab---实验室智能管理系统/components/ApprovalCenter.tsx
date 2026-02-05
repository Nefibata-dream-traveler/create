
import React, { useState } from 'react';
import { ICONS, MOCK_BOOKINGS, MOCK_REQUESTS } from '../constants';
import { Booking, ConsumableRequest } from '../types';

const ApprovalCenter: React.FC = () => {
  // 使用本地状态管理待审批列表，以便在操作后实时移除
  const [pendingBookings, setPendingBookings] = useState<Booking[]>(
    MOCK_BOOKINGS.filter(b => b.status === 'PENDING')
  );
  const [pendingRequests, setPendingRequests] = useState<ConsumableRequest[]>(
    MOCK_REQUESTS.filter(r => r.status === 'PENDING')
  );

  const handleBookingAction = (id: string, action: 'APPROVE' | 'REJECT') => {
    // 实际应用中会调用 API
    setPendingBookings(prev => prev.filter(b => b.id !== id));
    console.log(`预约 ${id} 已${action === 'APPROVE' ? '通过' : '驳回'}`);
  };

  const handleRequestAction = (id: string, action: 'APPROVE' | 'REJECT') => {
    // 实际应用中会调用 API
    setPendingRequests(prev => prev.filter(r => r.id !== id));
    console.log(`领用申请 ${id} 已${action === 'APPROVE' ? '同意' : '驳回'}`);
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold">审批决策中心</h2>
        <p className="text-slate-500">统一处理预约申请、耗材申领及异常反馈</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 设备预约审批 */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center shrink-0">
            <h3 className="font-bold flex items-center gap-2">
              <ICONS.Booking size={18} className="text-blue-600" /> 设备预约待审
            </h3>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
              {pendingBookings.length} 项
            </span>
          </div>
          <div className="divide-y divide-slate-50 overflow-y-auto max-h-[600px]">
            {pendingBookings.length > 0 ? (
              pendingBookings.map(booking => (
                <div key={booking.id} className="p-4 hover:bg-slate-50 transition-colors animate-in fade-in slide-in-from-right-2 duration-300">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-slate-900">{booking.equipmentName}</p>
                      <p className="text-xs text-slate-500">{booking.userName} • {booking.date}</p>
                    </div>
                    <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">{booking.slot}</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button 
                      onClick={() => handleBookingAction(booking.id, 'APPROVE')}
                      className="flex-1 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm active:scale-95"
                    >
                      批准
                    </button>
                    <button 
                      onClick={() => handleBookingAction(booking.id, 'REJECT')}
                      className="flex-1 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-200 transition-colors active:scale-95"
                    >
                      驳回
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-slate-400">
                <ICONS.Check size={48} className="mx-auto mb-2 opacity-20" />
                <p className="text-sm">暂无待处理的设备预约</p>
              </div>
            )}
          </div>
        </div>

        {/* 耗材申领审批 */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center shrink-0">
            <h3 className="font-bold flex items-center gap-2">
              <ICONS.Inventory size={18} className="text-amber-600" /> 耗材申领待审
            </h3>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">
              {pendingRequests.length} 项
            </span>
          </div>
          <div className="divide-y divide-slate-50 overflow-y-auto max-h-[600px]">
            {pendingRequests.length > 0 ? (
              pendingRequests.map(req => (
                <div key={req.id} className="p-4 hover:bg-slate-50 transition-colors animate-in fade-in slide-in-from-left-2 duration-300">
                  <div className="mb-2">
                    <div className="flex justify-between">
                      <p className="font-bold text-slate-900">{req.itemName}</p>
                      <p className="text-sm font-bold text-amber-600">{req.quantity} {req.unit}</p>
                    </div>
                    <p className="text-xs text-slate-500">申请人: {req.requester} • 用途: {req.reason}</p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button 
                      onClick={() => handleRequestAction(req.id, 'APPROVE')}
                      className="flex-1 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm active:scale-95"
                    >
                      同意领用
                    </button>
                    <button 
                      onClick={() => handleRequestAction(req.id, 'REJECT')}
                      className="flex-1 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-200 transition-colors active:scale-95"
                    >
                      驳回
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-slate-400">
                <ICONS.Check size={48} className="mx-auto mb-2 opacity-20" />
                <p className="text-sm">暂无待处理的领用申请</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalCenter;
