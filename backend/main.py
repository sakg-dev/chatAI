from flask import Flask, jsonify, request
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
    response = requests.post(
        'https://ai.hackclub.com/proxy/v1/chat/completions',
        headers={
            'Authorization': f'Bearer {os.getenv("HACKCLUB_AI_API_KEY")}'
        },
        json={
            'model': 'openai/gpt-4o',
            'messages': [{'role': 'user', 'content': data["message"]}],
            'stream': False
        },
        stream=False
    )
    output = response.json()["choices"][0]["message"]["content"]

    # if response.status_code != 200:
    #     error_data = response.json()
    #     print(f"Error: {error_data['error']['message']}")
    #     return jsonify({"success": False})

    # for line in response.iter_lines():
    #     if line:
    #         line_text = line.decode('utf-8')
    #         if line_text.startswith('data: '):
    #             data = line_text[6:]
    #             if data == '[DONE]':
    #                 break
    #             try:
    #                 parsed = json.loads(data)
    #                 if 'error' in parsed:
    #                     print(f"Stream error: {parsed['error']['message']}")
    #                     if parsed.get('choices', [{}])[0].get('finish_reason') == 'error':
    #                         print("Stream terminated due to error")
    #                     break
    #                 content = parsed['choices'][0]['delta'].get('content')
    #                 if content:
    #                     print(content, end='', flush=True)
    #             except json.JSONDecodeError:
    #                 pass

    return jsonify({"success": True, "output": output})


if __name__ == "__main__":
    app.run(debug=True)
