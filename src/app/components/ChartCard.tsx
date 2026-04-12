import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from "recharts";

interface LineConfig {
  dataKey: string;
  label: string;
  color: string;
  hidden?: boolean;
}

interface ChartCardProps {
  title: string;
  subtitle?: string;
  data: Record<string, string | number>[];
  xKey: string;
  lines: LineConfig[];
  height?: number;
  reversed?: boolean;
  className?: string;
}

export function ChartCard({
  title, subtitle, data, xKey, lines, height = 280, reversed = false, className = ""
}: ChartCardProps) {
  return (
    <div className={`bg-card rounded-xl border border-border p-5 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-foreground">{title}</h3>}
          {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid key="grid" strokeDasharray="4 2" stroke="currentColor" strokeOpacity={0.08} />
          <XAxis
            key="xaxis"
            dataKey={xKey}
            tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            key="yaxis"
            reversed={reversed}
            tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
            axisLine={false}
            tickLine={false}
            width={32}
          />
          <Tooltip
            key="tooltip"
            contentStyle={{
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: "var(--card)",
              color: "var(--foreground)",
              fontSize: 12,
            }}
          />
          <Legend
            key="legend"
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            iconType="circle"
            iconSize={8}
          />
          {/* Always render ALL lines — use hide prop instead of conditional render
              to keep recharts' internal child structure stable and avoid duplicate key warnings */}
          {lines.map((line) => (
            <Line
              key={line.dataKey}
              hide={line.hidden === true}
              type="monotone"
              dataKey={line.dataKey}
              name={line.label}
              stroke={line.color}
              strokeWidth={2}
              dot={{ r: 4, fill: "#fff", strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}