const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 w-full bg-white/50 backdrop-blur-lg shadow-md flex justify-between items-center px-10 py-4 z-50">
        <h1 className="text-2xl font-bold text-purple-700">DrawTogether</h1>
        <ul className="hidden md:flex justify-end items-center space-x-6 text-gray-700 font-medium">
          <li>Home</li>
          <li>Features</li>
          <li>Why Us</li>
          <li>
          <div className="space-x-4">
          <button className="bg-purple-200 text-purple-700 px-4 py-2 rounded-lg">Sign In</button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg">Login</button>
        </div>
          </li>
        </ul>
        
      </nav>
    )
}
export default Navbar;