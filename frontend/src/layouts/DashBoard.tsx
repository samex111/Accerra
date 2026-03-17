import SolvedBarChart from "@/component/Chart";
import SelectSubject from "@/component/SelectSubject";
import Todo from "@/component/Todo";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { API_URL } from "@/config/env";
import { GraduationCap, Pen } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardOverview() {
  const [quote , setQuote] = useState('');
useEffect(() => {
  async function getQuote() {
    try {
      const res = await fetch(`${API_URL}/api/v1/user/quote`, {
        method: "GET",
        headers: { "Content-type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      console.log("Quote from backend: ", data);
     setQuote(data.quote[0]?.quote || "");
    } catch (err) {
      console.error(err);
      setQuote("Something went wrong");
    }
  }

  getQuote();
}, []);   console.log("Quote:", quote)
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="p-1 text-2xl font-semibold">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground">
          Track your practice, todos and progress
        </p>
        <p>
          {quote}
        </p>
      </div>

      {/* Top section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Practice</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <SelectSubject />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Today’s Todo</CardTitle>
            <Pen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="max-h-[320px] overflow-y-auto">
            <Todo />
          </CardContent>
        </Card>
      </div>

      {/* Bottom section */}
      <Card>
        <CardHeader>
          <CardTitle>Progress (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <SolvedBarChart />
        </CardContent>
      </Card>
    </div>
  );
}
