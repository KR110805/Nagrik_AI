"""Nagrik AI — Backend Test Suite.

Validates all major API behaviors including validation, language handling,
API key checks, and safe fallback responses.
"""

import unittest
from unittest.mock import Mock, patch

from app import app


class TestAPIKeyHandling(unittest.TestCase):
    """Tests for API key presence and absence."""

    def setUp(self):
        self.client = app.test_client()
        app.testing = True

    def test_returns_error_when_api_key_missing(self):
        """Server returns 500 with clear message when GEMINI_API_KEY is unset."""
        with patch.dict("os.environ", {}, clear=True):
            response = self.client.post("/chat", json={"message": "How to vote?", "language": "en"})
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.get_json()["error"], "API key not configured")

    def test_api_key_present_reaches_model(self):
        """When API key exists, request proceeds past the key check."""
        fake_response = Mock()
        fake_response.text = "Test response"
        fake_models = Mock()
        fake_models.generate_content.return_value = fake_response
        fake_client = Mock(models=fake_models)

        with patch.dict("os.environ", {"GEMINI_API_KEY": "test-key"}, clear=True):
            with patch("app.genai.Client", return_value=fake_client):
                response = self.client.post("/chat", json={"message": "Hello", "language": "en"})

        self.assertEqual(response.status_code, 200)
        self.assertIn("response", response.get_json())


class TestMissingMessageRequest(unittest.TestCase):
    """Tests for missing or empty message payloads."""

    def setUp(self):
        self.client = app.test_client()
        app.testing = True

    def test_rejects_missing_message_field(self):
        """Request without 'message' key returns 400."""
        response = self.client.post("/chat", json={"language": "en"})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json()["error"], "Message is required")

    def test_rejects_empty_string_message(self):
        """Request with empty string message returns 400."""
        response = self.client.post("/chat", json={"message": "", "language": "en"})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json()["error"], "Message is required")

    def test_rejects_whitespace_only_message(self):
        """Request with whitespace-only message returns 400."""
        response = self.client.post("/chat", json={"message": "   ", "language": "en"})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json()["error"], "Message is required")

    def test_rejects_non_string_message(self):
        """Request with non-string message (e.g., number) returns 400."""
        response = self.client.post("/chat", json={"message": 12345, "language": "en"})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json()["error"], "Message is required")

    def test_rejects_invalid_json_body(self):
        """Request with non-dict JSON body returns 400."""
        response = self.client.post(
            "/chat",
            data="not json",
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 400)


class TestMessageLengthValidation(unittest.TestCase):
    """Tests for the 300-character message length limit."""

    def setUp(self):
        self.client = app.test_client()
        app.testing = True

    def test_rejects_message_over_300_chars(self):
        """Message with 301 characters is rejected with 400."""
        response = self.client.post("/chat", json={"message": "a" * 301, "language": "en"})
        self.assertEqual(response.status_code, 400)
        data = response.get_json()
        self.assertIn("300", data["error"])

    def test_accepts_message_at_300_chars(self):
        """Message with exactly 300 characters is accepted."""
        fake_response = Mock()
        fake_response.text = "OK"
        fake_models = Mock()
        fake_models.generate_content.return_value = fake_response
        fake_client = Mock(models=fake_models)

        with patch.dict("os.environ", {"GEMINI_API_KEY": "test-key"}, clear=True):
            with patch("app.genai.Client", return_value=fake_client):
                response = self.client.post("/chat", json={"message": "a" * 300, "language": "en"})

        self.assertEqual(response.status_code, 200)

    def test_accepts_short_message(self):
        """Short message is accepted without issue."""
        fake_response = Mock()
        fake_response.text = "Short reply"
        fake_models = Mock()
        fake_models.generate_content.return_value = fake_response
        fake_client = Mock(models=fake_models)

        with patch.dict("os.environ", {"GEMINI_API_KEY": "test-key"}, clear=True):
            with patch("app.genai.Client", return_value=fake_client):
                response = self.client.post("/chat", json={"message": "Hi", "language": "en"})

        self.assertEqual(response.status_code, 200)


class TestValidChatRequest(unittest.TestCase):
    """Tests that a well-formed request returns a proper AI response."""

    def setUp(self):
        self.client = app.test_client()
        app.testing = True

    def _make_successful_request(self, message="How to register?", language="en", reply_text="  Sample response  "):
        """Helper: send a valid chat request with a mocked Gemini backend."""
        fake_response = Mock()
        fake_response.text = reply_text
        fake_models = Mock()
        fake_models.generate_content.return_value = fake_response
        fake_client = Mock(models=fake_models)

        with patch.dict("os.environ", {"GEMINI_API_KEY": "test-key"}, clear=True):
            with patch("app.genai.Client", return_value=fake_client):
                return self.client.post("/chat", json={"message": message, "language": language})

    def test_returns_200_with_response(self):
        """Valid request returns 200 and a 'response' field."""
        response = self._make_successful_request()
        self.assertEqual(response.status_code, 200)
        self.assertIn("response", response.get_json())

    def test_response_is_stripped(self):
        """Leading/trailing whitespace is trimmed from the response."""
        response = self._make_successful_request(reply_text="  Trimmed  ")
        self.assertEqual(response.get_json()["response"], "Trimmed")

    def test_response_content_type_is_json(self):
        """Response Content-Type is application/json."""
        response = self._make_successful_request()
        self.assertIn("application/json", response.content_type)


