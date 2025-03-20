from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
import random
import subprocess
import tempfile
import os
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Code execution models
class CodeRequest(BaseModel):
    code: str
    language: str

cache = {
    'domanda1': 'risposta uno',
    'domanda2': 'risposta due',
    'domanda3': 'risposta tre',
    'domanda4': 'risposta quattro'
}

cache_lock = asyncio.Lock()

# New code execution endpoint
@app.post("/run-code")
async def run_code(request: CodeRequest):
    logger.info(f"Received code execution request for language: {request.language}")
    logger.info(f"Code to execute: {request.code}")
    
    if request.language not in ["python", "javascript"]:
        raise HTTPException(status_code=400, detail="Unsupported language")
    
    with tempfile.NamedTemporaryFile(
        suffix=".py" if request.language == "python" else ".js",
        mode="w",
        delete=False
    ) as f:
        f.write(request.code)
        temp_file = f.name
        logger.info(f"Created temporary file: {temp_file}")

    try:
        if request.language == "python":
            logger.info("Executing Python code...")
            process = subprocess.run(
                ["python", temp_file],
                capture_output=True,
                text=True,
                timeout=5
            )
        else:  # javascript
            logger.info("Executing JavaScript code...")
            process = subprocess.run(
                ["node", temp_file],
                capture_output=True,
                text=True,
                timeout=5
            )

        output = process.stdout
        error = process.stderr

        logger.info(f"Process stdout: {output}")
        logger.info(f"Process stderr: {error}")

        if error:
            return {"error": error}
        return {"output": output or "No output generated"}

    except subprocess.TimeoutExpired:
        logger.error("Code execution timed out")
        return {"error": "Code execution timed out"}
    except Exception as e:
        logger.error(f"Error executing code: {str(e)}")
        return {"error": str(e)}
    finally:
        try:
            os.unlink(temp_file)
            logger.info("Cleaned up temporary file")
        except Exception as e:
            logger.error(f"Error cleaning up temporary file: {str(e)}")

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
