import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useContext } from "react";
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
import { StudentContext } from "./StudentContext";
 
// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Define props type


// Backend response type
interface DailySolved {
  _id: string;        // date string "YYYY-MM-DD"
  totalSolved: number;
}
  // @ts-ignore

export default function SolvedBarChart() {
  const studentContext = useContext(StudentContext); 
  const studentID =  studentContext?.studentId;
  const id = localStorage.getItem('StudentID');
  console.log(id)
  // console.log("Student Id",studentID)
  // useEffect(()=>{
  //   console.log(studentID)
  // },[studentID])

  // Chart data state type
  // const {studentId} = useAuth()!;
  // @ts-ignore


  const [chartData, setChartData] = useState<ChartData<"bar", number[], string>>({
    labels: [],
    datasets: []
  });


  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/user/solved/daily/${id}` , {
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
         console.log(dateMap)
          const today = new Date();
         const yesterday = new Date(today);
         yesterday.setDate(today.getDate() - 1); 
         const a =  (today.toDateString()).slice(4,10);
         console.log("a", a)
         const b=  (yesterday.toDateString()).slice(4,10);

        // Last 7 days
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          console.log("d: ",d)
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().slice(0, 10);
          const s1 = d.toDateString()
          const fdate = s1.substring(4,10)
          if(fdate === a){
          labels.push("Today");
          } else if (fdate === b){
            labels.push("Yesterday")
          }
          else{
          labels.push(fdate);
          }
          

          values.push(dateMap[dateStr] || 0);
        }

        setChartData({
          labels,
          datasets: [
            {
              label: "Questions Solved",
              data: values, 
              backgroundColor: "rgb(59,53,240)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1
            }
          ]
        });
      });
  }, [id]);

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
    <div style={{ maxWidth: '500px', margin: "auto" }} >
      <h2 style={{ textAlign: "center" }}>Last 7 Days Solved Questions</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
}
