
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ICONS, MOCK_EQUIPMENT, MOCK_CONSUMABLES } from '../constants';
import { EquipmentStatus } from '../types';
import { generateLabReport } from '../services/geminiService';

const dataUtilization = [
  { name: '周一', usage: 45 },
  { name: '周二', usage: 52 },
  { name: '周三', usage: 78 },
  { name: '周四', usage: 65 },
  { name: '周五', usage: 40 },
  { name: '周六', usage: 25 },
  { name: '周日', usage: 10 },
];

const RECENT_ALERTS = [
  { type: 'danger', icon: ICONS.Alert, title: '安全阈值触发', desc: '乙醇存储区环境温度超过 28°C。', time: '2 分钟前' },
  { type: 'warning', icon: ICONS.Inventory, title: '库存告急', desc: '200uL 吸头库存低于安全红线 (120/200)。', time: '1 小时前' },
  { type: 'info', icon: ICONS.Maintenance, title: '设备维护提醒', desc: '质谱仪计划于明天上午进行例行保养。', time: '5 小时前' }
];

const Dashboard: React.FC = () => {
  const lowStockCount = MOCK_CONSUMABLES.filter(c => c.stock < c.threshold).length;
  const inUseCount = MOCK_EQUIPMENT.filter(e => e.status === EquipmentStatus.IN_USE).length;
  
  // 报表相关状态
  const [isGenerating, setIsGenerating] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportContent, setReportContent] = useState<string>('');

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    // 收集当前数据
    const labData = {
      inUseCount,
      totalEquipment: MOCK_EQUIPMENT.length,
      lowStockCount,
      environment: '22.4°C / 45%',
      alerts: RECENT_ALERTS
    };

    const report = await generateLabReport(labData);
    setReportContent(report || '生成报告时出现错误，请稍后重试。');
    setIsGenerating(false);
    setShowReportModal(true);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">实验室驾驶舱</h2>
          <p className="text-slate-500">B-204 实验室实时动态</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
            <ICONS.Plus size={16} /> 新增记录
          </button>
          <button 
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium shadow-sm transition-all flex items-center gap-2 ${
              isGenerating ? 'opacity-70 cursor-wait' : 'hover:bg-blue-700 active:scale-95'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <ICONS.Dashboard size={16} /> 生成运营报表
              </>
            )}
          </button>
        </div>
      </header>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><ICONS.Equipment size={20} /></div>
            <span className="text-xs font-semibold text-green-500 bg-green-50 px-2 py-1 rounded-full">+12%</span>
          </div>
          <p className="text-sm text-slate-500">在用仪器</p>
          <p className="text-2xl font-bold">{inUseCount} / {MOCK_EQUIPMENT.length}</p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><ICONS.Inventory size={20} /></div>
            {lowStockCount > 0 && (
              <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded-full">{lowStockCount} 项低库存</span>
            )}
          </div>
          <p className="text-sm text-slate-500">库存预警</p>
          <p className="text-2xl font-bold">{lowStockCount}</p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><ICONS.Security size={20} /></div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">正常</span>
          </div>
          <p className="text-sm text-slate-500">准入人员</p>
          <p className="text-2xl font-bold">24 位</p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><ICONS.Check size={20} /></div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">极佳</span>
          </div>
          <p className="text-sm text-slate-500">环境状态</p>
          <p className="text-2xl font-bold">22.4°C / 45%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 图表部分 */}
        <div className="lg:col-span-2 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold mb-6">仪器利用率趋势 (%)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataUtilization}>
                <defs>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="usage" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsage)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 预警/动态 */}
        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold mb-6">关键预警</h3>
          <div className="space-y-4">
            {RECENT_ALERTS.map((alert, idx) => {
              const bgClass = alert.type === 'danger' ? 'bg-red-50 border-red-100' : alert.type === 'warning' ? 'bg-amber-50 border-amber-100' : 'bg-blue-50 border-blue-100';
              const iconBgClass = alert.type === 'danger' ? 'bg-red-100 text-red-600' : alert.type === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600';
              const textClass = alert.type === 'danger' ? 'text-red-900' : alert.type === 'warning' ? 'text-amber-900' : 'text-blue-900';
              const subTextClass = alert.type === 'danger' ? 'text-red-700' : alert.type === 'warning' ? 'text-amber-700' : 'text-blue-700';
              const timeClass = alert.type === 'danger' ? 'text-red-500' : alert.type === 'warning' ? 'text-amber-500' : 'text-blue-500';
              
              return (
                <div key={idx} className={`flex gap-4 p-3 border rounded-xl ${bgClass}`}>
                  <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${iconBgClass}`}>
                    <alert.icon size={20} />
                  </div>
                  <div>
                    <p className={`text-sm font-bold leading-tight ${textClass}`}>{alert.title}</p>
                    <p className={`text-xs mt-1 ${subTextClass}`}>{alert.desc}</p>
                    <p className={`text-[10px] mt-2 font-medium ${timeClass}`}>{alert.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 报表预览模态框 */}
      {showReportModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowReportModal(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-start shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white">
                  <ICONS.Dashboard size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">实验室运营简报</h3>
                  <p className="text-xs text-slate-400 font-mono">GENERATED BY SMARTLAB AI • {new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowReportModal(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
              >
                <ICONS.Close size={24} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto">
              <div className="prose prose-slate max-w-none">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 whitespace-pre-wrap leading-relaxed text-sm font-medium">
                  {reportContent}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setShowReportModal(false)}
                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-colors"
              >
                关闭
              </button>
              <button className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2">
                <ICONS.Inventory size={16} /> 导出 PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
