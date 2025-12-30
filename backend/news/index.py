import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    """API для получения новостей с рейтингом достоверности"""
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            query_params = event.get('queryStringParameters') or {}
            category = query_params.get('category')
            is_premium = query_params.get('is_premium', 'false').lower() == 'true'
            
            if category:
                cur.execute(
                    "SELECT id, title, content, category, image_url, credibility_rating, credibility_status, source, is_premium, views_count, published_at FROM news WHERE category = %s AND is_premium = %s ORDER BY published_at DESC",
                    (category, is_premium)
                )
            else:
                cur.execute(
                    "SELECT id, title, content, category, image_url, credibility_rating, credibility_status, source, is_premium, views_count, published_at FROM news WHERE is_premium = %s ORDER BY published_at DESC",
                    (is_premium,)
                )
            
            news_list = []
            for row in cur.fetchall():
                news_list.append({
                    'id': row[0],
                    'title': row[1],
                    'content': row[2],
                    'category': row[3],
                    'image_url': row[4],
                    'credibility_rating': row[5],
                    'credibility_status': row[6],
                    'source': row[7],
                    'is_premium': row[8],
                    'views_count': row[9],
                    'published_at': row[10].isoformat() if row[10] else None
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'news': news_list}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Метод не поддерживается'}),
            'isBase64Encoded': False
        }
    
    finally:
        cur.close()
        conn.close()