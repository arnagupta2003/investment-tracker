import React from 'react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { format } from 'date-fns';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 p-4 rounded-lg shadow-xl">
        <p className="text-slate-300 mb-2">{format(new Date(label), 'MMM d, yyyy')}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm font-medium">
            {entry.name}: ₹{entry.value.toLocaleString('en-IN')}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function PortfolioChart({ data, showTotal }) {
  // Data processing:
  // If showTotal, we need a single series "Total".
  // If not, we need series for each asset type.

  // Pivot data for Recharts
  // Input: Array of { id, asset_type, amount, date } sorted by date
  // Output: Array of { date, 'FD': 1000, 'Stocks': 2000, ... }

  // We need to handle "Value at Date".
  // Since we only have sparse snapshots, we need to interpolate or fill forward?
  // User said: "If a user skips dates, the chart should handle the gap linearly or show the last known value."
  // Linearly is default for LineChart if data points exist.
  // BUT we have different dates for different assets.
  // We need to normalize dates to a common timeline?
  // Or just plot all points?
  // Recharts categorizes by "date". If 'FD' has value at T1 but 'Stocks' doesn't, 'Stocks' will be null at T1.
  // ConnectNulls={true} helps linear interpolation!

  const processedData = React.useMemo(() => {
    // 1. Collect all unique dates
    const dateSet = new Set(data.map(d => d.date));
    const dates = Array.from(dateSet).sort();

    // 2. Build map of date -> { date, ...assets }
    // Actually, simply reshaping is enough if we use connectNulls.

    // Group by date
    const byDate = {};
    dates.forEach(d => {
      byDate[d] = { date: d };
    });

    data.forEach(item => {
      byDate[item.date][item.asset_type] = item.amount;
      // Also calculate total for this specific date?
      // No, "Total" chart needs sum of ALL assets at that date.
      // If Asset A has no entry at Date T, we should assume its value is... what?
      // "Last known value" (Fill Forward) is safer for Total.
    });

    // Fill Forward for Total Calculation
    const result = [];
    const lastValues = {};
    const assets = new Set(data.map(d => d.asset_type));

    dates.forEach(d => {
      const entry = { ...byDate[d] };
      let currentTotal = 0;

      assets.forEach(asset => {
        if (entry[asset] !== undefined) {
          lastValues[asset] = entry[asset];
        } else if (lastValues[asset] !== undefined) {
          // Fill forward for Total calculation
          // But for "Individual" chart, maybe we leave it null to let Recharts connect?
          // User said "handle gap linearly". connectNulls does linear interpolation.
          // Fill forward produces "steps".
        }
        if (lastValues[asset] !== undefined) {
          currentTotal += lastValues[asset];
        }
      });

      entry.Total = currentTotal;
      result.push(entry);
    });

    return result;
  }, [data]);

  const assetTypes = React.useMemo(() => {
    return Array.from(new Set(data.map(d => d.asset_type)));
  }, [data]);

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        {showTotal ? (
          <AreaChart data={processedData}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#9ca3af"
              tickFormatter={(str) => format(new Date(str), 'MMM d')}
              minTickGap={30}
            />
            <YAxis
              stroke="#9ca3af"
              tickFormatter={(val) => `₹${val / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="Total"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorTotal)"
            />
          </AreaChart>
        ) : (
          <LineChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#9ca3af"
              tickFormatter={(str) => format(new Date(str), 'MMM d')}
              minTickGap={30}
            />
            <YAxis
              stroke="#9ca3af"
              tickFormatter={(val) => `₹${val / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {assetTypes.map((type, index) => (
              <Line
                key={type}
                type="monotone"
                connectNulls
                dataKey={type}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={{ r: 4, fill: COLORS[index % COLORS.length] }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
