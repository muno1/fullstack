from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import random

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

cache = {
    'domanda1': 'risposta uno',
    'domanda2': 'risposta due',
    'domanda3': 'risposta tre',
    'domanda4': 'risposta quattro'
}

cache_lock = asyncio.Lock()

@app.post("/generate")
async def generate_response(query: dict):
    question = query.get("query", "")
    
    if not question:
        return {"response": "Domanda non valida."}

    async with cache_lock:
        if question in cache:
            await asyncio.sleep(1)  
            return {"response": cache[question]}
        
        await asyncio.sleep(2)
        
        simulated_values = [
            f"Risposta casuale 1 per '{question}'",
            f"Risposta casuale 2 per '{question}'",
            f"Risposta casuale 3 per '{question}'",
            f"Risposta casuale 4 per '{question}'"
        ]
        
        simulated_response = random.choice(simulated_values)
        
        cache[question] = simulated_response
        
    return {"response": simulated_response}

@app.get("/documents")
async def get_documents():
    async with cache_lock:
        return {
            "documents": [{"question": key, "response": value} for key, value in cache.items()]
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
