import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
export default function LandingPage() {
    const navigate = useNavigate();
    const handleGetStarted = () => {
        navigate("/user/signup");
    }
    
    return (
        <>
            <div className="w-full h-screen bg-gradient-to-b from-purple-50 to-pink-100 flex items-center justify-center">
                <div className="flex gap-1">
                    <Button  size={'lg'} className="font-bold" onClick={handleGetStarted } >Get started</Button>
                </div>
            </div>
        </>
    )
}