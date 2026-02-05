
import React, { useState } from 'react';
import { ICONS, MOCK_EQUIPMENT, MOCK_REPAIR_HISTORY } from '../constants';
import { EquipmentStatus, Equipment, RepairRecord } from '../types';
import { getSmartSOPAdvice } from '../services/geminiService';

const EquipmentView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingSOP, setViewingSOP] = useState<Equipment | null>(null);
  const [bookingEquipment, setBookingEquipment] = useState<Equipment | null>(null);
  const [viewingRepairHistory, setViewingRepairHistory] = useState<Equipment | null>(null);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  
  // AI 建议状态
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);

  const statusLabels: Record<EquipmentStatus, string> = {
    [EquipmentStatus.AVAILABLE]: '可用',
    [EquipmentStatus.IN_USE]: '使用中',
    [EquipmentStatus.MAINTENANCE]: '维护中',
    [EquipmentStatus.OUT_OF_ORDER]: '故障',
  };

  const statusColors: Record<EquipmentStatus, string> = {
    [EquipmentStatus.AVAILABLE]: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    [EquipmentStatus.IN_USE]: 'bg-blue-50 text-blue-600 border-blue-100',
    [EquipmentStatus.MAINTENANCE]: 'bg-amber-50 text-amber-600 border-amber-100',
    [EquipmentStatus.OUT_OF_ORDER]: 'bg-red-50 text-red-600 border-red-100',
  };

  const filteredEquipment = MOCK_EQUIPMENT.filter(eq => 
    eq.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    eq.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQuickBook = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`预约成功！\n设备：${bookingEquipment?.name}\n日期：${bookingDate}\n请在“智能预约”页面查看具体时段分配。`);
    setBookingEquipment(null);
  };

  const getRepairHistory = (equipmentId: string): RepairRecord[] => {
    return MOCK_REPAIR_HISTORY.filter(h => h.equipmentId === equipmentId);
  };

  const handleFetchAiAdvice = async (name: string) => {
    setIsLoadingAdvice(true);
    const advice = await getSmartSOPAdvice(name, "常见操作误区与效率优化");
    setAiAdvice(advice);
    setIsLoadingAdvice(false);
  };

  const closeSOP = () => {
    setViewingSOP(null);
    setAiAdvice(null);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">设备档案库</h2>
          <p className="text-slate-500">资产追踪与实时状态监控</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <input 
              type="text" 
              placeholder="搜索名称、型号或ID..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-slate-400">
              <ICONS.Dashboard size={16} />
            </div>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-md transition-all active:scale-95">
            扫码识别
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredEquipment.map(eq => (
          <div key={eq.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm group hover:shadow-md transition-all flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div className="p-2.5 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                <ICONS.Equipment size={24} />
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full border shadow-sm ${statusColors[eq.status]}`}>
                {statusLabels[eq.status]}
              </span>
            </div>

            <div className="mb-6 flex-1">
              <h4 className="font-bold text-lg leading-tight text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                {eq.name}
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{eq.id}</span>
              </div>
            </div>
            
            <div className="space-y-3 mb-6 p-4 bg-slate-50/50 rounded-xl border border-slate-50">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">设备型号</span>
                <span className="font-bold text-slate-700">{eq.model}</span>
              </div>
              <div className="h-[1px] bg-slate-100"></div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">上次维护</span>
                <span className="font-semibold text-slate-600">{eq.lastMaintenance}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">下次维护</span>
                <span className="font-bold text-blue-600">{eq.nextMaintenance}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setViewingSOP(eq)}
                  className="px-3 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  操作规程
                </button>
                <button 
                  disabled={eq.status !== EquipmentStatus.AVAILABLE}
                  onClick={() => setBookingEquipment(eq)}
                  className={`px-3 py-2 text-xs font-bold rounded-lg transition-all
                    ${eq.status === EquipmentStatus.AVAILABLE 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-100 active:scale-95' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
                  `}
                >
                  立即预约
                </button>
              </div>
              <button 
                onClick={() => setViewingRepairHistory(eq)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
              >
                <ICONS.Maintenance size={14} /> 维修记录
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 详细操作规程 (SOP) 模态框 */}
      {viewingSOP && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeSOP}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-slate-100 shrink-0">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <ICONS.Logs size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{viewingSOP.name}</h3>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{viewingSOP.model} 标准操作程序</p>
                  </div>
                </div>
                <button onClick={closeSOP} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                  <ICONS.Close size={24} />
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto space-y-8">
              {/* SOP 正文内容 */}
              <div className="space-y-6">
                {viewingSOP.sop.split('\n\n').map((section, sIdx) => (
                  <div key={sIdx} className="space-y-3">
                    {section.startsWith('【') ? (
                      <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        {section.split('\n')[0]}
                      </h4>
                    ) : null}
                    <div className="grid gap-2">
                      {section.split('\n').map((line, lIdx) => {
                        if (line.startsWith('【')) return null;
                        return (
                          <div key={lIdx} className="flex gap-3 text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-50">
                            <span className="font-bold text-blue-600 shrink-0">{line.match(/^\d+/) ? line.split('.')[0] + '.' : '•'}</span>
                            <p>{line.replace(/^\d+\.\s*/, '')}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* AI 智能贴士 */}
              <div className="mt-8">
                <button 
                  onClick={() => handleFetchAiAdvice(viewingSOP.name)}
                  disabled={isLoadingAdvice}
                  className="flex items-center gap-2 text-indigo-600 font-bold text-xs bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <div className="text-lg">✨</div>
                  {isLoadingAdvice ? 'AI 正在分析规程...' : '获取 AI 智能操作建议'}
                </button>
                
                {aiAdvice && (
                  <div className="mt-4 p-5 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl text-white shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
                    <p className="text-xs font-bold mb-2 uppercase opacity-80">AI 专家贴士</p>
                    <p className="text-sm leading-relaxed font-light">{aiAdvice}</p>
                  </div>
                )}
              </div>

              {/* 安全警告 */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
                <ICONS.Alert size={20} className="text-amber-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-amber-900 uppercase">安全警示</p>
                  <p className="text-[10px] text-amber-800 leading-normal mt-1 font-medium">
                    严格遵守上述流程。任何未经授权的参数更改或违规操作可能导致设备损坏或人身伤害。遇到紧急情况请立即按下红色紧急制动按钮。
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
              <button 
                onClick={closeSOP}
                className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
              >
                我已了解操作规程
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 维修记录模态框 (保持原样) */}
      {viewingRepairHistory && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setViewingRepairHistory(null)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[85vh]">
            <div className="p-8 border-b border-slate-100 shrink-0">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                    <ICONS.Maintenance size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">设备维修历史</h3>
                    <p className="text-sm text-slate-500">{viewingRepairHistory.name} ({viewingRepairHistory.id})</p>
                  </div>
                </div>
                <button onClick={() => setViewingRepairHistory(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                  <ICONS.Close size={24} />
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto space-y-6">
              {getRepairHistory(viewingRepairHistory.id).length > 0 ? (
                getRepairHistory(viewingRepairHistory.id).map((history) => (
                  <div key={history.id} className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-slate-100 group">
                    <div className="absolute left-[-4px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-200 group-hover:bg-blue-500 transition-colors border-2 border-white ring-2 ring-slate-50"></div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {new Date(history.timestamp).toLocaleDateString('zh-CN')}
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full border border-emerald-100">已修复</span>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="mb-3">
                        <p className="text-xs font-bold text-slate-500 uppercase mb-1">故障描述</p>
                        <p className="text-sm text-slate-700 leading-relaxed font-medium">{history.description}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">维修工程师</p>
                          <p className="text-sm text-slate-900 font-bold">{history.engineer || '外部技术支持'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">维修结果</p>
                          <p className="text-sm text-slate-600 leading-snug">{history.result || '常规维护处理'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <ICONS.Check size={48} className="mx-auto mb-4 text-emerald-100" />
                  <p className="text-slate-500 font-medium">该设备暂无维修记录，状态良好</p>
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
              <button 
                onClick={() => setViewingRepairHistory(null)}
                className="px-6 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
              >
                关闭窗口
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 立即预约日期选择模态框 */}
      {bookingEquipment && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setBookingEquipment(null)}></div>
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <form onSubmit={handleQuickBook} className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <ICONS.Booking size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">选择预约日期</h3>
                  <p className="text-sm text-slate-500">正在预约：{bookingEquipment.name}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">选择日期</label>
                  <input 
                    required
                    type="date" 
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                  />
                </div>
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3">
                  <ICONS.Clock size={18} className="text-blue-600" />
                  <p className="text-xs text-blue-700 font-medium">确认日期后，您可以在“智能预约”页面选择具体的时间段。</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setBookingEquipment(null)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  取消
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
                >
                  确认日期
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentView;
