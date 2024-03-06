import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const App = () => {
  const [userId, setUserId] = useState();
  const[joined, setJoined] = useState(false);
  const [calleeId, setCalleeId] = useState('');

  const joinCall = () => {
    setJoined(true)
    socket.emit('join', userId);
  }

  const handleCall = () => {
    socket.emit('call', { userId, calleeId });
  };

  useEffect(() => {
    // Listen for incoming call events
    socket.on('incomingCall', ({callerId, message}) => {
      console.log('getting incoming call')
    });

    // Cleanup on unmount
    return () => {
      socket.off('incomingCall'); // Remove the event listener
    };
  }, []);

  return (
    <div>
      { joined ? <p>Joined({`${userId}`})</p> :
        <>
          <input 
            type="text" 
            placeholder="Your ID" 
            value={userId} 
            onChange={(e) => setUserId(e.target.value)} 
          />
          <button onClick={joinCall}>Join network</button>
        </>
      }
      <div>
        <input 
          type="text" 
          placeholder="Callee's ID" 
          value={calleeId} 
          onChange={(e) => setCalleeId(e.target.value)} 
        />
        <button onClick={handleCall}>Call</button>
      </div>
    </div>
  );
};

export default App;
