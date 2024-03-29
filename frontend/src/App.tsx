import React, { useEffect, useState } from 'react';
import './App.css';

interface User {
  id: number;
  name: string;
  // Add more properties as needed
}

function App(): JSX.Element {
  const [backData, setBackData] = useState<User[]>([]); // Specify the type of backData

  useEffect(() => {
    fetch('/api')
      .then((res) => res.json())
      .then((data: { users: string[] }) => {
        // Assuming the response is an object with a 'users' property containing an array of strings
        setBackData(data.users.map((name, index) => ({ id: index, name }))); // Convert user strings to User objects
      })
      .catch((error) => console.error('Error fetching data:', error)); // Handle fetch errors
  }, []);

  return (
    <div>
      {backData.length === 0 ? (
        <p>Loading...</p>
      ) : (
        backData.map((user) => (
          <p key={user.id}>{user.name}</p>
        ))
      )}
    </div>
  );
}

export default App;