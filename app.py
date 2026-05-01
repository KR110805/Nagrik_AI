"""Election Guide Assistant backend service."""

import os

from flask import Flask, jsonify, render_template, request, send_from_directory

try:
    from google import genai
except ImportError:  # pragma: no cover - depends on environment
    genai = None

app = Flask(__name__)

SUPPORTED_LANGUAGES = {"en": "English", "hi": "Hindi", "mr": "Marathi", "ta": "Tamil"}
MAX_MESSAGE_LENGTH = 300


# ── Routes ─────────────────────────────────────────────────────────
@app.route("/")
def index():
    """Serve the main single-page application."""
    return render_template("index.html")


# Serve static images with proper caching
@app.route("/static/images/<path:filename>")
def serve_image(filename):
    """Serve images from the static/images directory with caching headers."""
    return send_from_directory("static/images", filename)


# Chatbot API Endpoint
@app.route("/chat", methods=["POST"])
def chat():
    """Handle chat requests with validation and safe errors."""
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid request"}), 400

    message = data.get("message")
    language = data.get("language", "en")
    if not isinstance(message, str) or not message.strip():
        return jsonify({"error": "Message is required"}), 400

    user_message = message.strip()
    if len(user_message) > MAX_MESSAGE_LENGTH:
        return jsonify({"error": f"Message must be {MAX_MESSAGE_LENGTH} characters or fewer"}), 400

    selected_language = language if language in SUPPORTED_LANGUAGES else "en"
    language_name = SUPPORTED_LANGUAGES[selected_language]

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return jsonify({"error": "API key not configured"}), 500

    if genai is None:
        return jsonify({"error": "Service unavailable"}), 503

    # ── Smart context enrichment ──────────────────────────────────
    # Detect date/timeline queries to add helpful context hints
    date_keywords = ["kab", "when", "date", "schedule", "कब", "तारीख", "केव्हा", "எப்போது"]
    is_date_query = any(kw in user_message.lower() for kw in date_keywords)

    date_context = ""
    if is_date_query:
        date_context = """
IMPORTANT CONTEXT FOR DATE/TIMELINE QUESTIONS:
- Election dates in India are announced by the Election Commission of India (ECI).
- Lok Sabha elections happen every 5 years. State elections also follow a 5-year cycle.
- Provide the general timeline and explain how to find official dates.
- Mention checking https://eci.gov.in or official news sources for exact dates.
"""

    prompt = f"""
You are Nagrik AI, an expert assistant for Indian elections.

You have strong knowledge of:
- Indian election process (Lok Sabha, Rajya Sabha, State Assemblies, Local body elections)
- Voter registration process in India (Form 6, NVSP portal, BLO visits)
- Election Commission of India (ECI) rules and guidelines
- EVM and VVPAT voting system
- State-specific elections (Maharashtra, Tamil Nadu, UP, Kerala, etc.)
- Model Code of Conduct
- NOTA option and its significance
- Voter ID (EPIC) and its importance

STRICT RULES:
1. Always assume questions are about India unless the user explicitly mentions another country.
2. NEVER say "I don't know" or "I don't have information".
3. If exact data (like a specific date) is unknown, give a general explanation and guide the user on how to find official information.
4. Answer ONLY in the selected language: {language_name}
5. Keep answers simple, clear, and confident.
6. Start with a short explanation, then use bullet points if needed.
7. Keep responses concise but helpful — no filler text.
{date_context}
User question:
{user_message}
"""

    try:
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        reply = response.text if response.text else "Sorry, I couldn't generate a response."
        return jsonify({"response": reply.strip()})
    except Exception:
        return jsonify({"error": "Something went wrong, please try again"}), 500


# ── Run the Server ─────────────────────────────────────────────────
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5050)
