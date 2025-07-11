import React from 'react';

export function Debug() {
  console.log('Debug component mounted');
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      left: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      zIndex: 9999,
      maxWidth: '80%',
      maxHeight: '50%',
      overflow: 'auto'
    }}>
      <h3>Debug Info</h3>
      <p>React version: {React.version}</p>
      <p>Window size: {window.innerWidth}x{window.innerHeight}</p>
      <p>URL: {window.location.href}</p>
      <p>LocalStorage keys: {Object.keys(localStorage).join(', ')}</p>
      <button onClick={() => {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }}>
        Force Logout
      </button>
    </div>
  );
}
