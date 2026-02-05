
import React, { useState, useRef } from 'react';
import { ICONS, MOCK_REPAIRS, MOCK_EQUIPMENT } from '../constants';

const RepairView: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showImageSourcePicker, setShowImageSourcePicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    equipmentId: '',
    description: '',
    image: null as string | null
  });

  const handleOpenModal = (withImageSource: boolean = false) => {
    if (withImageSource) {
      setShowImageSourcePicker(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleImageAction = (source: 'camera' | 'album') => {
    setShowImageSourcePicker(false);
    setIsModalOpen(true);
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
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const equipment = MOCK_EQUIPMENT.find(eq => eq.id === formData.equipmentId);
    alert(`报修提交成功！\n设备：${equipment?.name || '未选择'}\n问题：${formData.description}\n照片：${formData.image ? '已上传' : '未上传'}`);
    setIsModalOpen(false);
    setFormData({ equipmentId: '', description: '', image: null });
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">故障报修中心</h2>
          <p className="text-slate-500">实时提交设备异常，跟进维修进度</p>
        </div>
        <button 
          onClick={() => handleOpenModal(false)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-red-700 transition-shadow shadow-md shadow-red-200"
        >
          <ICONS.Alert size={16} /> 发起报修
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_REPAIRS.map(repair => (
          <div key={repair.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block
                  ${repair.status === 'REPORTED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                  {repair.status === 'REPORTED' ? '已上报' : '维修中'}
                </span>
                <h4 className="font-bold text-lg text-slate-900">{repair.equipmentName}</h4>
              </div>
              <p className="text-[10px] text-slate-400 font-medium uppercase">
                {new Date(repair.timestamp).toLocaleDateString()}
              </p>
            </div>
            
            <div className="p-3 bg-slate-50 rounded-xl mb-4 border border-slate-100">
              <p className="text-sm text-slate-600 italic leading-relaxed">"{repair.description}"</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold border border-blue-200">
                  {repair.reporter[0]}
                </div>
                <p className="text-xs text-slate-500 font-medium">上报人: {repair.reporter}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-blue-600 font-bold">
                  <ICONS.Clock size={14} /> 预计 2 天内响应
                </span>
              </div>
              <button className="text-slate-400 hover:text-blue-600 font-bold underline transition-colors">联系工程师</button>
            </div>
          </div>
        ))}

        {/* 报修快速入口 */}
        <div 
          onClick={() => handleOpenModal(true)}
          className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-slate-400 hover:border-red-300 hover:text-red-500 hover:bg-red-50/30 transition-all cursor-pointer group min-h-[220px]"
        >
          <div className="p-4 bg-slate-50 rounded-full mb-3 group-hover:bg-red-100 group-hover:text-red-600 transition-colors shadow-sm">
            <ICONS.Plus size={32} />
          </div>
          <p className="font-bold text-sm">选择设备并拍照报修</p>
          <p className="text-[10px] mt-2 opacity-60">支持实时拍摄故障部位照片</p>
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange} 
      />

      {/* 选择照片来源模态框 (Action Sheet) */}
      {showImageSourcePicker && (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowImageSourcePicker(false)}></div>
          <div className="relative bg-white w-full sm:max-w-xs rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="p-6 space-y-3">
              <h3 className="text-center font-bold text-slate-700 mb-4">选择照片来源</h3>
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
                onClick={() => setShowImageSourcePicker(false)}
                className="w-full py-4 text-slate-400 font-medium rounded-2xl hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 报修主模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                  <ICONS.Alert size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">故障报修登记</h3>
                  <p className="text-sm text-slate-500">请描述设备遇到的具体问题</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">选择故障设备</label>
                  <select 
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm font-medium"
                    value={formData.equipmentId}
                    onChange={(e) => setFormData({...formData, equipmentId: e.target.value})}
                  >
                    <option value="">请选择设备...</option>
                    {MOCK_EQUIPMENT.map(eq => (
                      <option key={eq.id} value={eq.id}>{eq.name} ({eq.model})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">故障描述</label>
                  <textarea 
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm min-h-[100px] leading-relaxed"
                    placeholder="请详细说明故障现象、报错代码或异常声音等..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">故障现场照片</label>
                  <div className="flex items-center gap-4">
                    <div 
                      onClick={() => handleImageAction('camera')}
                      className="w-24 h-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 hover:border-slate-300 transition-all text-slate-400"
                    >
                      {formData.image ? (
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <>
                          <ICONS.Plus size={20} />
                          <span className="text-[10px] font-bold mt-1">点击上传</span>
                        </>
                      )}
                    </div>
                    {formData.image && (
                      <button 
                        type="button" 
                        onClick={() => setFormData({...formData, image: null})}
                        className="text-xs font-bold text-red-500 hover:underline"
                      >
                        清除重选
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    取消
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-200 hover:bg-red-700 transition-all active:scale-95"
                  >
                    提交报修
                  </button>
                </div>
              </form>
            </div>
            <div className="bg-slate-50 p-4 flex items-start gap-3 border-t border-slate-100">
              <ICONS.Security size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-500 leading-normal">报修信息将实时推送至实验室维修工程师。如遇漏水、漏气等紧急情况，请立即关闭总阀并拨打实验室紧急电话。</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepairView;
