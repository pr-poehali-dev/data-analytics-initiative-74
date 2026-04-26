import json
import os
import urllib.request
import urllib.error


def handler(event: dict, context) -> dict:
    """
    Генерирует сценарий клипа (раскадровку) под трек через OpenAI.
    Args: event с httpMethod, body (title, mood, idea); context с request_id.
    Returns: HTTP-ответ со сценарием клипа из 6 сцен.
    """
    method = event.get('httpMethod', 'POST')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }

    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
        }

    body = json.loads(event.get('body') or '{}')
    title = (body.get('title') or '').strip()
    mood = body.get('mood', 'energetic')
    idea = (body.get('idea') or '').strip()

    if not title:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'title is required'}),
        }

    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'OPENAI_API_KEY not configured'}),
        }

    prompt = (
        f"Создай раскадровку музыкального клипа.\n"
        f"Название трека: {title}\n"
        f"Стиль визуала: {mood}\n"
        f"Идея: {idea or 'на твой выбор'}\n\n"
        f"Дай ответ в JSON-формате со структурой: "
        f"{{\"scenes\": [{{\"time\": \"0:00-0:15\", \"description\": \"...\", \"visual\": \"...\"}}]}}. "
        f"Сделай 6 сцен. Никакого текста вне JSON."
    )

    payload = {
        'model': 'gpt-4o-mini',
        'messages': [
            {'role': 'system', 'content': 'Ты режиссёр музыкальных клипов. Отвечай только валидным JSON.'},
            {'role': 'user', 'content': prompt},
        ],
        'temperature': 0.85,
        'max_tokens': 900,
        'response_format': {'type': 'json_object'},
    }

    req = urllib.request.Request(
        'https://api.openai.com/v1/chat/completions',
        data=json.dumps(payload).encode('utf-8'),
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {api_key}',
        },
        method='POST',
    )

    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            content = data['choices'][0]['message']['content']
            scenario = json.loads(content)
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8', errors='ignore')
        return {
            'statusCode': 502,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'OpenAI error', 'details': err_body}),
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
        }

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps({'title': title, 'scenario': scenario}, ensure_ascii=False),
        'isBase64Encoded': False,
    }