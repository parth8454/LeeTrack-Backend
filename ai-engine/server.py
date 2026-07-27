from fastapi import FastAPI,HTTPException
from pydantic import BaseModel
from fastapi.responses import StreamingResponse 
from langchain_core.messages import HumanMessage
from graph import sensei_app

app = FastAPI(title="LeeTrack Ai sensei API")

class ChatRequest(BaseModel):
    email: str
    message:str

@app.post("/api/chat")
async def chat_with_sensei(request: ChatRequest):
    try:
        initial_state = {
            "user_email" : request.email,
            "messages" : [HumanMessage(content = request.message)]
        }

        config = {"configurable": {"thread_id": request.email}}

        # events 

        async def event_gen():

            async for event in sensei_app.astream_events(initial_state,config,version="v2"):
                kind=event["event"]

                if kind =="on_tool_start":
                    tool_name = event["name"]
                    if tool_name == "get_stats":
                        yield f"data: [ACTION] Checking your LeetCode profile...\n\n"
                    elif tool_name == "web_search":
                        yield f"data: [ACTION] Searching the web for DSA concepts...\n\n"
                
                elif kind == "on_chat_model_stream":
                    chunk = event["data"]["chunk"].content

                    if chunk:
                        safe_chunk = chunk.replace("\n", "<br>")
                        yield f"data: {safe_chunk}\n\n"

            yield "data: [DONE]\n\n"
        
        return StreamingResponse(event_gen(), media_type="text/event-stream")

        # result = sensei_app.invoke(initial_state)

        # final_message = result["messages"][-1].content  

        # return {"response" : final_message}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))