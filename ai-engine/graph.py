from langgraph.graph import MessagesState
from typing import List,Optional
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEndpoint,ChatHuggingFace
from langchain_core.messages import SystemMessage,AIMessage
from langgraph.prebuilt import ToolNode, tools_condition
from langgraph.graph import StateGraph,START,END
from langgraph.checkpoint.memory import MemorySaver
from tools import get_stats,web_search
from dotenv import load_dotenv,dotenv_values
import os

load_dotenv()

groq_key = os.getenv("GROQ_API_KEY")
backend = os.getenv("BACKEND_URL")

class SenseiState(MessagesState):

    user_email: str
    leetcode_username:Optional[str]
    Stats:  Optional[dict]

# llm = HuggingFaceEndpoint(
#     repo_id="zai-org/GLM-5.2",
#     temperature=0
# )

sensei = ChatGroq(
    model="llama-3.3-70b-versatile", 
    temperature=0.0,
    api_key=groq_key
)

memory = MemorySaver()

sensei_tools = [get_stats,web_search]

sensi_with_tools = sensei.bind_tools(sensei_tools)

# NODES ------------------------------------------

async def Sensei_node(state: SenseiState):
    """
    This is the core brain of our AI. It reads the state and decides what to say or do.
    """

    messages = state.get("messages",[])
    email = state.get("user_email")

    system_prompt = SystemMessage(content=f"""
    LeeTrack is an interactive Web app create and maintained by paxton, where student can sharpen their coding and dsa skills   
    You are the LeeTrack AI Sensei, an expert Data Structures and Algorithms mentor.
    Your goal is to help users improve their competitive programming skills.
    Use emojis in your response.
                                  
    The user you are talking to has the email: {email}.

    you must use backend : {backend}.
    
    CRITICAL RULES:
    1. CONVERSATION: If the user just says "hello", "hi", or makes small talk, DO NOT use any tools. Just reply with a friendly greeting!
    2. STATS: Only use the get_stats tool if the user explicitly asks about their progress, rank, or stats. You MUST pass their exact email: {email}.
    3. SEARCH: Only use the web_search tool if they ask about a specific algorithm you need context on.
    4. Be direct, technical, and encouraging.
    """)   

    conversation = [system_prompt] + messages
    try:
        response = await sensi_with_tools.ainvoke(conversation)
        return {"messages": [response]}
    except Exception as e:
        print(f"⚠️ Groq API Hiccup Caught: {str(e)}")
        fallback_msg = AIMessage(content="Sensei is taking a quick breath... (I had a minor brain freeze, could you rephrase that?)")
        return {"messages": [fallback_msg]}

tool_node = ToolNode(sensei_tools)

# the graph ---------------------------------

workflow = StateGraph(SenseiState)

workflow.add_node("agent",Sensei_node)
workflow.add_node("tools",tool_node)

workflow.add_edge(START,"agent")

# conditional 
workflow.add_conditional_edges(
    "agent",
    tools_condition,
)

workflow.add_edge("tools","agent")

sensei_app = workflow.compile(checkpointer=memory)