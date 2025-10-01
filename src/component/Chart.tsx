import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
  type ChartData
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Define props type
interface SolvedBarChartProps {
  studentId: string;
}

// Backend response type
interface DailySolved {
  _id: string;        // date string "YYYY-MM-DD"
  totalSolved: number;
}

export default function SolvedBarChart({ studentId }: SolvedBarChartProps) {
  // Chart data state type
  const [chartData, setChartData] = useState<ChartData<"bar", number[], string>>({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/user/solved/daily/${studentId}` , {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    })
      .then((res) => res.json())
      .then((data: DailySolved[]) => {
        const labels: string[] = [];
        const values: number[] = [];

        // Map date → totalSolved
        const dateMap: Record<string, number> = {};
        data.forEach((item) => {
          dateMap[item._id] = item.totalSolved;
        });

        // Last 7 days
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().slice(0, 10);
          labels.push(dateStr);
          values.push(dateMap[dateStr] || 0);
        }

        setChartData({
          labels,
          datasets: [
            {
              label: "Questions Solved",
              data: values,
              backgroundColor: "rgba(54, 162, 235, 0.5)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1
            }
          ]
        });
      });
  }, [studentId]);

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      },
      title: {
        display: true,
        text: "Daily Solved Questions"
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>Last 7 Days Solved Questions</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
}
