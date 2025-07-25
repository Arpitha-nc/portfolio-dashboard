import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { SectorSummary } from "../../interfaces/portfolio";
import CustomPieChartLegend from "./CustomPieChartLegend";

interface PortfolioDistributionChartProps {
  sectors: { [key: string]: SectorSummary };
}

const COLORS = [
  "#4CAF50",
  "#2196F3",
  "#FFC107",
  "#E91E63",
  "#9C27B0",
  "#FF9800",
  "#00BCD4",
  "#8BC34A",
  "#FF5722",
  "#607D8B",
  "#795548",
  "#673AB7",
  "#03A9F4",
  "#CDDC39",
];

interface PieLabelRenderProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
  index?: number;
  name?: string;
}

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: PieLabelRenderProps) => {
  if (
    cx === undefined ||
    cy === undefined ||
    midAngle === undefined ||
    innerRadius === undefined ||
    outerRadius === undefined ||
    percent === undefined
  ) {
    return null;
  }

  if (percent * 100 > 5) {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        style={{ fontSize: "12px" }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  }
  return null;
};

const PortfolioDistributionChart: React.FC<PortfolioDistributionChartProps> = ({
  sectors,
}) => {
  const chartData = Object.entries(sectors)
    .map(([sectorName, sector]) => ({
      name: sectorName,
      value: parseFloat(sector.totalInvestment.toFixed(2)),
    }))
    .filter((item) => item.value > 0);

  if (chartData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md h-80 flex items-center justify-center text-gray-500">
        No sector data available for distribution.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-auto flex flex-col items-center">
      <h3 className="text-xl font-bold mb-4 text-gray-800">
        Investment Distribution by Sector
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [
              `₹${value.toFixed(2)}`,
              name,
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
      <CustomPieChartLegend data={chartData} colors={COLORS} />
    </div>
  );
};

export default PortfolioDistributionChart;
