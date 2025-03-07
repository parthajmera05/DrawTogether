import { Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-700 py-4 border-t border-gray-200">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-6">
        {/* Branding */}
        <p className="text-sm">© {new Date().getFullYear()} Parth Ajmera. All rights reserved.</p>

        {/* Social Links */}
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="https://github.com/parthajmera" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition flex items-center">
            <Github size={20} className="mr-1" /> 
          </a>
          <a href="https://linkedin.com/in/parthajmera" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition flex items-center">
            <Linkedin size={20} className="mr-1" /> 
          </a>
          <a href="https://twitter.com/parthajmera" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition flex items-center">
            <Twitter size={20} className="mr-1" /> 
          </a>
        </div>
      </div>
    </footer>
  );
}
