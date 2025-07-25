interface LegendProps {
  data: { name: string; value: number }[];
  colors: string[];
}

const CustomPieChartLegend: React.FC<LegendProps> = ({ data, colors }) => {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <ul className="flex flex-wrap justify-center mt-4 p-2 bg-gray-50 rounded-lg shadow-sm">
      {data.map((entry, index) => {
        const percent = ((entry.value / total) * 100).toFixed(1);
        return (
          <li key={index} className="flex items-center mx-2 my-1">
            <span
              className="inline-block w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: colors[index % colors.length] }}
            ></span>
            <span className="text-gray-700 text-sm">
              {entry.name} ({percent}%)
            </span>
          </li>
        );
      })}
    </ul>
  );
};

export default CustomPieChartLegend;
