from fastapi import FastAPI
from app.api.endpoints.poetry import router as poetry_router

app = FastAPI()
app.include_router(poetry_router, prefix="/api/v1/poetry")

if __name__ == "__main__":
    import os
    import logging
    from typing import Tuple
    from starlette.applications import Starlette
    from starlette.responses import Response
    from starlette.routing import Route
    from starlette.staticfiles import StaticFiles

    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)

    def get_app_and_port() -> Tuple[Starlette, int]:
        port = int(os.getenv("PORT", "8000"))
        return app, port

    async def lifecheck(request):
        return Response("OK", media_type="text/plain")

    routes = [
        Route("/", app.router),
        Route("/healthz", lifecheck),
    ]

    app_and_port = get_app_and_port()
    app = app_and_port[0]
    port = app_and_port[1]

    logger.info(f"Starting FastAPI server on port {port}")
    app.mount("/static", StaticFiles(directory="static"), name="static")
    app.run(host="0.0.0.0", port=port)