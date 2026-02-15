import React, { useEffect, useState } from 'react';
import api from '../api'
import { Activity, ArrowUpRight, Percent, IndianRupee } from 'lucide-react';
import PortfolioChart from './PortfolioChart';
import InvestmentForm from './InvestmentForm';

export default function Dashboard() {
  const [investments, setInvestments] = useState([]);
  const [metrics, setMetrics] = useState({ totalValue: 0, absoluteReturn: 0, xirr: 0 });
  const [showTotal, setShowTotal] = useState(true);

  const fetchData = async () => {
    try {
      const [invRes, metricRes] = await Promise.all([
        api.get("/api/investments"),
        api.get("/api/metrics")
      ]);

      setInvestments(invRes.data);
      setMetrics(metricRes.data);

    } catch (err) {
      console.error("Error fetching data:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
            Portfolio Tracker
          </h1>
          <p className="text-slate-400 mt-1">Track your wealth growth across assets</p>
        </div>

        {/* Toggle */}
        <div className="bg-slate-800 p-1 rounded-lg inline-flex border border-slate-700">
          <button
            onClick={() => setShowTotal(true)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${showTotal ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Total Value
          </button>
          <button
            onClick={() => setShowTotal(false)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${!showTotal ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            By Asset
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Current Total Value"
          value={`₹${metrics.totalValue.toLocaleString('en-IN')}`}
          icon={<IndianRupee className="w-5 h-5 text-emerald-400" />}
          trend="Total Assets"
        />
        <MetricCard
          title="Absolute Return"
          value={`${metrics.absoluteReturn}%`}
          valueClass={metrics.absoluteReturn >= 0 ? "text-emerald-400" : "text-rose-400"}
          icon={<Activity className="w-5 h-5 text-blue-400" />}
          trend="Since Inception"
        />
        <MetricCard
          title="Annualized XIRR"
          value={`${metrics.xirr}%`}
          valueClass={metrics.xirr >= 0 ? "text-emerald-400" : "text-rose-400"}
          icon={<Percent className="w-5 h-5 text-purple-400" />}
          trend="CAGR Approx."
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section - Takes up 2 cols */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-200">Growth Analysis</h3>
          </div>
          <PortfolioChart data={investments} showTotal={showTotal} />
        </div>

        {/* Input Form Section - Takes up 1 col */}
        <div className="space-y-6">
          <InvestmentForm onUpdate={fetchData} />

          {/* Recent Activity Mini List */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Recent Entries</h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
              {investments.slice().reverse().slice(0, 5).map((inv) => (
                <div key={inv.id} className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                  <div>
                    <p className="font-medium text-slate-200">{inv.asset_type}</p>
                    <p className="text-xs text-slate-500">{inv.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-emerald-400">₹{inv.amount.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
              {investments.length === 0 && <p className="text-slate-500 text-sm italic">No data yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, trend, valueClass = "text-white" }) {
  return (
    <div className="glass-card p-6 relative overflow-hidden group hover:bg-slate-800/80 transition-all">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        {icon}
      </div>
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-slate-700/50 rounded-lg text-slate-300">
          {icon}
        </div>
        <span className="flex items-center text-xs font-medium text-slate-400 bg-slate-900/50 px-2 py-1 rounded-full border border-slate-700/50">
          {trend} <ArrowUpRight className="w-3 h-3 ml-1" />
        </span>
      </div>
      <div>
        <h3 className="text-sm font-medium text-slate-400 mb-1">{title}</h3>
        <p className={`text-2xl font-bold tracking-tight ${valueClass}`}>{value}</p>
      </div>
    </div>
  );
}
