import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const subjects = [
  { label: "Maths", path: "/maths" },
  { label: "Physics", path: "/physics" },
  { label: "Chemistry", path: "/chemistry" },
];

export default function SelectSubject() {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Practice Questions</h3>

      {subjects.map((s) => (
        <Button
          key={s.path}
          variant="outline"
          className="w-full"
          onClick={() => navigate(s.path)}
        >
          {s.label}
        </Button>
      ))}

      <h3 className="font-semibold pt-2">Take Test</h3>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => navigate("/test")}
      >
        Start Test
      </Button>
    </div>
  );
}
