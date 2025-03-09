# Fullstack Test🍕

This repository is designed to test my technical skills for a fullstack developer position at Datapizza.
The frontend was designed using React (Next.js, TailwindCSS) and Python (FastAPI, Uvicorn) for the backend.

## Project Overview 🌐

This project allows users to interact with a chatbot providing specific questions and receiving question related responses. The responses are simulated on the backend, retrieved and visualized by toggling a button within the UI.
The fact-checking mechanism allows for document verification of the mocked data directly from the UI.

## Features ✨

- **Chatbot Interface**: Users can ask questions and receive simulated AI-generated responses.
- **Fact-Checking**: A button allows users to fetch reference documents to validate chatbot responses.
- **Caching Mechanism**: A simulated Python dictionary cache ensures efficiency by storing previous responses.
- **Asynchronous Processing**: Ensures concurrent access to the cache with simulated delays for realistic API behavior.
- **Dockerized Deployment**: The entire application runs in containers for easy setup and testing.

## Installation ⚙️

1. **Clone this repo** into your local machine and cd into it.

```bash
  git clone https://github.com/muno1/fullstack.git
  cd fullstack
```

2.  Run `docker-compose up` from root directory.

3.  Visit http://localhost:3000 to access the application

4.  Start typing questions!

## Requirements

- [Docker](https://www.docker.com/) 🐳
- [Docker Compose](https://docs.docker.com/compose/) 🐳
