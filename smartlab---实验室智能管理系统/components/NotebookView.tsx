
import React, { useState } from 'react';
import { ICONS, MOCK_LOGS } from '../constants';
import { summarizeLabLogs } from '../services/geminiService';
import { LabLog } from '../types';

const NotebookView: React.FC = () => {
  const [logs, setLogs] = useState<LabLog[]>(MOCK_LOGS);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingLog, setViewingLog] = useState<LabLog | null>(null);
  
  const [newLog, setNewLog] = useState({
    title: '',
    author: '陈爱丽', // 默认当前用户
    content: ''
  });

  const handleSummarize = async () => {
    setIsSummarizing(true);
    const allLogs = logs.map(l => l.content).join("\n");
    const summary = await summarizeLabLogs(allLogs);
    setAiSummary(summary);
    setIsSummarizing(false);
  };

  const handleArchive = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLogs(prev => prev.map(log => 
      log.id === id ? { ...log, isArchived: true } : log
    ));
    // 如果正在查看该日志，也更新查看状态
    if (viewingLog?.id === id) {
      setViewingLog(prev => prev ? { ...prev, isArchived: true } : null);
    }
    alert('实验记录已归档，内容已被锁定。');
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const logToAdd: LabLog = {
      id: `L-${Date.now()}`,
      title: newLog.title,
      content: newLog.content,
      author: newLog.author,
      timestamp: new Date().toISOString(),
      isArchived: false,
      attachments: []
    };
    setLogs([logToAdd, ...logs]);
    setIsModalOpen(false);
    setNewLog({ title: '', author: '陈爱丽', content: '' });
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">电子实验记录本 (ELN)</h2>
          <p className="text-slate-500">自动带时间戳归档，确保科研数据真实性</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleSummarize}
            disabled={isSummarizing}
            className="px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-colors flex items-center gap-2"
          >
            {isSummarizing ? 'AI 正在分析...' : 'AI 智能综述'}
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-2"
          >
            <ICONS.Plus size={16} /> 记录新实验
          </button>
        </div>
      </header>

      {aiSummary && (
        <div className="p-6 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl text-white shadow-lg relative overflow-hidden group animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ICONS.Dashboard size={120} />
          </div>
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm">✨</div>
            AI 实验见解总结
          </h3>
          <p className="text-sm text-indigo-50 leading-relaxed whitespace-pre-wrap font-light">{aiSummary}</p>
          <button 
            onClick={() => setAiSummary(null)}
            className="mt-4 text-xs font-bold text-white/70 hover:text-white underline underline-offset-4"
          >
            收起总结
          </button>
        </div>
      )}

      <div className="space-y-4">
        {logs.map((log) => (
          <div 
            key={log.id} 
            onClick={() => setViewingLog(log)}
            className={`bg-white p-6 rounded-2xl border transition-all animate-in fade-in duration-300 cursor-pointer group ${log.isArchived ? 'border-emerald-100 bg-emerald-50/10' : 'border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200'}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-bold text-lg group-hover:text-blue-600 transition-colors ${log.isArchived ? 'text-slate-500' : 'text-slate-900'}`}>{log.title}</h3>
                  {log.isArchived && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <ICONS.Check size={10} /> 已归档
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${log.isArchived ? 'text-slate-400 bg-slate-100' : 'text-blue-600 bg-blue-50'}`}>
                    {log.author}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <ICONS.Clock size={12} />
                    {new Date(log.timestamp).toLocaleString('zh-CN')}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                 <button 
                  className="p-2 text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <ICONS.ArrowRight size={18} />
                </button>
              </div>
            </div>
            <p className={`text-sm leading-relaxed mb-6 whitespace-pre-wrap line-clamp-3 ${log.isArchived ? 'text-slate-400 italic' : 'text-slate-600'}`}>
              {log.content}
            </p>
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <div className="flex items-center gap-3">
                <button 
                  disabled={log.isArchived}
                  onClick={(e) => e.stopPropagation()}
                  className={`text-xs font-bold flex items-center gap-1.5 transition-colors ${log.isArchived ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:text-blue-600'}`}
                >
                  <ICONS.Plus size={14} /> 实验图表
                </button>
              </div>
              {!log.isArchived && (
                <button 
                  onClick={(e) => handleArchive(log.id, e)}
                  className="text-xs font-bold text-indigo-600 flex items-center gap-1.5 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                   完成实验并归档
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 记录新实验模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <ICONS.Plus size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">记录新实验</h3>
                  <p className="text-sm text-slate-500">详细记录实验过程与初步结论</p>
                </div>
              </div>

              <form onSubmit={handleAddLog} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">实验标题</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                    placeholder="输入实验名称，例如：RNA 提取实验方案..."
                    value={newLog.title}
                    onChange={(e) => setNewLog({ ...newLog, title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">记录人</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                      value={newLog.author}
                      onChange={(e) => setNewLog({ ...newLog, author: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">实验日期</label>
                    <div className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed">
                      {new Date().toLocaleDateString()} (系统自动打码)
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">记录详情</label>
                  <textarea 
                    required
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-h-[200px] leading-relaxed"
                    placeholder="在此处输入实验步骤、观察结果及即时备注..."
                    value={newLog.content}
                    onChange={(e) => setNewLog({ ...newLog, content: e.target.value })}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    取消
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
                  >
                    保存记录
                  </button>
                </div>
              </form>
            </div>
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center gap-3">
              <ICONS.Security size={16} className="text-emerald-500" />
              <p className="text-[10px] text-slate-500">所有修改均将被系统审计追踪。归档后，记录将由电子签名锁定，不可再更改。</p>
            </div>
          </div>
        </div>
      )}

      {/* 查看详情模态框 */}
      {viewingLog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setViewingLog(null)}
          ></div>
          <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="p-8 max-h-[85vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl font-bold text-slate-900">{viewingLog.title}</h3>
                    {viewingLog.isArchived && (
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                        已归档
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5 font-medium"><div className="w-2 h-2 rounded-full bg-blue-500"></div>{viewingLog.author}</span>
                    <span className="flex items-center gap-1.5"><ICONS.Clock size={14} />{new Date(viewingLog.timestamp).toLocaleString('zh-CN')}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setViewingLog(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <ICONS.Close size={24} />
                </button>
              </div>

              <div className="prose prose-slate max-w-none">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 whitespace-pre-wrap leading-relaxed text-base font-normal">
                  {viewingLog.content}
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
                <div className="flex gap-4">
                  <button className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600">
                    <ICONS.Inventory size={16} /> 导出 PDF
                  </button>
                </div>
                {!viewingLog.isArchived ? (
                  <button 
                    onClick={() => handleArchive(viewingLog.id)}
                    className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
                  >
                    立即归档
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                    <ICONS.Security size={18} /> 记录受电子签名保护
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotebookView;
