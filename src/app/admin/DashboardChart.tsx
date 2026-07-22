'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type ChartData = {
  name: string;
  'Avaliações (Público)': number;
  'Checklists (Encarregados)': number;
};

export function DashboardChart({ data }: { data: ChartData[] }) {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
      <h3 className="text-lg font-bold mb-6 text-slate-800 dark:text-white">Volume de Registros (Últimos 7 dias)</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: '#f1f5f9' }}
              contentStyle={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                padding: '12px'
              }}
              labelStyle={{ color: '#64748b', fontWeight: 600, marginBottom: '8px' }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Bar 
              dataKey="Avaliações (Público)" 
              fill="#0ea5e9" 
              radius={[4, 4, 0, 0]} 
              barSize={30}
            />
            <Bar 
              dataKey="Checklists (Encarregados)" 
              fill="#10b981" 
              radius={[4, 4, 0, 0]} 
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
