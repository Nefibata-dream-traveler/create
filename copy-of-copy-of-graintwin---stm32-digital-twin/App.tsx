import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GrainSilo3D } from './components/GrainSilo3D';
import { SimulationControls } from './components/SimulationControls';
import { TelemetryChart } from './components/Charts';
import { SystemState, HistoryPoint, SimulationEvent } from './types';
import { analyzeGrainStatus } from './services/geminiService';
import { Activity, Thermometer, Droplets, Bug, BrainCircuit, RefreshCw } from 'lucide-react';

const MAX_HISTORY = 30;

const App: React.FC = () => {
  // --- State ---
  const [simulationMode, setSimulationMode] = useState<SimulationEvent>(SimulationEvent.NORMAL);
  const [systemState, setSystemState] = useState<SystemState>({
    temperatures: [24.5, 25.0, 24.8],
    humidity: 45.0,
    pestCount: 0,
    pestPosition: null,
    lastUpdated: Date.now()
  });
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // --- Simulation Loop ---
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemState((prev) => {
        const time = new Date().toLocaleTimeString('zh-CN');
        let [t1, t2, t3] = prev.temperatures;
        let h = prev.humidity;
        let pCount = prev.pestCount;
        let pPos = prev.pestPosition;

        // Random noise
        t1 += (Math.random() - 0.5) * 0.1;
        t2 += (Math.random() - 0.5) * 0.1;
        t3 += (Math.random() - 0.5) * 0.1;
        h += (Math.random() - 0.5) * 0.2;

        // Event Logic
        switch (simulationMode) {
          case SimulationEvent.HEAT_SPIKE:
            t2 += 0.3; // Middle sensor heating up
            if (t2 > 45) t2 = 45;
            break;
          case SimulationEvent.HIGH_HUMIDITY:
            h += 1.5; // Rapid humidity rise
            if (h > 95) h = 95;
            break;
          case SimulationEvent.PEST_INVASION:
            if (pCount === 0) {
                pCount = 1;
                pPos = { x: 0.2, y: 0.2 };
            }
            // Move pest randomly
            if (pPos) {
                pPos = {
                    x: Math.max(-0.8, Math.min(0.8, pPos.x + (Math.random() - 0.5) * 0.1)),
                    y: Math.max(-0.8, Math.min(0.8, pPos.y + (Math.random() - 0.5) * 0.1))
                };
            }
            break;
          case SimulationEvent.NORMAL:
          default:
            // Drift back to normal
            if (t1 > 25) t1 -= 0.1;
            if (t2 > 25) t2 -= 0.1;
            if (t3 > 25) t3 -= 0.1;
            if (h > 45) h -= 0.5;
            if (h < 45) h += 0.1;
            pCount = 0;
            pPos = null;
            break;
        }

        const newState: SystemState = {
          temperatures: [t1, t2, t3],
          humidity: h,
          pestCount: pCount,
          pestPosition: pPos,
          lastUpdated: Date.now()
        };

        // Update history
        setHistory(currHist => {
          const newPoint: HistoryPoint = {
            time,
            temp1: t1,
            temp2: t2,
            temp3: t3,
            humidity: h,
            pestCount: pCount
          };
          const updated = [...currHist, newPoint];
          if (updated.length > MAX_HISTORY) updated.shift();
          return updated;
        });

        return newState;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [simulationMode]);

  // --- Handlers ---
  const handleAiAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    setAiReport(null);
    const report = await analyzeGrainStatus(systemState);
    setAiReport(report);
    setIsAnalyzing(false);
  }, [systemState]);

  return (
    <div className="relative w-full h-screen bg-slate-900 overflow-hidden text-slate-200">
      
      {/* 3D Background */}
      <GrainSilo3D state={systemState} />

      {/* Header */}
      <header className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-10 pointer-events-none">
        <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-700 shadow-2xl pointer-events-auto">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="text-blue-500" />
            STM32H750 粮仓数字孪生
          </h1>
          <p className="text-xs text-slate-400 mt-1">多维度粮食存储状态智能监测系统</p>
          <div className="flex gap-4 mt-3 text-sm font-mono">
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${systemState.lastUpdated ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                系统在线
            </div>
            <div>延迟: 24ms</div>
          </div>
        </div>

        {/* AI Analysis Button */}
        <div className="pointer-events-auto">
             <button
                onClick={handleAiAnalysis}
                disabled={isAnalyzing}
                className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-xl font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isAnalyzing ? <RefreshCw className="animate-spin" /> : <BrainCircuit />}
                <span>{isAnalyzing ? '深度分析中...' : 'AI 风险评估'}</span>
            </button>
        </div>
      </header>

      {/* Left Panel: Charts */}
      <aside className="absolute bottom-4 left-4 w-96 z-10 flex flex-col gap-4 pointer-events-none">
        
        {/* Temp Chart */}
        <div className="bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl shadow-xl pointer-events-auto">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-slate-300 flex items-center gap-2">
                    <Thermometer size={16} className="text-orange-400"/> 温度传感器阵列
                </h3>
                <span className="text-xs font-mono text-slate-500">DS18B20 x3</span>
            </div>
            <TelemetryChart data={history} type="temp" />
            <div className="grid grid-cols-3 gap-2 mt-2 text-center">
                {systemState.temperatures.map((t, i) => (
                    <div key={i} className={`text-xs p-1 rounded ${t > 30 ? 'bg-red-900/50 text-red-200' : 'bg-slate-800 text-slate-300'}`}>
                        {i === 0 ? '底' : i === 1 ? '中' : '顶'}: {t.toFixed(1)}°C
                    </div>
                ))}
            </div>
        </div>

        {/* Humidity Chart */}
        <div className="bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl shadow-xl pointer-events-auto">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-slate-300 flex items-center gap-2">
                    <Droplets size={16} className="text-cyan-400"/> 环境湿度监测
                </h3>
                <span className="text-xs font-mono text-slate-500">AHT20</span>
            </div>
            <TelemetryChart data={history} type="humidity" />
            <div className={`mt-2 text-center text-sm font-bold p-2 rounded ${systemState.humidity > 70 ? 'bg-blue-900/50 text-blue-200 animate-pulse' : 'bg-slate-800 text-slate-300'}`}>
                当前相对湿度: {systemState.humidity.toFixed(1)}%
            </div>
        </div>
      </aside>

      {/* Right Panel: Controls & Pest */}
      <aside className="absolute bottom-4 right-4 w-80 z-10 flex flex-col gap-4 pointer-events-none">
        
        {/* Pest Monitor */}
        <div className="bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl shadow-xl pointer-events-auto">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-slate-300 flex items-center gap-2">
                    <Bug size={16} className="text-red-400"/> 害虫视觉监测
                </h3>
                <span className="text-xs font-mono text-slate-500">OpenMV H7</span>
            </div>
            <div className="flex items-center justify-between bg-slate-800 p-3 rounded-lg">
                <div className="text-slate-400 text-sm">实时害虫计数</div>
                <div className={`text-2xl font-bold font-mono ${systemState.pestCount > 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {systemState.pestCount}
                </div>
            </div>
            {systemState.pestCount > 0 && (
                <div className="mt-2 text-xs text-red-300 bg-red-900/30 p-2 rounded border border-red-900/50">
                    警告: 在扇区 ({systemState.pestPosition?.x.toFixed(1)}, {systemState.pestPosition?.y.toFixed(1)}) 检测到入侵物种
                </div>
            )}
        </div>

        {/* Simulation Controls (Demo Mode) */}
        <div className="pointer-events-auto">
            <SimulationControls currentEvent={simulationMode} onTrigger={setSimulationMode} />
        </div>

      </aside>

      {/* AI Report Modal/Overlay */}
      {aiReport && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] max-h-[80vh] bg-slate-900/95 backdrop-blur-xl border border-indigo-500/50 p-6 rounded-2xl shadow-2xl z-50 overflow-y-auto pointer-events-auto">
            <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-4">
                <h2 className="text-xl font-bold text-indigo-400 flex items-center gap-2">
                    <BrainCircuit /> AI 智能分析报告
                </h2>
                <button onClick={() => setAiReport(null)} className="text-slate-400 hover:text-white transition-colors">关闭</button>
            </div>
            <div className="prose prose-invert prose-sm max-w-none">
                <div className="whitespace-pre-line text-slate-300 leading-relaxed">
                    {aiReport}
                </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-700 flex justify-end">
                <button onClick={() => setAiReport(null)} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    确定
                </button>
            </div>
        </div>
      )}

    </div>
  );
};

export default App;