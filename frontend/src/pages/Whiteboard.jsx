import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Stage, Layer, Line, Rect, Text, Circle } from 'react-konva';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';
import { PencilIcon, EraserIcon, SquareIcon, CircleIcon, TypeIcon, HandIcon, TrashIcon, UsersIcon, ZoomInIcon, ZoomOutIcon, ShareIcon, SaveIcon } from 'lucide-react';

// State management
import { create } from 'zustand';

const useStore = create((set) => ({
  elements: [],
  setElements: (elements) =>{
    console.log("Setting elements in Zustand store:", elements);
     set({ elements })},
  addElement: (element) => set((state) => ({ 
    elements: [...state.elements, element] 
  })),
  updateElement: (id, changes) => set((state) => ({
    elements: state.elements.map(el => 
      el.id === id ? { ...el, ...changes } : el
    )
  })),
  clearElements: () => set({ elements: [] }),
}));

const Whiteboard = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  
  // Refs
  const stageRef = useRef(null);
  const socketRef = useRef(null);
  
  // Local state
  const [tool, setTool] = useState('pencil');
  const [color, setColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copyLinkText, setCopyLinkText] = useState('Copy Link');
  
  // Canvas state
  const [viewport, setViewport] = useState({
    position: { x: 0, y: 0 },
    scale: 1,
  });
  
  // Store state
  const elements = useStore((state) => state.elements);
  const setElements = useStore((state) => state.setElements);
  const addElement = useStore((state) => state.addElement);
  const updateElement = useStore((state) => state.updateElement);
  const clearElements = useStore((state) => state.clearElements);
  
  // Current element being drawn
  const [currentElement, setCurrentElement] = useState(null);

  // Fetch board data on component mount
  const fetchBoardData = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/whiteboards/${boardId}`, {
        method: 'GET',
      });
      const data = await response.json();
      
      if (data.success && Array.isArray(data.elements)) {
        setElements(data.elements);
      } else {
        setElements([]); // Ensure it's always an array
      }
    } catch (error) {
      console.error("Error fetching board data:", error);
      setElements([]); // Fallback to empty array
    }
  };

  useEffect(() => {
    fetchBoardData();
  }, [boardId]);

  // Save board data periodically
  const saveBoardData = async (elements) => {
    try {
      const response = await fetch(`http://localhost:3000/api/save-board`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boardId,
          name: user.fullName,
          elements,
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log("Board auto-saved");
      } else {
        console.error("Auto-save failed.");
      }
    } catch (error) {
      console.error("Error auto-saving board:", error);
    }
  };
 
  useEffect(() => {
    const interval = setInterval(() => {
      saveBoardData(elements);
    }, 5000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  },[elements]);

  // Connect to Socket.IO when component mounts
  useEffect(() => {
    if (!isSignedIn) {
      navigate('/');
      return;
    }
    
    // Connect to socket server
    const socket = io('http://localhost:3000', {
      auth: {
        userId: user?.id,
        boardId: boardId,
      },
      transports: ['websocket'],
      upgrade: false
    });
    socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
    });
    socketRef.current = socket;
    console.log("Socket connected:", socket.connected);
    // Join the board room
    socket.emit('join-board', boardId);
    
    // Socket event listeners
    socket.on('board-state', (data) => {
      setElements(data.elements || []);
    });
    
    socket.on('element-received', (element) => {
      addElement(element);
    });
    
    socket.on('element-updated', ({ elementId, updates }) => {
      updateElement(elementId, updates);
    });
    
    socket.on('element-deleted', (elementId) => {
      setElements((prev) => prev.filter((el) => el.id !== elementId));
    });
    
    socket.on('board-cleared', () => {
      clearElements();
      toast.success('Board cleared by a collaborator');
    });
    
    socket.on('active-users', (users) => {
      setActiveUsers(users);
    });
    
    socket.on('user-joined', (user) => {
      toast.success(`${user.name || 'Someone'} joined the board`);
    });
    
    socket.on('user-left', (userId) => {
      setActiveUsers((prev) => prev.filter((user) => user.id !== userId));
    });
    
    // Clean up on unmount
    return () => {
      socket.disconnect();
    };
  }, [boardId, isSignedIn, user, addElement, clearElements, navigate, setElements, updateElement]);

  // Handle drawing actions
  const handleMouseDown = (e) => {
    if (tool === 'hand') {
      return; // Handle panning separately
    }
    
    const pos = e.target.getStage().getRelativePointerPosition();
    
    const newElement = {
      id: uuidv4(),
      tool,
      points: tool === 'pencil' || tool === 'eraser' ? [pos.x, pos.y] : [],
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
      strokeWidth,
      stroke: tool === 'eraser' ? '#ffffff' : color,
      fill: tool === 'circle' || tool === 'rectangle' ? 'transparent' : undefined,
      text: tool === 'text' ? '' : undefined,
      fontSize: tool === 'text' ? 20 : undefined,
    };
    
    setCurrentElement(newElement);
    setIsDrawing(true);
  };
  
  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    
    const stage = e.target.getStage();
    const pos = stage.getRelativePointerPosition();
    
    if (tool === 'pencil' || tool === 'eraser') {
      setCurrentElement({
        ...currentElement,
        points: [...currentElement.points, pos.x, pos.y],
      });
    } else if (tool === 'rectangle' || tool === 'circle') {
      setCurrentElement({
        ...currentElement,
        width: pos.x - currentElement.x,
        height: pos.y - currentElement.y,
      });
    }
  };
  
  const handleMouseUp = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    
    // Add the finished element
    if (currentElement) {
      // Add to local state
      console.log("Finalizing element:", currentElement);
      addElement(currentElement);
      
      // Send to server
      socketRef.current?.emit('draw-element', {
        boardId,
        element: currentElement,
      });
      
      setCurrentElement(null);
    }
  };
  
  // Handle panning and zooming
  const handleWheel = (e) => {
    e.evt.preventDefault();
    
    const stage = stageRef.current;
    const oldScale = viewport.scale;
    
    // Calculate new scale
    const pointerPos = stage.getPointerPosition();
    const mousePointTo = {
      x: (pointerPos.x - viewport.position.x) / oldScale,
      y: (pointerPos.y - viewport.position.y) / oldScale,
    };
    
    // Handle zoom
    const newScale = e.evt.deltaY < 0 ? oldScale * 1.1 : oldScale / 1.1;
    
    // Limit zoom level
    const limitedScale = Math.max(0.1, Math.min(10, newScale));
    
    // Update viewport
    const newPos = {
      x: pointerPos.x - mousePointTo.x * limitedScale,
      y: pointerPos.y - mousePointTo.y * limitedScale,
    };
    
    const newViewport = {
      position: newPos,
      scale: limitedScale,
    };
    
    setViewport(newViewport);
    
    // Broadcast viewport change
    socketRef.current?.emit('view-update', {
      boardId,
      viewportState: newViewport,
    });
  };
  
  const handleDragStart = () => {
    if (tool !== 'hand') return;
  };
  
  const handleDragMove = (e) => {
    if (tool !== 'hand') return;
    
    setViewport({
      ...viewport,
      position: e.target.position(),
    });
  };
  
  const handleDragEnd = () => {
    if (tool !== 'hand') return;
    
    // Broadcast viewport change
    socketRef.current?.emit('view-update', {
      boardId,
      viewportState: viewport,
    });
  };
  
  // Tool selection
  const selectTool = (newTool) => {
    setTool(newTool);
  };
  
  // Clear board
  const clearBoard = () => {
    if (window.confirm('Are you sure you want to clear the board?')) {
      clearElements();
      socketRef.current?.emit('clear-board', boardId);
    }
  };
  
  // Share board
  const shareBoard = () => {
    setShowShareDialog(true);
  };
  
  const copyBoardLink = () => {
    const link = `${window.location.origin}/whiteboard/${boardId}`;
    navigator.clipboard.writeText(link);
    setCopyLinkText('Copied!');
    setTimeout(() => setCopyLinkText('Copy Link'), 2000);
  };

  const saveBoard = () => {
    saveBoardData(elements);
    toast.success('Board saved successfully');
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="bg-white border-b flex items-center justify-between p-2 shadow-sm">
        <div className="flex items-center space-x-1">
          {/* Drawing tools */}
          <button 
            onClick={() => selectTool('pencil')}
            className={`p-2 rounded ${tool === 'pencil' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            title="Pencil"
          >
            <PencilIcon size={20} />
          </button>
          <button 
            onClick={() => selectTool('eraser')}
            className={`p-2 rounded ${tool === 'eraser' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            title="Eraser"
          >
            <EraserIcon size={20} />
          </button>
          <button 
            onClick={() => selectTool('rectangle')}
            className={`p-2 rounded ${tool === 'rectangle' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            title="Rectangle"
          >
            <SquareIcon size={20} />
          </button>
          <button 
            onClick={() => selectTool('circle')}
            className={`p-2 rounded ${tool === 'circle' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            title="Circle"
          >
            <CircleIcon size={20} />
          </button>
          <button 
            onClick={() => selectTool('text')}
            className={`p-2 rounded ${tool === 'text' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            title="Text"
          >
            <TypeIcon size={20} />
          </button>
          <button 
            onClick={() => selectTool('hand')}
            className={`p-2 rounded ${tool === 'hand' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            title="Pan"
          >
            <HandIcon size={20} />
          </button>
          
          {/* Divider */}
          <div className="h-6 w-px bg-gray-300 mx-1"></div>
          
          {/* Color picker */}
          <div className="flex items-center space-x-1">
            <input 
              type="color" 
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-6 h-6 border-0 p-0 bg-transparent cursor-pointer" 
            />
            
            {/* Stroke width */}
            <select 
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              className="border rounded px-1 py-0.5 text-sm"
            >
              <option value="1">1px</option>
              <option value="3">3px</option>
              <option value="5">5px</option>
              <option value="8">8px</option>
              <option value="12">12px</option>
            </select>
          </div>
          
          {/* Divider */}
          <div className="h-6 w-px bg-gray-300 mx-1"></div>
          
          {/* Canvas actions */}
          <button 
            onClick={clearBoard}
            className="p-2 rounded hover:bg-gray-100 text-red-500"
            title="Clear Board"
          >
            <TrashIcon size={20} />
          </button>
          <button 
            onClick={() => setViewport({ position: { x: 0, y: 0 }, scale: 1 })}
            className="p-2 rounded hover:bg-gray-100"
            title="Reset View"
          >
            <ZoomInIcon size={20} />
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Active users */}
          <div className="flex items-center">
            <UsersIcon size={16} className="mr-1" />
            <span className="text-sm">{activeUsers.length}</span>
          </div>
          
          {/* Share button */}
          <button 
            onClick={shareBoard}
            className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            <ShareIcon size={16} className="mr-1" />
            Share
          </button>
          
          {/* Save button */}
          <button 
            className="flex items-center px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200 text-sm"
            onClick={saveBoard}
          >
            <SaveIcon size={16} className="mr-1" />
            Save
          </button>
        </div>
      </div>
      
      {/* Main canvas */}
      <div className="flex-1 relative overflow-hidden bg-gray-50">
        <Stage
          ref={stageRef}
          width={window.innerWidth}
          height={window.innerHeight - 56} // Subtract toolbar height
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          draggable={tool === 'hand'}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
          position={viewport.position}
          scale={{ x: viewport.scale, y: viewport.scale }}
        >
          <Layer>
            {/* Draw grid (for infinite canvas visual reference) */}
            <Rect
              x={-10000}
              y={-10000}
              width={20000}
              height={20000}
              fill="#ffffff"
            />
            
            {/* Grid lines */}
            {Array.from({ length: 100 }).map((_, i) => (
              <Line
                key={`grid-h-${i}`}
                points={[-10000, i * 100 - 5000, 10000, i * 100 - 5000]}
                stroke="#f0f0f0"
                strokeWidth={1}
              />
            ))}
            {Array.from({ length: 100 }).map((_, i) => (
              <Line
                key={`grid-v-${i}`}
                points={[i * 100 - 5000, -10000, i * 100 - 5000, 10000]}
                stroke="#f0f0f0"
                strokeWidth={1}
              />
            ))}
            
            {/* Draw all saved elements */}
            {elements.map((element) => {
              console.log("Rendering element:", element);
              if (element.tool === 'pencil' || element.tool === 'eraser') {
                return (
                  <Line
                    key={element.id}
                    points={element.points}
                    stroke={element.stroke}
                    strokeWidth={element.strokeWidth}
                    tension={0.5}
                    lineCap="round"
                    lineJoin="round"
                    globalCompositeOperation={
                      element.tool === 'eraser' ? 'destination-out' : 'source-over'
                    }
                  />
                );
              } else if (element.tool === 'rectangle') {
                return (
                  <Rect
                    key={element.id}
                    x={element.x}
                    y={element.y}
                    width={element.width}
                    height={element.height}
                    stroke={element.stroke}
                    strokeWidth={element.strokeWidth}
                    fill={element.fill}
                  />
                );
              } else if (element.tool === 'circle') {
                return (
                  <Circle
                    key={element.id}
                    x={element.x + element.width / 2}
                    y={element.y + element.height / 2}
                    radius={Math.abs(element.width + element.height) / 4}
                    stroke={element.stroke}
                    strokeWidth={element.strokeWidth}
                    fill={element.fill}
                  />
                );
              } else if (element.tool === 'text') {
                return (
                  <Text
                    key={element.id}
                    x={element.x}
                    y={element.y}
                    text={element.text}
                    fontSize={element.fontSize}
                    fontFamily="Arial"
                    fill={element.stroke}
                  />
                );
              }
              return null;
            })}
            
            {/* Draw current element while drawing */}
            {isDrawing && currentElement && (
              currentElement.tool === 'pencil' || currentElement.tool === 'eraser' ? (
                <Line
                  points={currentElement.points}
                  stroke={currentElement.stroke}
                  strokeWidth={currentElement.strokeWidth}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                  globalCompositeOperation={
                    currentElement.tool === 'eraser' ? 'destination-out' : 'source-over'
                  }
                />
              ) : currentElement.tool === 'rectangle' ? (
                <Rect
                  x={currentElement.x}
                  y={currentElement.y}
                  width={currentElement.width}
                  height={currentElement.height}
                  stroke={currentElement.stroke}
                  strokeWidth={currentElement.strokeWidth}
                  fill={currentElement.fill}
                />
              ) : currentElement.tool === 'circle' ? (
                <Circle
                  x={currentElement.x + currentElement.width / 2}
                  y={currentElement.y + currentElement.height / 2}
                  radius={Math.abs(currentElement.width + currentElement.height) / 4}
                  stroke={currentElement.stroke}
                  strokeWidth={currentElement.strokeWidth}
                  fill={currentElement.fill}
                />
              ) : null
            )}
          </Layer>
        </Stage>
      </div>
      
      {/* Share dialog */}
      {showShareDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Share this whiteboard</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Board link
              </label>
              <div className="flex">
                <input 
                  type="text" 
                  readOnly 
                  value={`${window.location.origin}/whiteboard/${boardId}`}
                  className="flex-1 border rounded-l-md px-3 py-2 text-sm bg-gray-50"
                />
                <button
                  onClick={copyBoardLink}
                  className="bg-blue-600 text-white px-3 py-2 rounded-r-md text-sm"
                >
                  {copyLinkText}
                </button>
              </div>
            </div>
            
            <div className="border-t pt-4 flex justify-end">
              <button
                onClick={() => setShowShareDialog(false)}
                className="bg-gray-100 px-4 py-2 rounded-md text-sm hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Whiteboard;