import React, {useEffect, useState} from 'react';
import './App.css';

function App() {

  const [backData, setBackData] = useState([{}])

  useEffect(() => {
    fetch('/api')
      .then(
        res => res.json()
    ).then(
      data => {
        setBackData(data)
      }
    )
  }, [])

  return (
    <div>
      {(typeof backData.users === 'undefined') ? ( 
        <p>Loading...</p>
        ): (
          backData.users.map((user, index) => (
            <p key={index}>{user}</p>
          ))
        )}
    </div>
  )
}
export default App;
