import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function PieChart({ stats }) {

  const chartData = {
    labels: [
      "Positive",
      "Negative",
      "Neutral"
    ],

    datasets: [
      {
        data: [
          stats.positive,
          stats.negative,
          stats.neutral,
        ],

        backgroundColor: [
          "#22c55e",
          "#ef4444",
          "#facc15",
        ],
      },
    ],
  };

  return (
    <div className="chart-container">
      <Pie data={chartData} />
    </div>
  );
}

export default PieChart;