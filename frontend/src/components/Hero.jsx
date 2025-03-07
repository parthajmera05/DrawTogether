const Hero = () => {
    return (
        <div className="h-screen text-center flex flex-col items-center justify-center mt-20 px-6">
        <h2 className="text-5xl font-bold text-gray-900 max-w-2xl">
          Collaborate & Create <span className="text-purple-600">Together</span> In Real-Time
        </h2>
        <p className="text-gray-600 mt-4 max-w-xl">
          Our collaborative whiteboard connects teams and ideas across any distance. Share, sketch, plan, and brainstorm on an infinite canvas.
        </p>
        <div className="mt-6 space-x-4">
          <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium">Start For Free</button>
          <button className="border border-purple-600 text-purple-600 px-6 py-3 rounded-lg font-medium">Learn More</button>
        </div>
        <div className="flex justify-center mt-20 animate-bounce text-purple-600 text-2xl">
        ↓
      </div>
      </div>
    )
}

export default Hero ; 