import {WebSocketServer,WebSocket} from "ws"
const ws = new WebSocketServer({port:8080})

interface SocketProps{
    socket : WebSocket,
    room : string
}

const allSockets:SocketProps[]=[]

ws.on("connection",(socket)=>{
    socket.on("message",(message)=>{
    const parsedMessage=JSON.parse(message.toString())       
    if(parsedMessage.type==="join"){
        allSockets.push({
            socket,
            room:parsedMessage.payload.roomId
        })
    }
    if(parsedMessage.type==="chat"){
        let currentUserRoom = allSockets.find((x)=>x.socket==socket)?.room
        allSockets.filter((x)=>x.room==currentUserRoom)?.forEach((x)=>x.socket.send(parsedMessage.payload.message))
    }
    })
})