
import React, { useState, useRef } from 'react';
import { ICONS } from '../constants';
import { UserProfile } from '../App';

interface SettingsViewProps {
  onClose: () => void;
  initialProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onClose, initialProfile, onSave }) => {
  const [activeSection, setActiveSection] = useState<'security' | 'personalization' | 'general' | 'accounts'>('security');
  
  // 个人资料状态
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  
  // 头像选择器状态
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    setShowAvatarPicker(true);
  };

  const handleImageAction = (source: 'camera' | 'album') => {
    setShowAvatarPicker(false);
    // 模拟触发文件选择
    if (fileInputRef.current) {
      if (source === 'camera') {
        fileInputRef.current.setAttribute('capture', 'environment');
      } else {
        fileInputRef.current.removeAttribute('capture');
      }
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(profile);
    alert('个人资料已成功更新！');
    onClose();
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'security':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">登录与安全</h4>
              <div className="grid gap-4">
                <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between hover:border-blue-200 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                      <ICONS.Settings size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">登录密码</p>
                      <p className="text-xs text-slate-500">定期更新密码以保持账号安全</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-blue-600 hover:underline">修改密码</button>
                </div>
                
                <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                      <ICONS.Security size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">双因素认证 (2FA)</p>
                      <p className="text-xs text-slate-500">通过手机验证码增加额外保护</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">已开启</span>
                    <button className="text-xs font-bold text-slate-400 hover:text-slate-600">配置</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">最近登录记录</h4>
              <div className="bg-slate-50 rounded-2xl border border-slate-100 divide-y divide-slate-100 overflow-hidden">
                <div className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-xs font-medium text-slate-700">北京 - 当前设备 (Chrome / macOS)</span>
                  </div>
                  <span className="text-[10px] text-slate-400">现在</span>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3 text-slate-400">
                    <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                    <span className="text-xs font-medium">上海 - iPhone 15 Pro</span>
                  </div>
                  <span className="text-[10px] text-slate-400">3 小时前</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'personalization':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">基本资料修改</h4>
              <div className="p-6 bg-white border border-slate-100 rounded-3xl space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                    <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-xl overflow-hidden">
                      {profile.avatar ? (
                        <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        profile.name[0]
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">更换头像</div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                        <ICONS.Maintenance size={12} className="text-slate-600" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">真实姓名</label>
                      <input 
                        type="text" 
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">职位/头衔</label>
                      <input 
                        type="text" 
                        value={profile.title}
                        onChange={(e) => setProfile({...profile, title: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">界面外观</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-white border-2 border-blue-600 rounded-2xl text-center space-y-2">
                  <div className="w-full h-12 bg-slate-100 rounded-lg"></div>
                  <p className="text-xs font-bold">明亮模式</p>
                </div>
                <div className="p-4 bg-white border border-slate-100 rounded-2xl text-center space-y-2 opacity-50 grayscale hover:grayscale-0 cursor-not-allowed">
                  <div className="w-full h-12 bg-slate-900 rounded-lg"></div>
                  <p className="text-xs font-bold">深色模式</p>
                </div>
                <div className="p-4 bg-white border border-slate-100 rounded-2xl text-center space-y-2">
                  <div className="w-full h-12 bg-gradient-to-r from-slate-100 to-slate-900 rounded-lg"></div>
                  <p className="text-xs font-bold">跟随系统</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'general':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">语言与区域</h4>
              <div className="grid gap-4">
                <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-900">系统显示语言</p>
                  <select className="bg-slate-50 border-none rounded-lg text-xs font-bold p-2 outline-none">
                    <option>简体中文 (Chinese)</option>
                    <option>English (UK)</option>
                  </select>
                </div>
                <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-900">时区设置</p>
                  <span className="text-xs font-medium text-slate-500">(GMT+08:00) 北京, 上海, 香港</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">关于系统</h4>
              <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100/50 text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-bold mx-auto mb-4 text-xl">SL</div>
                <p className="text-sm font-bold text-slate-900">SmartLab 实验室管理系统</p>
                <p className="text-xs text-slate-500 mt-1">版本 v2.4.0 (Build 20240618)</p>
                <div className="flex justify-center gap-4 mt-6">
                  <button className="text-[10px] font-bold text-blue-600 hover:underline">检查更新</button>
                  <button className="text-[10px] font-bold text-slate-400 hover:underline">开源协议</button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'accounts':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 text-center py-10">
            <div className="max-w-xs mx-auto space-y-6">
              <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-slate-900">切换账号</h3>
                <p className="text-xs text-slate-500 leading-relaxed">您可以登录现有的其他实验室账号，或者为此设备创建一个全新的本地工作站账号。</p>
                
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95">
                    <ICONS.Plus size={20} /> 创造新账号
                  </button>
                  <button className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all active:scale-95">
                    <ICONS.User size={20} /> 登录已有账号
                  </button>
                </div>
              </div>

              <div className="p-4 bg-slate-100 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold overflow-hidden">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      profile.name[0]
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900">{profile.name}</p>
                    <p className="text-[10px] text-slate-500">当前正在使用</p>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-2xl bg-slate-50 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out">
        {/* Header */}
        <div className="p-8 border-b border-slate-100 bg-white flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">个人管理与设置</h2>
            <p className="text-sm text-slate-500">{profile.name} ({profile.title})</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-all active:scale-90"
          >
            <ICONS.Close size={24} />
          </button>
        </div>

        {/* Content Tabs */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Navigation */}
          <div className="w-48 border-r border-slate-100 bg-white p-4 space-y-1 shrink-0">
            <button 
              onClick={() => setActiveSection('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold ${activeSection === 'security' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <ICONS.Security size={18} /> 账号安全
            </button>
            <button 
              onClick={() => setActiveSection('personalization')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold ${activeSection === 'personalization' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <ICONS.Dashboard size={18} /> 个性化
            </button>
            <button 
              onClick={() => setActiveSection('general')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold ${activeSection === 'general' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <ICONS.Settings size={18} /> 通用设置
            </button>
            <div className="pt-4 mt-4 border-t border-slate-50">
               <button 
                onClick={() => setActiveSection('accounts')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold ${activeSection === 'accounts' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <ICONS.User size={18} /> 切换账号
              </button>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1 p-10 overflow-y-auto">
            {renderSection()}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white border-t border-slate-100 flex justify-between items-center shrink-0">
          <button 
            onClick={() => setActiveSection('accounts')}
            className="text-sm font-bold text-slate-500 hover:bg-slate-50 px-4 py-2 rounded-xl transition-colors"
          >
            注销登录
          </button>
          <button 
            onClick={handleSave}
            className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
          >
            保存并返回
          </button>
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange} 
      />

      {/* 头像选择 Action Sheet */}
      {showAvatarPicker && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAvatarPicker(false)}></div>
          <div className="relative bg-white w-full sm:max-w-xs rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="p-6 space-y-3">
              <h3 className="text-center font-bold text-slate-700 mb-4">更改头像</h3>
              <button 
                onClick={() => handleImageAction('camera')}
                className="w-full py-4 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-bold rounded-2xl flex items-center justify-center gap-3 transition-colors"
              >
                <ICONS.Security size={20} /> 拍照
              </button>
              <button 
                onClick={() => handleImageAction('album')}
                className="w-full py-4 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-bold rounded-2xl flex items-center justify-center gap-3 transition-colors"
              >
                <ICONS.Inventory size={20} /> 从相册选取
              </button>
              <button 
                onClick={() => setShowAvatarPicker(false)}
                className="w-full py-4 text-slate-400 font-medium rounded-2xl hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
