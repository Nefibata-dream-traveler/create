
import React from 'react';
import { ICONS } from '../constants';
import { UserProfile } from '../App';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onSettingsOpen: () => void;
  userProfile: UserProfile;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, onClose, onSettingsOpen, userProfile }) => {
  const menuItems = [
    { id: 'dashboard', label: '实时看板', icon: ICONS.Dashboard },
    { id: 'equipment', label: '设备档案', icon: ICONS.Equipment },
    { id: 'booking', label: '智能预约', icon: ICONS.Booking },
    { id: 'inventory', label: '耗材申领', icon: ICONS.Inventory },
    { id: 'approvals', label: '审批中心', icon: ICONS.Approval },
    { id: 'repair', label: '故障报修', icon: ICONS.Maintenance },
    { id: 'logs', label: '实验日志', icon: ICONS.Logs },
    { id: 'safety', label: '安全准入', icon: ICONS.Security },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 bottom-0 w-64 bg-slate-900 text-white z-50 transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:block
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold">SL</div>
            <h1 className="text-xl font-bold tracking-tight">SmartLab 系统</h1>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${activeTab === item.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                `}
              >
                <Icon size={18} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 w-full p-6 border-t border-slate-800">
          <div className="flex items-center gap-3 text-slate-400">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold border border-slate-600 overflow-hidden">
              {userProfile.avatar ? (
                <img src={userProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                userProfile.name[0]
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{userProfile.name}</p>
              <p className="text-[10px] truncate uppercase tracking-tighter">{userProfile.title}</p>
            </div>
            <button 
              onClick={onSettingsOpen}
              className="p-1 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              title="系统设置"
            >
              <ICONS.Settings size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
