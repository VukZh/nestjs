import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [msg, setMsg] = useState("")

  console.log('msg', msg);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3000");
      const data = await response.json();
      console.log(data);
      setMsg(data.message);
    };
    fetchData();
  }, []);

  return (
    <div>
      {msg}
    </div>
  )
}

export default App
