import React, { useState } from 'react';
import { Calendar, IndianRupee, PieChart, TrendingUp } from 'lucide-react';
import axios from 'axios';
import clsx from 'clsx';

const ASSET_TYPES = ['FD', 'Mutual Funds', 'Stocks', 'Gold', 'Real Estate', 'Crypto'];

export default function InvestmentForm({ onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    asset_type: 'Mutual Funds',
    amount: '',
    date: new Date().toISOString().split('T')[0] // Default to today
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/investments`, formData);
      setFormData({ ...formData, amount: '' }); // Reset amount only
      onUpdate();
    } catch (err) {
      console.error(err);
      alert('Failed to save investment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
      <div className="flex items-center space-x-2 text-emerald-400 mb-2">
        <TrendingUp className="w-5 h-5" />
        <h2 className="text-lg font-semibold">Update Portfolio Value</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Asset Type */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-400 uppercase">Asset Class</label>
          <div className="relative">
            <PieChart className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <select
              value={formData.asset_type}
              onChange={e => setFormData({ ...formData, asset_type: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 pl-10 pr-4 py-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none appearance-none"
            >
              {ASSET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Date */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-400 uppercase">Date of Valuation</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <input
              type="date"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 pl-10 pr-4 py-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Amount */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-400 uppercase">Current Value</label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) || '' })}
              placeholder="e.g. 50000"
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 pl-10 pr-4 py-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={clsx(
          "w-full py-3 rounded-lg font-medium transition-all shadow-lg shadow-emerald-900/20",
          loading
            ? "bg-slate-700 text-slate-400 cursor-not-allowed"
            : "bg-emerald-600 hover:bg-emerald-500 text-white"
        )}
      >
        {loading ? 'Updating...' : 'Log Value Snapshot'}
      </button>
    </form>
  );
}
