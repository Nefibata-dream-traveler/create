
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import EquipmentView from './components/EquipmentView';
import InventoryView from './components/InventoryView';
import NotebookView from './components/NotebookView';
import BookingView from './components/BookingView';
import ApprovalCenter from './components/ApprovalCenter';
import RepairView from './components/RepairView';
import SafetyExamView from './components/SafetyExamView';
import SettingsView from './components/SettingsView';
import { ICONS } from './constants';

export interface UserProfile {
  name: string;
  title: string;
  department: string;
  avatar?: string;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isExamActive, setIsExamActive] = useState(false);
  const [isCertified, setIsCertified] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Global user profile state
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '陈老师',
    title: '首席研究员 (PI)',
    department: '生物医学工程系',
    avatar: undefined
  });

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'equipment':
        return <EquipmentView />;
      case 'inventory':
        return <InventoryView />;
      case 'booking':
        return <BookingView />;
      case 'approvals':
        return <ApprovalCenter />;
      case 'repair':
        return <RepairView />;
      case 'logs':
        return <NotebookView />;
      case 'safety':
        if (isExamActive) {
          return (
            <SafetyExamView 
              onComplete={() => {
                setIsExamActive(false);
                setIsCertified(true);
              }}
              onCancel={() => setIsExamActive(false)}
            />
          );
        }
        return (
          <div className="space-y-6">
            <header>
              <h2 className="text-2xl font-bold text-slate-900">实验室准入与安全</h2>
              <p className="text-slate-500">管理您的个人资质与实验室准入凭证</p>
            </header>

            <div className="p-8 bg-blue-50 border border-blue-100 rounded-3xl text-center shadow-sm relative overflow-hidden">
               {isCertified && (
                <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-extrabold uppercase flex items-center gap-1 shadow-sm">
                  <ICONS.Check size={12} /> 已通过年度考核
                </div>
              )}
              <div className="relative z-10">
                <ICONS.Security size={48} className={`mx-auto mb-4 ${isCertified ? 'text-emerald-600' : 'text-blue-600'}`} />
                <h3 className="text-xl font-bold text-blue-900 mb-2">
                  {isCertified ? '您的安全资质处于最新状态' : '实验室年度安全考试'}
                </h3>
                <p className="text-blue-700 max-w-md mx-auto mb-6">
                  {isCertified 
                    ? `陈老师，您的安全证书有效期至 2025-06-20。系统将在到期前 30 天自动提醒。`
                    : `您的安全证书将在 120 天后过期。请确保您的培训记录保持最新，以维持设备使用权限。考试内容涵盖当前实验室的所有核心设备 SOP。`}
                </p>
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={() => setIsExamActive(true)}
                    className={`px-8 py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95 flex items-center gap-2 ${
                      isCertified 
                        ? 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50' 
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
                    }`}
                  >
                    {isCertified ? '重新进行自测' : '开始安全考试'}
                  </button>
                  {isCertified && (
                    <button className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2">
                      下载证书 (PDF)
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <ICONS.User size={18} className="text-blue-600" /> 已获得准入的设备
                </h4>
                <div className="space-y-3">
                  {['高速冷冻离心机', 'PCR 扩增仪', '通风柜'].map(item => (
                    <div key={item} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                      <span className="text-sm font-medium text-slate-700">{item}</span>
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                        <ICONS.Check size={12} /> 授权中
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <ICONS.Alert size={18} className="text-amber-600" /> 待学习的 SOP
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-amber-50 rounded-xl">
                    <span className="text-sm font-medium text-amber-900">LC-MS 质谱仪操作规范</span>
                    <button className="text-[10px] font-bold text-amber-700 underline underline-offset-2">去学习</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSettingsOpen={() => setIsSettingsOpen(true)}
        userProfile={userProfile}
      />
      
      <main className="flex-1 lg:ml-0 overflow-x-hidden relative">
        {/* 手机端顶部栏 */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">SL</div>
            <span className="font-bold tracking-tight">SmartLab</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <ICONS.Menu size={24} />
          </button>
        </header>

        {/* 动态页面内容 */}
        <div className="max-w-[1400px] mx-auto p-4 md:p-8 lg:p-10">
          {renderContent()}
        </div>
      </main>

      {/* 设置中心模态框 */}
      {isSettingsOpen && (
        <SettingsView 
          initialProfile={userProfile}
          onSave={(newProfile) => setUserProfile(prev => ({...prev, ...newProfile}))}
          onClose={() => setIsSettingsOpen(false)} 
        />
      )}

      {/* 浮动操作按钮 - 根据当前页面功能变化 (可选) */}
      <button className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40">
        <ICONS.Plus size={28} />
      </button>
    </div>
  );
};

export default App;
