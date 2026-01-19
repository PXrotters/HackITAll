import http.server
import socketserver
import json
import random
import time

PORT = 18000

class ClippyHandler(http.server.BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data.decode('utf-8'))
        except json.JSONDecodeError:
            self.send_error(400, "Invalid JSON")
            return

        response = {}
        
        if self.path == '/clippy/message':
            response = self.handle_message(data)
        elif self.path == '/clippy/whatif':
            response = self.handle_whatif(data)
        elif self.path == '/score':
             response = {"score": 100} # Mock implementation
        else:
            self.send_error(404, "Not Found")
            return

        self._set_headers()
        self.wfile.write(json.dumps(response).encode('utf-8'))

    def handle_message(self, data):
        meta = data.get('meta', {})
        message = data.get('message', '')
        
        if meta.get('first_greeting'):
            greeting = "Hi! I'm Clippy, your personal banking assistant. How can I help you today?"
            return {
                "reply": greeting,
                "suggested_replies": ["How do I save money?", "Show me my spending", "What is a mortgage?"],
                "actions": []
            }
        
        replies = [
            "That's an interesting question! Let me look into that.",
            "I see you're interested in your finances. Good job!",
            "According to my calculations, that is correct.",
            "I'm here to help you navigate the complex world of banking.",
            "Would you like to open a savings account?"
        ]
        
        reply = random.choice(replies)
        
        if "bitcoin" in message.lower():
            reply = "Cryptocurrency is volatile. Always invest assuming you could lose everything!"
        elif "save" in message.lower():
            reply = "Saving is key! Try setting aside 20% of your income."

        return {
            "reply": f"{reply} (You said: {message})",
            "suggested_replies": ["Tell me more", "Thanks", "Bye"],
            "actions": []
        }

    def handle_whatif(self, data):
        question = data.get('question', '')
        return {
            "reply": f"Projected outcome for '{question}': \n\nBased on current trends, this scenario has a 15% probability of high returns and 85% probability of moderate risk. \n\nCalculated impact on balance: -5% short term, +12% long term."
        }

with socketserver.TCPServer(("", PORT), ClippyHandler) as httpd:
    print(f"Clippy Server running on port {PORT}")
    httpd.serve_forever()
