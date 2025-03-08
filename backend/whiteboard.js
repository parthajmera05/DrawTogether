
import { Server } from "socket.io";
import { clerkClient } from '@clerk/clerk-sdk-node';

function setupWhiteboardServer(server) {
  // Initialize Socket.IO server
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5174',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

 
  const activeBoards = new Map();

  // Whiteboard namespaces
  const whiteboardNamespace = io.of('/whiteboard');

  whiteboardNamespace.on('connection', async (socket) => {
    console.log('User connected to whiteboard:', socket.id);
    
    // Get user info from Clerk
    const { userId, boardId } = socket.handshake.auth;
    let user = null;
    
    if (userId) {
      try {
        user = await clerkClient.users.getUser(userId);
      } catch (error) {
        console.error('Error fetching user from Clerk:', error);
      }
    }
    
    // Join specific board room
    socket.on('join-board', (boardId) => {
      socket.join(boardId);
      console.log(`User ${socket.id} joined board: ${boardId}`);
      
      // Initialize board if it doesn't exist
      if (!activeBoards.has(boardId)) {
        activeBoards.set(boardId, {
          elements: [],
          users: new Set()
        });
      }
      
      // Add user to board
      const board = activeBoards.get(boardId);
      board.users.add(socket.id);
      
      // Send current board state to the new user
      socket.emit('board-state', {
        elements: board.elements
      });
      
      // Notify others about new user
      socket.to(boardId).emit('user-joined', {
        id: socket.id,
        name: user ? user.firstName : 'Anonymous'
      });
      
      // Send list of active users
      const activeUsers = Array.from(board.users).map(id => ({
        id,
        isCurrentUser: id === socket.id,
        name: id === socket.id ? (user ? user.firstName : 'You') : 'Collaborator'
      }));
      
      whiteboardNamespace.to(boardId).emit('active-users', activeUsers);
    });
    
    // Handle drawing elements
    socket.on('draw-element', (data) => {
      const { boardId, element } = data;
      
      if (activeBoards.has(boardId)) {
        const board = activeBoards.get(boardId);
        board.elements.push(element);
        
        // Broadcast to others in the room
        socket.to(boardId).emit('element-received', element);
      }
    });
    
    // Handle element updates (moving, resizing)
    socket.on('update-element', (data) => {
      const { boardId, elementId, updates } = data;
      
      if (activeBoards.has(boardId)) {
        const board = activeBoards.get(boardId);
        // Find and update the element
        const elementIndex = board.elements.findIndex(el => el.id === elementId);
        
        if (elementIndex !== -1) {
          board.elements[elementIndex] = {
            ...board.elements[elementIndex],
            ...updates
          };
          
          // Broadcast to others
          socket.to(boardId).emit('element-updated', {
            elementId,
            updates
          });
        }
      }
    });
    
    // Handle canvas view updates (panning/zooming)
    socket.on('view-update', (data) => {
      socket.to(data.boardId).emit('view-updated', {
        viewportState: data.viewportState,
        userId: socket.id
      });
    });
    
    // Handle clear board
    socket.on('clear-board', (boardId) => {
      if (activeBoards.has(boardId)) {
        const board = activeBoards.get(boardId);
        board.elements = [];
        
        // Broadcast to all in the room including sender
        whiteboardNamespace.to(boardId).emit('board-cleared');
      }
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected from whiteboard:', socket.id);
      
      // Remove user from all boards they were part of
      for (const [boardId, board] of activeBoards.entries()) {
        if (board.users.has(socket.id)) {
          board.users.delete(socket.id);
          
          // Notify others
          socket.to(boardId).emit('user-left', socket.id);
          
          // Update active users list
          const activeUsers = Array.from(board.users).map(id => ({
            id,
            name: 'Collaborator'
          }));
          
          whiteboardNamespace.to(boardId).emit('active-users', activeUsers);
          
          // Clean up empty boards
          if (board.users.size === 0) {
            // Consider persistent storage before cleanup
            // saveBoard(boardId, board.elements);
            activeBoards.delete(boardId);
          }
        }
      }
    });
  });

  return io;
}

module.exports = { setupWhiteboardServer };