class TestLanguageHandling(unittest.TestCase):
    """Tests for all supported languages (en, hi, mr, ta) and fallback."""

    def setUp(self):
        self.client = app.test_client()
        app.testing = True

    def _send_chat(self, language):
        """Helper: send a chat request with a given language code."""
        fake_response = Mock()
        fake_response.text = f"Reply in {language}"
        fake_models = Mock()
        fake_models.generate_content.return_value = fake_response
        fake_client = Mock(models=fake_models)

        with patch.dict("os.environ", {"GEMINI_API_KEY": "test-key"}, clear=True):
            with patch("app.genai.Client", return_value=fake_client) as mock_client_cls:
                response = self.client.post("/chat", json={"message": "Test", "language": language})
                # Capture the prompt that was sent to the model
                call_args = fake_models.generate_content.call_args
                prompt = call_args.kwargs.get("contents", call_args[1].get("contents", "")) if call_args.kwargs else call_args[1].get("contents", "")
                return response, prompt

    def test_english_language(self):
        """English language code is accepted and passed to prompt."""
        response, prompt = self._send_chat("en")
        self.assertEqual(response.status_code, 200)
        self.assertIn("English", prompt)

    def test_hindi_language(self):
        """Hindi language code is accepted and passed to prompt."""
        response, prompt = self._send_chat("hi")
        self.assertEqual(response.status_code, 200)
        self.assertIn("Hindi", prompt)

    def test_marathi_language(self):
        """Marathi language code is accepted and passed to prompt."""
        response, prompt = self._send_chat("mr")
        self.assertEqual(response.status_code, 200)
        self.assertIn("Marathi", prompt)

    def test_tamil_language(self):
        """Tamil language code is accepted and passed to prompt."""
        response, prompt = self._send_chat("ta")
        self.assertEqual(response.status_code, 200)
        self.assertIn("Tamil", prompt)

    def test_unsupported_language_falls_back_to_english(self):
        """Unsupported language code defaults to English."""
        response, prompt = self._send_chat("xx")
        self.assertEqual(response.status_code, 200)
        self.assertIn("English", prompt)

    def test_missing_language_defaults_to_english(self):
        """Omitting language entirely defaults to English."""
        fake_response = Mock()
        fake_response.text = "Default lang reply"
        fake_models = Mock()
        fake_models.generate_content.return_value = fake_response
        fake_client = Mock(models=fake_models)

        with patch.dict("os.environ", {"GEMINI_API_KEY": "test-key"}, clear=True):
            with patch("app.genai.Client", return_value=fake_client):
                response = self.client.post("/chat", json={"message": "Hello"})

        self.assertEqual(response.status_code, 200)


class TestSafeFallbackResponse(unittest.TestCase):
    """Tests that errors produce user-friendly fallback messages."""

    def setUp(self):
        self.client = app.test_client()
        app.testing = True

    def test_api_exception_returns_safe_message(self):
        """When Gemini raises an exception, a safe error message is returned."""
        fake_models = Mock()
        fake_models.generate_content.side_effect = Exception("API failure")
        fake_client = Mock(models=fake_models)

        with patch.dict("os.environ", {"GEMINI_API_KEY": "test-key"}, clear=True):
            with patch("app.genai.Client", return_value=fake_client):
                response = self.client.post("/chat", json={"message": "Test question", "language": "en"})

        self.assertEqual(response.status_code, 500)
        data = response.get_json()
        self.assertEqual(data["error"], "Something went wrong, please try again")

    def test_empty_model_response_returns_fallback(self):
        """When the model returns empty text, a fallback message appears."""
        fake_response = Mock()
        fake_response.text = ""
        fake_models = Mock()
        fake_models.generate_content.return_value = fake_response
        fake_client = Mock(models=fake_models)

        with patch.dict("os.environ", {"GEMINI_API_KEY": "test-key"}, clear=True):
            with patch("app.genai.Client", return_value=fake_client):
                response = self.client.post("/chat", json={"message": "Hello", "language": "en"})

        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["response"], "Sorry, I couldn't generate a response.")

    def test_none_model_response_returns_fallback(self):
        """When the model returns None text, a fallback message appears."""
        fake_response = Mock()
        fake_response.text = None
        fake_models = Mock()
        fake_models.generate_content.return_value = fake_response
        fake_client = Mock(models=fake_models)

        with patch.dict("os.environ", {"GEMINI_API_KEY": "test-key"}, clear=True):
            with patch("app.genai.Client", return_value=fake_client):
                response = self.client.post("/chat", json={"message": "Hello", "language": "en"})

        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["response"], "Sorry, I couldn't generate a response.")

    def test_genai_unavailable_returns_503(self):
        """When genai module is None (not installed), returns 503."""
        with patch.dict("os.environ", {"GEMINI_API_KEY": "test-key"}, clear=True):
            with patch("app.genai", None):
                response = self.client.post("/chat", json={"message": "Hello", "language": "en"})

        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.get_json()["error"], "Service unavailable")


class TestIndexRoute(unittest.TestCase):
    """Tests for the main page route."""

    def setUp(self):
        self.client = app.test_client()
        app.testing = True

    def test_index_returns_200(self):
        """Root URL serves the main page."""
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)

    def test_index_returns_html(self):
        """Root URL returns HTML content."""
        response = self.client.get("/")
        self.assertIn("text/html", response.content_type)


if __name__ == "__main__":
    unittest.main()
