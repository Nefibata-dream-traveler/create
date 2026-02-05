
import React, { useState } from 'react';
import { ICONS, MOCK_EQUIPMENT } from '../constants';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  equipmentName: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    equipmentName: '高速冷冻离心机',
    text: '在使用高速冷冻离心机前，最重要的准备工作是什么？',
    options: ['调节温度', '检查转子平衡与配平', '清洁表面', '设定离心时间'],
    correctAnswer: 1
  },
  {
    id: 2,
    equipmentName: 'LC-MS 质谱仪',
    text: 'LC-MS 质谱仪在冲洗管路时，应该使用什么级别的试剂？',
    options: ['自来水', '蒸馏水', '分析纯 (AR)', '色谱级 (HPLC Grade)'],
    correctAnswer: 3
  },
  {
    id: 3,
    equipmentName: '全自动 PCR 扩增仪',
    text: '启动 PCR 扩增前，关于热盖的操作正确的是？',
    options: ['热盖无需关闭', '热盖必须完全锁定严密', '热盖应保持半开通风', '手动加热至100度'],
    correctAnswer: 1
  },
  {
    id: 4,
    equipmentName: '洁净通风柜',
    text: '在通风柜内操作时，拉门（玻璃窗）的高度应保持在？',
    options: ['完全开启', '完全关闭', '推荐的警戒线位置以下', '任意高度均可'],
    correctAnswer: 2
  }
];

interface SafetyExamViewProps {
  onComplete: () => void;
  onCancel: () => void;
}

const SafetyExamView: React.FC<SafetyExamViewProps> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const handleSelect = (optionIdx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = optionIdx;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
    }
  };

  const score = answers.reduce((acc, val, idx) => (val === QUESTIONS[idx].correctAnswer ? acc + 1 : acc), 0);
  const pass = score >= QUESTIONS.length * 0.75;

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className={`p-10 text-center ${pass ? 'bg-emerald-50' : 'bg-red-50'}`}>
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${pass ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
            {pass ? <ICONS.Check size={40} /> : <ICONS.Alert size={40} /> }
          </div>
          <h3 className="text-3xl font-extrabold mb-2">{pass ? '考核通过！' : '考核未通过'}</h3>
          <p className="text-slate-500 mb-8">
            您的得分为: <span className="font-bold text-slate-900">{Math.round((score / QUESTIONS.length) * 100)}%</span>
            <br />
            {pass ? '您的实验室准入权限已成功更新。' : '请重新阅读设备 SOP 后再次尝试。'}
          </p>
          
          {pass ? (
            <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-emerald-200 relative mb-8">
              <div className="absolute top-4 right-4 text-emerald-100"><ICONS.Security size={64} /></div>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-4">实验室安全准入证书</p>
              <p className="text-xl font-bold text-slate-800 mb-1">陈爱丽 (U-101)</p>
              <p className="text-sm text-slate-500">已获得 B-204 实验室全设备操作权限</p>
              <div className="mt-6 flex justify-between items-end">
                <div className="text-left">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">签发日期</p>
                  <p className="text-sm font-bold text-slate-700">{new Date().toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] text-slate-400 font-bold uppercase">有效期至</p>
                   <p className="text-sm font-bold text-slate-700">2025-06-20</p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="flex gap-4">
            {pass ? (
              <button 
                onClick={onComplete}
                className="flex-1 py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all"
              >
                返回工作台
              </button>
            ) : (
              <button 
                onClick={onCancel}
                className="flex-1 py-4 bg-red-600 text-white font-bold rounded-2xl shadow-lg shadow-red-200 hover:bg-red-700 transition-all"
              >
                重新学习
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = QUESTIONS[currentStep];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        {/* 顶部进度 */}
        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">设备操作安全测验</span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">题 {currentStep + 1} / {QUESTIONS.length}</h3>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600"><ICONS.Close size={20} /></button>
        </div>
        
        <div className="h-1.5 w-full bg-slate-100">
          <div 
            className="h-full bg-blue-600 transition-all duration-500" 
            style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
          ></div>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold mb-4">
              <ICONS.Equipment size={14} /> {currentQuestion.equipmentName}
            </div>
            <h4 className="text-2xl font-bold text-slate-800 leading-snug">{currentQuestion.text}</h4>
          </div>

          <div className="space-y-4 mb-10">
            {currentQuestion.options.map((option, idx) => (
              <label 
                key={idx}
                className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                  answers[currentStep] === idx 
                    ? 'border-blue-600 bg-blue-50/50 ring-4 ring-blue-50' 
                    : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input 
                  type="radio" 
                  name={`q-${currentStep}`}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                  checked={answers[currentStep] === idx}
                  onChange={() => handleSelect(idx)}
                />
                <span className={`text-lg font-medium ${answers[currentStep] === idx ? 'text-blue-900' : 'text-slate-600'}`}>{option}</span>
              </label>
            ))}
          </div>

          <button 
            disabled={answers[currentStep] === undefined}
            onClick={handleNext}
            className={`w-full py-5 rounded-2xl font-extrabold text-lg shadow-xl transition-all flex items-center justify-center gap-2 ${
              answers[currentStep] === undefined 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'
            }`}
          >
            {currentStep === QUESTIONS.length - 1 ? '提交试卷' : '下一题'} 
            <ICONS.ArrowRight size={20} />
          </button>
        </div>
      </div>
      
      <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-4">
        <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><ICONS.Alert size={20} /></div>
        <div className="text-sm">
          <p className="font-bold text-amber-900">学术诚信提示</p>
          <p className="text-amber-700 mt-1">本测验为模拟真实操作场景。在实验室现场操作前，请务必在导师监督下完成实机考核。安全无小事，禁止作弊。</p>
        </div>
      </div>
    </div>
  );
};

export default SafetyExamView;
