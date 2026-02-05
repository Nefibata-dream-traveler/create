import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { HistoryPoint } from '../types';

interface ChartProps {
  data: HistoryPoint[];
  type: 'temp' | 'humidity';
}

export const TelemetryChart: React.FC<ChartProps> = ({ data, type }) => {
  if (type === 'temp') {
    return (
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tick={false} />
            <YAxis stroke="#94a3b8" fontSize={10} domain={[15, 45]} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
              itemStyle={{ fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
            <Line type="monotone" dataKey="temp1" stroke="#3b82f6" strokeWidth={2} dot={false} name="底层 (T1)" />
            <Line type="monotone" dataKey="temp2" stroke="#10b981" strokeWidth={2} dot={false} name="中层 (T2)" />
            <Line type="monotone" dataKey="temp3" stroke="#f59e0b" strokeWidth={2} dot={false} name="顶层 (T3)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tick={false} />
          <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 100]} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
            itemStyle={{ fontSize: '12px' }}
          />
          <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
          <Line type="monotone" dataKey="humidity" stroke="#06b6d4" strokeWidth={2} dot={false} name="相对湿度 %" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};