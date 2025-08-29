import { WebSocketServer } from 'ws';
import { callGemini } from './Service.ts'
import type { AIMessage } from './AIMassage.ts';


const wss = new WebSocketServer({ port: 8080 })
  

wss.on("connection", (ws) => {
  console.log("client connected");

  ws.on('message', async (data) => {
    try {
      const parsed = JSON.parse(data.toString()) as { messages: AIMessage[] };
  
      const answer = await callGemini(parsed.messages);

      ws.send(JSON.stringify({ role: 'assistant', content: answer }));


    }
    catch (err) {
      console.error(err);
      ws.send(JSON.stringify({ error: "Something went wrong!" }));
      console.log("error");
    }

  })
  ws.on("close", () => {
    console.log("Client disconnected ❌");
  });

})