
import React, { useState, useMemo, useEffect } from 'react';
import { 
  TrendingUp, 
  Wallet, 
  Calendar, 
  PieChart as PieChartIcon, 
  ChevronDown, 
  ChevronUp,
  Info,
  Coins,
  RefreshCcw
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { UserInput, SavingRecord, ScenarioResult } from './types';
import { calculateSavings, formatCurrency } from './utils';

const STORAGE_KEY = 'kwanza_planner_data';

const App: React.FC = () => {
  // Load initial state from localStorage if available
  const [inputs, setInputs] = useState<UserInput>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
    return {
      monthlyIncome: 50000,
      savingsRate: 10,
      annualInterestRate: 8,
    };
  });

  const [expandedTable, setExpandedTable] = useState(false);

  // Save to localStorage whenever inputs change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
  }, [inputs]);

  const monthlySavings = useMemo(() => 
    (inputs.monthlyIncome * inputs.savingsRate) / 100, 
    [inputs]
  );

  const yearlySavings = useMemo(() => monthlySavings * 12, [monthlySavings]);

  const scenarios: ScenarioResult[] = useMemo(() => {
    const rates = [
      { label: 'Conservador', rate: 4, color: '#94a3b8' },
      { label: 'Moderado', rate: 8, color: '#3b82f6' },
      { label: 'Otimista', rate: 12, color: '#10b981' }
    ];

    return rates.map(s => {
      const data = calculateSavings(monthlySavings, s.rate, 30);
      return {
        ...s,
        data,
        finalAmount: data[data.length - 1].totalAccumulated
      };
    });
  }, [monthlySavings]);

  const activeScenarioData = useMemo(() => {
    return calculateSavings(monthlySavings, inputs.annualInterestRate, 30);
  }, [monthlySavings, inputs.annualInterestRate]);

  const milestones = [1, 5, 10, 20, 30];

  const resetData = () => {
    if (confirm("Deseja redefinir os valores para o padrão?")) {
      setInputs({
        monthlyIncome: 50000,
        savingsRate: 10,
        annualInterestRate: 8,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 selection:bg-indigo-100">
      {/* Header */}
      <header className="bg-indigo-700 text-white p-6 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8" />
            <h1 className="text-2xl font-bold tracking-tight">Kwanza Savings Planner</h1>
          </div>
          <button 
            onClick={resetData}
            title="Resetar valores"
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <RefreshCcw className="w-5 h-5 opacity-70" />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 space-y-6 -mt-4">
        {/* Main Inputs Card */}
        <section className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600 block">Rendimento Mensal (Kz)</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={inputs.monthlyIncome}
                  onChange={(e) => setInputs({...inputs, monthlyIncome: Number(e.target.value)})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-black appearance-none"
                />
                <span className="absolute right-4 top-3.5 text-slate-400 font-bold">Kz</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600 block">Percentagem a Poupar (%)</label>
              <input 
                type="range" 
                min="1" 
                max="100" 
                value={inputs.savingsRate}
                onChange={(e) => setInputs({...inputs, savingsRate: Number(e.target.value)})}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">{inputs.savingsRate}%</span>
                <span>{formatCurrency(monthlySavings)} /mês</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600 block">Taxa de Juro Anual (%)</label>
              <div className="relative">
                <input 
                  type="number" 
                  step="0.1"
                  value={inputs.annualInterestRate}
                  onChange={(e) => setInputs({...inputs, annualInterestRate: Number(e.target.value)})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-black"
                />
                <span className="absolute right-4 top-3.5 text-slate-400 font-bold">%</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-bold">
              <Wallet className="w-4 h-4" />
              Poupança Anual: {formatCurrency(yearlySavings)}
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold">
              <Calendar className="w-4 h-4" />
              Impacto de Longo Prazo
            </div>
          </div>
        </section>

        {/* Milestone Projections */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-1">Património e Rendimento Mensal Passivo</h2>
          <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {milestones.map((year, idx) => {
              const data = activeScenarioData[year - 1];
              const monthlyYield = (data.totalAccumulated * (inputs.annualInterestRate / 100)) / 12;
              
              return (
                <div 
                  key={year} 
                  style={{ animationDelay: `${idx * 100}ms` }}
                  className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md hover:scale-[1.02] flex flex-col justify-between animate-in fade-in slide-in-from-bottom-2"
                >
                  <div>
                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mb-1">{year} {year === 1 ? 'ANO' : 'ANOS'}</p>
                    <h3 className="text-base font-bold text-slate-800 leading-tight mb-2">{formatCurrency(data.totalAccumulated)}</h3>
                  </div>
                  
                  <div className="space-y-2 pt-2 border-t border-slate-50">
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">Rendimento Mensal:</p>
                      <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <Coins className="w-3 h-3" />
                        {formatCurrency(monthlyYield)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">Total Poupo:</p>
                      <p className="text-[10px] font-medium text-slate-500">{formatCurrency(data.totalDeposited)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Chart Container */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-indigo-600" />
                  Crescimento do Património
                </h2>
                <div className="text-xs text-slate-400 italic">Projeção a 30 anos</div>
              </div>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activeScenarioData}>
                    <defs>
                      <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorDep" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="year" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 12, fill: '#64748b'}}
                      label={{ value: 'Anos', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 10, fill: '#64748b'}}
                      tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                    />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="top" height={36}/>
                    <Area 
                      name="Total Acumulado"
                      type="monotone" 
                      dataKey="totalAccumulated" 
                      stroke="#6366f1" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorAcc)" 
                    />
                    <Area 
                      name="Total Depositado"
                      type="monotone" 
                      dataKey="totalDeposited" 
                      stroke="#94a3b8" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      fillOpacity={1} 
                      fill="url(#colorDep)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Comparison Table */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <button 
                onClick={() => setExpandedTable(!expandedTable)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
              >
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  Tabela de Evolução Anual
                </h2>
                {expandedTable ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </button>
              
              <div className={`overflow-x-auto transition-all duration-300 ${expandedTable ? 'max-h-[800px]' : 'max-h-0'}`}>
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 font-bold">Ano</th>
                      <th className="px-6 py-4 font-bold">Depositado</th>
                      <th className="px-6 py-4 font-bold">Juros Acumulados</th>
                      <th className="px-6 py-4 font-bold">Total Final</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeScenarioData.map(row => (
                      <tr key={row.year} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-700">{row.year}</td>
                        <td className="px-6 py-4 text-slate-600">{formatCurrency(row.totalDeposited)}</td>
                        <td className="px-6 py-4 text-green-600 font-medium">+{formatCurrency(row.totalInterest)}</td>
                        <td className="px-6 py-4 font-bold text-indigo-700">{formatCurrency(row.totalAccumulated)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!expandedTable && (
                <div className="px-6 pb-6 text-sm text-slate-400 italic">
                  Clique para ver o detalhamento ano a ano de 1 a 30.
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-6">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-indigo-600" />
                Comparação de Cenários
              </h2>
              <div className="space-y-4">
                {scenarios.map(s => (
                  <div key={s.label} className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-bold text-slate-700">{s.label}</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white text-slate-500 border border-slate-100">
                        {s.rate}% a.a.
                      </span>
                    </div>
                    <p className="text-xl font-bold text-slate-800 mb-1">
                      {formatCurrency(s.finalAmount)}
                    </p>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-1000" 
                        style={{ 
                          width: `${(s.finalAmount / scenarios[2].finalAmount) * 100}%`,
                          backgroundColor: s.color 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <h4 className="text-xs font-bold text-indigo-800 uppercase mb-2">Dica Financeira</h4>
                <p className="text-xs text-indigo-700 leading-relaxed">
                  Os juros compostos trabalham melhor com o tempo. Iniciar hoje, mesmo com pouco, faz uma diferença exponencial no final de 30 anos.
                </p>
              </div>
            </section>

            <section className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-2xl shadow-lg text-white">
              <h2 className="text-lg font-bold mb-4">Multiplicador Financeiro</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-indigo-200 text-xs uppercase font-bold">Património Final vs Depositado:</p>
                  <p className="text-3xl font-black">
                    {(activeScenarioData[29].totalAccumulated / activeScenarioData[29].totalDeposited).toFixed(1)}x
                  </p>
                  <p className="text-xs text-indigo-200">Em 30 anos você terá multiplicado seu esforço por este valor.</p>
                </div>
                <div className="pt-4 border-t border-indigo-500/30">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-indigo-200 text-[10px] uppercase font-bold">Total em Juros Ganhos:</p>
                      <p className="text-lg font-bold text-emerald-300">
                        {formatCurrency(activeScenarioData[29].totalInterest)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </main>

      {/* Mobile Floating Sticky CTA */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-sm md:hidden bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl p-4 border border-slate-200 flex justify-between items-center z-50 animate-in fade-in slide-in-from-bottom-10">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Estimado (30 anos)</p>
          <p className="text-xl font-black text-indigo-600 leading-none">{formatCurrency(activeScenarioData[29].totalAccumulated)}</p>
        </div>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold active:scale-95 transition-transform shadow-md shadow-indigo-200"
        >
          Ajustar
        </button>
      </div>
    </div>
  );
};

export default App;
