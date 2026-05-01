# Nagrik AI

Nagrik AI is a multilingual election guide assistant that helps users understand voting, registration, election flow, and readiness through a conversational UI and interactive learning sections.

## Features

- AI-powered election Q&A with language selection (English, Hindi, Marathi, Tamil)
- Guided election flow, timeline chart, FAQ, and step-by-step voting guide
- Ready-to-vote checker and mini quiz
- Accessibility improvements with labels, ARIA attributes, and alt text
- Safe backend validation and secure environment-based Gemini API usage

## Tech Stack

- Backend: Python, Flask
- AI SDK: `google-genai` (`gemini-2.5-flash`)
- Frontend: HTML, CSS, JavaScript
- Visualization: Chart.js

## Setup Instructions

1. Clone or download the project.
2. Create and activate a Python virtual environment.
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set your Gemini API key:
   ```bash
   export GEMINI_API_KEY="your_api_key_here"
   ```
5. Run the app:
   ```bash
   python app.py
   ```
6. Open `http://localhost:5050` in your browser.

## Deployment Link

deployed URL here: `https://nagrik-ai-462639331983.asia-south1.run.app/`
