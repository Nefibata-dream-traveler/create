import React from 'react';
import { SimulationEvent } from '../types';
import { Flame, Droplets, Bug, Activity } from 'lucide-react';

interface Props {
  currentEvent: SimulationEvent;
  onTrigger: (event: SimulationEvent) => void;
}

export const SimulationControls: React.FC<Props> = ({ currentEvent, onTrigger }) => {
  const buttons = [
    { id: SimulationEvent.NORMAL, label: '正常状态', icon: Activity, color: 'bg-green-600 hover:bg-green-700' },
    { id: SimulationEvent.HEAT_SPIKE, label: '局部高温', icon: Flame, color: 'bg-orange-600 hover:bg-orange-700' },
    { id: SimulationEvent.HIGH_HUMIDITY, label: '高湿度', icon: Droplets, color: 'bg-blue-600 hover:bg-blue-700' },
    { id: SimulationEvent.PEST_INVASION, label: '害虫入侵', icon: Bug, color: 'bg-red-600 hover:bg-red-700' },
  ];

  return (
    <div className="bg-slate-800/90 backdrop-blur border border-slate-700 p-4 rounded-xl shadow-xl">
      <h3 className="text-slate-400 text-xs uppercase font-bold mb-3 tracking-wider">硬件模拟控制</h3>
      <div className="grid grid-cols-2 gap-2">
        {buttons.map((btn) => (
          <button
            key={btn.id}
            onClick={() => onTrigger(btn.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              currentEvent === btn.id ? btn.color + ' ring-2 ring-white/20' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
            }`}
          >
            <btn.icon size={16} />
            {btn.label}
          </button>
        ))}
      </div>
      <div className="mt-3 text-[10px] text-slate-500 text-center">
        * 模拟 STM32H750 边缘侧数据流
      </div>
    </div>
  );
};