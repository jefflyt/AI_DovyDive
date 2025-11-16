from fastapi import FastAPI

app = FastAPI(title="DovyDive API")

@app.get("/health")
async def health():
    return {"status": "ok"}
