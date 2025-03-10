import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white/50 backdrop-blur-lg shadow-md flex justify-between items-center px-10 py-4 z-50">
      <h1 className="text-2xl font-bold text-purple-700">DrawTogether</h1>
      <ul className="hidden md:flex justify-end items-center space-x-6 text-gray-700 font-medium">
        <li>
          <a href="#">Home</a>
        </li>
        <li>
          <a href="#features">Features</a>
        </li>
        <li>
          <a href="#why">Why Us</a>
        </li>
        <li>
          <div className="space-x-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button
                  type="button"
                  class="text-white bg-purple-500 hover:bg-purple-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center "
                >
                  <svg
                    class="w-4 h-4 me-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 18 19"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Sign in with Google
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </li>
      </ul>
    </nav>
  );
};
export default Navbar;
