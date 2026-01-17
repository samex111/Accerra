import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Menu , AlignRight} from 'lucide-react';
        // Assuming you have a standard Shadcn Button component
// If not, use a standard HTML button with the tailwind classes provided below

const LandingPage = () => {
  // Replace this URL with your actual image path
  const navigate = useNavigate();
  const bgImageUrl = '/image.jpg'

  return (
    <div 
      className="relative  min-h-screen bg-cover bg-center bg-no-repeat font-sans"
      style={{ 
        // constraint: image in css background url property
        backgroundImage: `url('${bgImageUrl}')` 
      }}
    >
      {/* Gradient Overlay: 
        The original design has a strong white fade at the top so text is readable.
        We use a linear gradient from white (top) to transparent (bottom).
      */}
      <div className="absolute inset-0 bg-gradient-to-b  from-white via-white/80 to-transparent pointer-events-none" />

      {/* Main Content Wrapper (relative z-10 to sit on top of the gradient) */}
      <div className="relative  z-10">
      
        {/* --- Navbar --- */}
        <nav className="w-full  flex items-center justify-between px-8 py-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-gray-900">
              <span className="text-red-500 mr-1">∿</span> 
              Accerra
            </span>
            
          </div>

          {/* Desktop Links */}
          <div className="hidden  items-center absolute gap-8   md:flex  left-1/2 -translate-x-1/2">
            <a href="#" className="text-md font-medium text-gray-600 hover:text-gray-900">Story</a>
            <a href="#" className="text-md font-medium text-gray-600 hover:text-gray-900">Why Accerra</a>
            <a href="#" className="text-md font-medium text-gray-600 hover:text-gray-900">features</a>
      
          </div>

          {/* Actions */}
          <div  className="hidden items-center gap-2 md:flex">
            <Button onClick={()=>navigate('/signup')} variant="outline" className="rounded-lg border-gray-300 bg-transparent px-6 text-gray-900 hover:bg-gray-50">
              Signup
            </Button>
            <Button onClick={() => navigate("/signin")} className="rounded-lg bg-black px-6 text-white hover:bg-gray-800">
              login
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon">
              <AlignRight className="h-6 w-6"/>
            </Button>
          </div>
        </nav>

        {/* --- Hero Section --- */}
        <main className="container mx-auto mt-16 flex flex-col items-center px-4 text-center sm:mt-24">
          
          
   {/* Actions */}
             <div className="hidden md:flex items-center gap-2">
     
    </div>

          {/* Headline */}
          <h1 className="max-w-4xl text-3xl font-medium tracking-tight text-gray-900 sm:text-3xl md:text-6xl">
            Building the future of <br className="hidden md:block" />
            AI-Native education
          </h1>

          {/* Subhead */}
          <p className="mt-6 max-w-md  text-lg text-black font-sans md:text-md">
            Helping student unlock the full power of AI - adopt it confidently, 
            scale it efficiently, and manage it effortlessly.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button onClick={()=>navigate('/signup')} className="h-12 rounded-lg bg-black px-8 text-base text-white hover:bg-gray-800">
              Get Started
            </Button>
            
          </div>

        </main>
      </div>
    </div>
  );
};

export default LandingPage;