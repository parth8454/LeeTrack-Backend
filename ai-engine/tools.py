from langchain.tools import tool
import requests
from langchain_community.tools import DuckDuckGoSearchResults
from dotenv import load_dotenv,dotenv_values


@tool
def get_stats(email: str,backend: str) -> dict:
    """
    Fetches the current LeetCode statistics and progress for a given user.
    Use this tool BEFORE giving advice to understand the user's current skill level, 
    their problem-solving breakdown (Easy/Medium/Hard), and their recent activity.
    """

    api = f"{backend}/api/information/{email}"
    print(f"DEBUG: Fetching stats for {email} at {api}")
    try:
        response = requests.get(api)
        response.raise_for_status() # Throws an error if status is not 200 OK
        data = response.json()
        
        # We return the data so the LLM can read it and formulate an answer
        return data
    
    except requests.exceptions.RequestException as e:
        return {"error": f"Failed to fetch data from LeeTrack backend: {str(e)}"}
    

@tool
def web_search(query: str) -> str:
    """
    Searches the internet for Data Structures and Algorithms (DSA) concepts, 
    best practices, or current LeetCode trends. Use this tool when the user asks 
    about a specific algorithm or needs a study roadmap that you are unsure about.
    its always good to web_search while giving some advice.
    """

    search = DuckDuckGoSearchResults(max_results = 3)

    try:
        results = search.run(query)
        return results
    except Exception as e:
        return f"Search Failed: {str(e)}"
    
tools = [web_search,get_stats]