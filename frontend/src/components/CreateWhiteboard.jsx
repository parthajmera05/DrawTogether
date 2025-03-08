
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { PlusIcon } from 'lucide-react';

const CreateWhiteboard = () => {
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const createNewWhiteboard = () => {
    setIsCreating(true);
    
    // Generate a unique ID for the whiteboard
    const boardId = uuidv4();
    
    // In a production app, you might want to save this to your database
    // For now, we'll just navigate to the new board
    setTimeout(() => {
      navigate(`/whiteboard/${boardId}`);
    }, 500);
  };

  return (
    <button
      onClick={createNewWhiteboard}
      disabled={isCreating}
      className="flex items-center justify-center p-4 h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors duration-200"
    >
      {isCreating ? (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="mt-2 text-sm text-gray-600">Creating...</span>
        </div>
      ) : (
        <div className="flex flex-col items-center text-gray-500 hover:text-blue-600">
          <PlusIcon size={24} />
          <span className="mt-2 font-medium">New Whiteboard</span>
        </div>
      )}
    </button>
  );
};

export default CreateWhiteboard;