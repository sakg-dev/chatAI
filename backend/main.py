from flask import Flask, jsonify, request, Response
import requests
from flask_cors import CORS, cross_origin
from dotenv import load_dotenv
import os
import json

load_dotenv()

app = Flask(__name__)
cors = CORS(app)
app.config["CORE_HEADERS"] = 'Content-Type'


@app.route("/", methods=["GET"])
def home():
    return "<h1>Hello</h1>"


@app.route("/ai", methods=["POST"])
@cross_origin()
def ai_req():
    data = request.json
    prompt = f"Previous convos:{data['messages']}\n\nCurrent User Query:{data['userInput']}"
    response = requests.post(
        'https://ai.hackclub.com/proxy/v1/chat/completions',
        headers={
            'Authorization': f'Bearer {os.getenv("HACKCLUB_AI_API_KEY")}'
        },
        json={
            'model': 'google/gemini-3-flash-preview',
            'messages': [{'role': 'user', 'content': prompt}],
            'stream': True
        },
        stream=True
    )

    def generate():
        for chunk in response.iter_lines():
            chunk_val = chunk.decode("utf-8")
            if chunk and ": OPENROUTER PROCESSING" not in chunk_val and "data: [DONE]" not in chunk_val:
                # print(chunk_val, end="\n\n\n")
                yield chunk_val + "\n"

    return Response(generate(), content_type="text/plain")


if __name__ == "__main__":
    app.run(debug=True)
