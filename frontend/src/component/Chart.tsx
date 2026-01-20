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
  ChartData,
  ChartOptions,
} from "chart.js";
import { API_URL } from "@/config/env";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DailySolved {
  _id: string;
  totalSolved: number;
}

function formatLabel(d: Date) {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (d.toDateString() === today) return "Today";
  if (d.toDateString() === yesterday) return "Yesterday";

  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

export default function SolvedBarChart() {
  const [data, setData] = useState<ChartData<"bar">>({
    labels: [],
    datasets: [],
  });

  const studentId = localStorage.getItem("StudentID");

  useEffect(() => {
    fetch(`${API_URL}/api/v1/user/solved/daily/${studentId}`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then((res: DailySolved[]) => {
        const map: Record<string, number> = {};
        res.forEach(r => (map[r._id] = r.totalSolved));

        const labels: string[] = [];
        const values: number[] = [];

        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          labels.push(formatLabel(d));
          values.push(map[d.toISOString().slice(0, 10)] || 0);
        }

        setData({
          labels,
          datasets: [
            {
              label: "Questions Solved",
              data: values,
              backgroundColor: "#4f46e5",
            },
          ],
        });
      });
  }, [studentId]);

  const options: ChartOptions<"bar"> = {
    responsive: true,
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <Bar data={data} options={options} />
    </div>
  );
}
