import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
const Hero = () => {
    return (
        <section id="hero" className="h-[80vh] text-center flex flex-col items-center justify-center px-6  ">
        <div className="mt-16">
        <h2 className="text-5xl font-bold text-gray-900 max-w-2xl">
          Collaborate & Create <span className="text-purple-600">Together</span> In Real-Time
        </h2>
        <p className="text-gray-600 mt-4 max-w-xl">
          Our collaborative whiteboard connects teams and ideas across any distance. Share, sketch, plan, and brainstorm on an infinite canvas.
        </p>
        <div className="mt-6 space-x-4">
          <SignedOut>
          <SignInButton mode="modal">
          
          <button className=" bg-purple-500 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium">Start For Free</button>
          </SignInButton>
          </SignedOut>
          <SignedIn>
            <button className=" bg-purple-500 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium" onClick={() => window.location.href = "/dashboard"}>Go To DashBoard</button>
          </SignedIn>
          <button className="border border-purple-600 text-purple-600 px-6 py-3 rounded-lg font-medium" onClick={() => window.open("https://github.com/parthajmera05/DrawTogether", "_blank")}>Learn More</button>
          
          
          
        </div>
        </div>
        <div className="flex justify-center items-center pt-20 animate-bounce text-purple-600 text-2xl">
        <a href="#features" >↓</a>  
      </div>
      </section>
    )
}

export default Hero ; 