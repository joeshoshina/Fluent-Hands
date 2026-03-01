# Fluent Hands

An ASL gesture recognition learning platform built with React, Vite, and MediaPipe.

## Prerequisites

- Node.js & npm
- Python 3.8+
- pip (Python package manager)

## Setup & Running Locally

### Backend Setup

1. Backend at root level since we didnt make a folder

```bash
you should see model.py
```

2. Create a Python virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install Python dependencies:

```bash
pip install -r requirements.txt
```

4. Run the Flask backend (runs on `localhost:5050`):

```bash
python model.py
```

### Frontend Setup

1. From the project root, install npm dependencies:

```bash
npm install
```

2. Build the frontend:

```bash
npm run build
```

3. Start the dev server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` (or the URL shown in your terminal).

## Architecture

- **Frontend**: React + Vite + Tailwind CSS + MediaPipe
- **Backend**: Flask + TensorFlow (ASL letter classification)
- **Game Modes**: Practice, Blitz, Words

## Development Notes

- Frontend components are in `src/components/`
- Game logic syncs with the gesture detection backend
- Progress is persisted in localStorage
- Camera must be enabled for gesture recognition features
