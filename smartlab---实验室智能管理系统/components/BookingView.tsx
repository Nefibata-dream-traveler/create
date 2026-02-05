
import React, { useState } from 'react';
import { ICONS, MOCK_EQUIPMENT, MOCK_BOOKINGS } from '../constants';

const BookingView: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('2024-06-20');
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(MOCK_EQUIPMENT[0].id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);

  const slots = [
    '08:00 - 10:00', '10:00 - 12:00', '12:00 - 14:00', '14:00 - 16:00', '16:00 - 18:00', '18:00 - 20:00'
  ];

  const selectedEquipment = MOCK_EQUIPMENT.find(eq => eq.id === selectedEquipmentId);

  const handleSlotClick = (slot: string, isTaken: boolean) => {
    if (!isTaken) {
      setActiveSlot(slot);
      setIsModalOpen(true);
    }
  };

  const confirmBooking = () => {
    // 实际应用中这里会调用 API
    setIsModalOpen(false);
    setActiveSlot(null);
    alert(`预约成功：${selectedEquipment?.name} (${activeSlot})`);
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold">设备预约系统</h2>
        <p className="text-slate-500">分时段锁定仪器资源，支持准入权限自动校验</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* 日历/日期选择模拟 */}
        <div className="w-full lg:w-72 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <ICONS.Booking size={18} className="text-blue-600" /> 选择日期
          </h3>
          <div className="grid grid-cols-7 gap-1 text-center mb-4">
            {['一','二','三','四','五','六','日'].map(d => <div key={d} className="text-[10px] text-slate-400 font-bold">{d}</div>)}
            {Array.from({length: 30}, (_, i) => i + 1).map(d => (
              <div 
                key={d} 
                className={`py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors
                  ${d === 20 ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-50'}
                `}
              >
                {d}
              </div>
            ))}
          </div>
          <div className="p-3 bg-blue-50 rounded-xl">
            <p className="text-xs text-blue-700 font-medium">提示: 仅显示未来 7 天的预约档位。</p>
          </div>
        </div>

        {/* 预约网格 */}
        <div className="flex-1 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <select 
                value={selectedEquipmentId}
                onChange={(e) => setSelectedEquipmentId(e.target.value)}
                className="bg-slate-50 border-none rounded-lg text-sm font-bold p-2 outline-none"
              >
                {MOCK_EQUIPMENT.map(eq => <option key={eq.id} value={eq.id}>{eq.name}</option>)}
              </select>
              <div className="flex items-center gap-4 text-xs font-bold">
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-100 rounded"></div> 闲置</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-100 rounded"></div> 我的</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-50 rounded border border-red-100"></div> 已占</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {slots.map((slot, idx) => {
                const isTaken = idx === 1 || idx === 3; // 模拟占用
                return (
                  <div 
                    key={slot}
                    onClick={() => handleSlotClick(slot, isTaken)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer
                      ${isTaken 
                        ? 'bg-slate-50 border-slate-100 text-slate-400 grayscale cursor-not-allowed' 
                        : 'bg-white border-slate-100 hover:border-blue-300 hover:shadow-sm'}
                    `}
                  >
                    <p className="text-xs font-bold mb-1">{slot}</p>
                    {isTaken ? (
                      <p className="text-[10px]">已经被张同学预约</p>
                    ) : (
                      <p className="text-[10px] text-blue-600 font-bold">点击预约</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* 我的预约 */}
          <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-xl">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <ICONS.Check size={20} className="text-indigo-300" /> 近期我的预约
            </h4>
            <div className="space-y-3">
              {MOCK_BOOKINGS.filter(b => b.userId === 'U-101').map(b => (
                <div key={b.id} className="flex items-center justify-between p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div>
                    <p className="text-sm font-bold">{b.equipmentName}</p>
                    <p className="text-[10px] text-indigo-200">{b.date} • {b.slot}</p>
                  </div>
                  <span className="text-[10px] font-bold bg-indigo-500/50 px-2 py-1 rounded">已准入</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 确认预约模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <ICONS.Booking size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">确认预约信息</h3>
                  <p className="text-sm text-slate-500">请核对以下预约详情</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500">预约设备</span>
                  <span className="text-sm font-bold text-slate-900">{selectedEquipment?.name}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500">预约日期</span>
                  <span className="text-sm font-bold text-slate-900">{selectedDate}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500">预约时段</span>
                  <span className="text-sm font-bold text-blue-600">{activeSlot}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500">预约人员</span>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">陈</div>
                    <span className="text-sm font-bold text-slate-900">陈老师</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={confirmBooking}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                  确认预约
                </button>
              </div>
            </div>
            <div className="bg-amber-50 p-3 flex items-center gap-2">
              <ICONS.Alert size={14} className="text-amber-600" />
              <p className="text-[10px] text-amber-700">预约成功后将同步至您的准入证权限，请准时到场。</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingView;
