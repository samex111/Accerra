import { useNavigate } from "react-router-dom";
export default function LandingPage() {
    const navigate = useNavigate();
    const handleJee = () => {
        navigate("/user/signup");
    }
    const handleNeet = () => {
        navigate("/user/signup");
    }
    return (
        <>
            <div>
                <div>
                    <h1 className="text-2xl ">Get started</h1>
                </div>
                <div className="flex gap-2 mt-5 text-xl">
                    <button className="border" onClick={handleJee }>Jee</button>
                    <button className="border" onClick={handleNeet}>Neet</button>
                </div>
            </div>
        </>
    )
}