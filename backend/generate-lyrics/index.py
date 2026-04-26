import json
import os
import urllib.request
import urllib.error


def handler(event: dict, context) -> dict:
    """
    Генерирует текст песни на основе темы, жанра и настроения через OpenAI.
    Args: event с httpMethod, body (theme, genre, mood); context с request_id.
    Returns: HTTP-ответ с готовым текстом песни.
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
    theme = body.get('theme', '').strip()
    genre = body.get('genre', 'pop')
    mood = body.get('mood', 'energetic')

    if not theme:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'theme is required'}),
        }

    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'OPENAI_API_KEY not configured'}),
        }

    prompt = (
        f"Напиши текст песни на русском языке.\n"
        f"Тема: {theme}\n"
        f"Жанр: {genre}\n"
        f"Настроение: {mood}\n\n"
        f"Структура: [Куплет 1], [Припев], [Куплет 2], [Припев], [Бридж], [Припев].\n"
        f"Используй рифмы, ритм и образы. Текст должен быть цельным и эмоциональным."
    )

    payload = {
        'model': 'gpt-4o-mini',
        'messages': [
            {'role': 'system', 'content': 'Ты профессиональный автор песен с опытом написания хитов.'},
            {'role': 'user', 'content': prompt},
        ],
        'temperature': 0.9,
        'max_tokens': 800,
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
            lyrics = data['choices'][0]['message']['content'].strip()
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
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
        'body': json.dumps({'lyrics': lyrics, 'theme': theme, 'genre': genre, 'mood': mood}, ensure_ascii=False),
        'isBase64Encoded': False,
    }