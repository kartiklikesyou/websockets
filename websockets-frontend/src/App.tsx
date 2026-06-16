import { useEffect, useState, useRef } from "react"

function App() {
  const [messages, setMessages] = useState<string[]>(["Welcome to the Server"])
  const inputRef = useRef<HTMLInputElement | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  function onClick() {
    const message = inputRef.current?.value;
    wsRef.current?.send(JSON.stringify({
      type: "chat",
      payload: {
        message: message
      }
    }))
  }

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080")
    ws.onmessage = (e) => {
      setMessages((m) => [...m, e.data])
    }
    wsRef.current=ws
    ws.onopen = () => {
      ws.send(JSON.stringify({
        type:"join",
        payload: {roomId:"1"}
      }))
    }
    return () => ws.close()
  }, [])

  return (
    <>
      <div className='h-screen bg-black'>
        {messages.map((message) => {return <p>{message}</p>})}
      </div>
      <div>
        <input className="flex-1 p-4" ref={inputRef} type="text" placeholder="Message" />
        <button onClick={onClick}>Send Message</button>
      </div>
    </>
  )
}

export default App
