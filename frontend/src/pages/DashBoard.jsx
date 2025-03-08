import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { format } from 'date-fns';
import { 
  ClipboardIcon, 
  UsersIcon,
  CalendarIcon,
  ChevronDownIcon
} from 'lucide-react';
import CreateWhiteboard from '../components/CreateWhiteboard';

const Dashboard = () => {
  const { user } = useUser();
  const [boards, setBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      fetch('/api/boards', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
      response.json().then((data) => {
        setBoards(data);
      })
      })
      setIsLoading(false);
    }, 800);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-purple-800">Your Whiteboards</h1>
        <p className="text-gray-600 mt-1">Create and collaborate on interactive whiteboards</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create new whiteboard card */}
        <CreateWhiteboard />

        {/* Loading states */}
        {isLoading && 
          Array(2).fill(0).map((_, i) => (
            <div key={i} className="bg-purple-100 border border-purple-300 rounded-lg p-4 h-32 animate-pulse">
              <div className="h-4 bg-purple-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-purple-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-purple-200 rounded w-2/3"></div>
            </div>
          ))
        }
        
        {/* Whiteboard cards */}
        {!isLoading && boards.map(board => (
          <Link 
            key={board.id} 
            to={`/whiteboard/${board.id}`}
            className="bg-white border border-purple-300 rounded-lg p-4 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-start">
              <div className="bg-purple-100 rounded p-2 mr-3">
                <ClipboardIcon size={20} className="text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-purple-900 truncate">{board.name}</h3>
                
                <div className="flex items-center mt-3 text-xs text-gray-500">
                  <div className="flex items-center mr-4">
                    <CalendarIcon size={14} className="mr-1 text-purple-500" />
                    {format(board.updatedAt, 'MMM d, yyyy')}
                  </div>
                  <div className="flex items-center">
                    <UsersIcon size={14} className="mr-1 text-purple-500" />
                    {board.collaborators} {board.collaborators === 1 ? 'user' : 'users'}
                  </div>
                </div>
              </div>
              
              <button className="text-purple-400 hover:text-purple-600 p-1">
                <ChevronDownIcon size={20} />
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
