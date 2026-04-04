import requests

API_KEY = "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"

def explain_alert(alert):
    prompt = f"""
    You are an environmental AI assistant.

    Explain this methane alert:

    {alert}

    Give:
    1. Brief summary
    2. Detailed explanation
    """

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "mistralai/mixtral-8x7b",
            "messages": [
                {"role": "user", "content": prompt}
            ]
        }
    )

    return response.json()["choices"][0]["message"]["content"]