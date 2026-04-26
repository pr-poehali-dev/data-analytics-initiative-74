import json
import os
import urllib.request
import urllib.error


def handler(event: dict, context) -> dict:
    """
    Запускает генерацию музыкального трека через Suno API на основе текста и стиля.
    Args: event с httpMethod, body (title, lyrics, genre, mood); context с request_id.
    Returns: HTTP-ответ с task_id для отслеживания статуса генерации.
    """
    method = event.get('httpMethod', 'POST')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }

    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        task_id = params.get('task_id')
        if not task_id:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'task_id is required'}),
            }
        api_key = os.environ.get('SUNO_API_KEY')
        if not api_key:
            return {
                'statusCode': 500,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'SUNO_API_KEY not configured'}),
            }
        url = f'https://apibox.erweima.ai/api/v1/generate/record-info?taskId={task_id}'
        req = urllib.request.Request(
            url,
            headers={'Authorization': f'Bearer {api_key}'},
            method='GET',
        )
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = json.loads(resp.read().decode('utf-8'))
        except urllib.error.HTTPError as e:
            err_body = e.read().decode('utf-8', errors='ignore')
            return {
                'statusCode': 502,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Suno error', 'details': err_body}),
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
            'body': json.dumps(data, ensure_ascii=False),
            'isBase64Encoded': False,
        }

    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
        }

    body = json.loads(event.get('body') or '{}')
    title = (body.get('title') or 'Untitled').strip()
    lyrics = (body.get('lyrics') or '').strip()
    genre = body.get('genre', 'pop')
    mood = body.get('mood', 'energetic')

    if not lyrics:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'lyrics is required'}),
        }

    api_key = os.environ.get('SUNO_API_KEY')
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'SUNO_API_KEY not configured'}),
        }

    style = f'{genre}, {mood}'

    payload = {
        'customMode': True,
        'instrumental': False,
        'prompt': lyrics[:2500],
        'style': style[:120],
        'title': title[:80],
        'model': 'V3_5',
    }

    req = urllib.request.Request(
        'https://apibox.erweima.ai/api/v1/generate',
        data=json.dumps(payload).encode('utf-8'),
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {api_key}',
        },
        method='POST',
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8', errors='ignore')
        return {
            'statusCode': 502,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Suno error', 'details': err_body}),
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
        'body': json.dumps(data, ensure_ascii=False),
        'isBase64Encoded': False,
    }