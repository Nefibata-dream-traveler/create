
import React, { useState } from 'react';
import { ICONS, MOCK_CONSUMABLES } from '../constants';
import { Consumable } from '../types';

const InventoryView: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'inbound' | 'purchase' | 'request' | null>(null);
  const [selectedItem, setSelectedItem] = useState<Consumable | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    quantity: '',
    date: new Date().toISOString().split('T')[0],
    reason: ''
  });

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedItem(null);
    setFormData({ name: '', model: '', quantity: '', date: new Date().toISOString().split('T')[0], reason: '' });
  };

  const handleOpenRequest = (item: Consumable) => {
    setSelectedItem(item);
    setActiveModal('request');
    setFormData({
      ...formData,
      name: item.name,
      quantity: '1'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeModal === 'request' && selectedItem) {
      const qty = parseInt(formData.quantity);
      if (qty > selectedItem.stock) {
        alert('申请数量超过当前库存！');
        return;
      }
      alert(`领用申请已提交：\n物品：${selectedItem.name}\n申请数量：${qty} ${selectedItem.unit}`);
    } else {
      const action = activeModal === 'inbound' ? '入库' : '申购';
      alert(`${action}提交成功：\n物品：${formData.name}\n型号：${formData.model}\n数量：${formData.quantity}`);
    }
    handleCloseModal();
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">耗材库存管理</h2>
          <p className="text-slate-500">物资消耗追踪与自动化采购提醒</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveModal('purchase')}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            申请申购
          </button>
          <button 
            onClick={() => setActiveModal('inbound')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-2"
          >
            <ICONS.Plus size={16} /> 物资入库
          </button>
        </div>
      </header>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                <th className="px-6 py-4">物品名称</th>
                <th className="px-6 py-4">所属类别</th>
                <th className="px-6 py-4">当前库存</th>
                <th className="px-6 py-4">安全阈值</th>
                <th className="px-6 py-4">存放位置</th>
                <th className="px-6 py-4">状态</th>
                <th className="px-6 py-4">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_CONSUMABLES.map((item) => {
                const isLow = item.stock < item.threshold;
                const percentage = Math.min((item.stock / (item.threshold * 2)) * 100, 100);
                
                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors text-sm">
                    <td className="px-6 py-4">
                      <div className="font-bold">{item.name}</div>
                      <div className="text-xs text-slate-400">{item.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-slate-100 rounded-md text-[10px] font-bold text-slate-600">{item.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-bold">{item.stock} {item.unit}</span>
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                          <div 
                            className={`h-full rounded-full ${isLow ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{item.threshold} {item.unit}</td>
                    <td className="px-6 py-4">{item.location}</td>
                    <td className="px-6 py-4">
                      {isLow ? (
                        <div className="flex items-center gap-1.5 text-amber-600 font-bold text-xs">
                          <ICONS.Alert size={14} /> 库存偏低
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                          <ICONS.Check size={14} /> 充足
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleOpenRequest(item)}
                        className="text-blue-600 hover:text-blue-800 font-bold text-xs"
                      >
                        领用申请
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 动态模态框 */}
      {activeModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={handleCloseModal}
          ></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  activeModal === 'inbound' ? 'bg-blue-50 text-blue-600' : 
                  activeModal === 'purchase' ? 'bg-amber-50 text-amber-600' : 
                  'bg-emerald-50 text-emerald-600'
                }`}>
                  {activeModal === 'inbound' ? <ICONS.Plus size={24} /> : 
                   activeModal === 'purchase' ? <ICONS.Inventory size={24} /> : 
                   <ICONS.Approval size={24} />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {activeModal === 'inbound' ? '物资入库登记' : 
                     activeModal === 'purchase' ? '申请申购物资' : 
                     '物资领用申请'}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {activeModal === 'request' ? `正在申请：${selectedItem?.name}` : '请输入物资的详细信息'}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {activeModal === 'request' ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">当前库存</p>
                        <p className="text-lg font-bold text-slate-900">{selectedItem?.stock} {selectedItem?.unit}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">存储位置</p>
                        <p className="text-sm font-medium text-slate-600">{selectedItem?.location}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">申请领用数量 ({selectedItem?.unit})</label>
                      <input 
                        required
                        type="number" 
                        min="1"
                        max={selectedItem?.stock}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                        placeholder="输入领用数量"
                        value={formData.quantity}
                        onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">用途说明</label>
                      <textarea 
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm min-h-[80px]"
                        placeholder="简述领用用途及项目编号..."
                        value={formData.reason}
                        onChange={(e) => setFormData({...formData, reason: e.target.value})}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">物资名称 / 种类</label>
                      <input 
                        required
                        type="text" 
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="例如：95% 乙醇"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">规格型号</label>
                      <input 
                        required
                        type="text" 
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="例如：分析纯 500ml"
                        value={formData.model}
                        onChange={(e) => setFormData({...formData, model: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">数量</label>
                        <input 
                          required
                          type="number" 
                          min="1"
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          placeholder="输入数量"
                          value={formData.quantity}
                          onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                          {activeModal === 'inbound' ? '入库日期' : '期望到货日期'}
                        </label>
                        <input 
                          type="date" 
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          value={formData.date}
                          onChange={(e) => setFormData({...formData, date: e.target.value})}
                        />
                      </div>
                    </div>

                    {activeModal === 'purchase' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">申购理由</label>
                        <textarea 
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-h-[80px]"
                          placeholder="简述申购用途..."
                          value={formData.reason}
                          onChange={(e) => setFormData({...formData, reason: e.target.value})}
                        />
                      </div>
                    )}
                  </>
                )}

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    取消
                  </button>
                  <button 
                    type="submit"
                    className={`flex-1 px-4 py-3 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 ${
                      activeModal === 'inbound' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 
                      activeModal === 'purchase' ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-200' : 
                      'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
                    }`}
                  >
                    确认{activeModal === 'inbound' ? '入库' : activeModal === 'purchase' ? '申购' : '申请'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryView;
