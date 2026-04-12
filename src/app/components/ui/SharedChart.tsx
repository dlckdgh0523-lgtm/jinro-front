import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from "recharts";

export interface ChartDataPoint {
  label: string;
  [key: string]: string | number;
}

export interface ChartSeries {
  key: string;
  name: string;
  color: string;
}

interface SharedChartProps {
  data: ChartDataPoint[];
  series: ChartSeries[];
  title: string;
  subtitle?: string;
  height?: number;
  yDomain?: [number, number];
  yTickFormatter?: (v: number) => string;
  tooltipFormatter?: (v: number, name: string) => [string, string];
}

// Remove CustomDot component entirely — use recharts built-in dot config instead

export function SharedChart({
  data,
  series,
  title,
  subtitle,
  height = 280,
  yDomain,
  yTickFormatter,
  tooltipFormatter,
}: SharedChartProps) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="mb-4">
        <h3 className="text-sm" style={{ color: "var(--foreground)", fontWeight: 600 }}>
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            {subtitle}
          </p>
        )}
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: -8 }}>
          <CartesianGrid
            key="grid"
            strokeDasharray="4 4"
            stroke="rgba(193,123,110,0.1)"
            vertical={false}
          />
          <XAxis
            key="xaxis"
            dataKey="label"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            key="yaxis"
            domain={yDomain}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={yTickFormatter}
          />
          <Tooltip
            key="tooltip"
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              boxShadow: "0 4px 16px rgba(193,123,110,0.12)",
              fontSize: "12px",
            }}
            formatter={tooltipFormatter}
          />
          {series.length > 1 && (
            <Legend
              key="legend"
              wrapperStyle={{ fontSize: "11px", color: "var(--muted-foreground)" }}
            />
          )}
          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={s.color}
              strokeWidth={2}
              strokeDasharray="5 3"
              dot={{ r: 4, fill: s.color, stroke: "#fff", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: s.color, stroke: "#fff", strokeWidth: 2 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}