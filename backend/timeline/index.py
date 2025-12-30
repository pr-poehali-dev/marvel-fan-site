import json
import os
import psycopg2
from datetime import date

def handler(event: dict, context) -> dict:
    """API для интерактивной хронологии Marvel с фильмами, персонажами и пасхалками"""
    
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
            phase_id = query_params.get('phase_id')
            character_id = query_params.get('character_id')
            movie_id = query_params.get('movie_id')
            
            if movie_id:
                cur.execute("""
                    SELECT m.id, m.title, m.description, m.release_date, m.chronological_order,
                           m.phase_id, m.content_type, m.image_url, m.duration_minutes, m.director,
                           m.box_office, m.rating, m.universe,
                           p.name as phase_name
                    FROM movies m
                    LEFT JOIN phases p ON m.phase_id = p.id
                    WHERE m.id = %s
                """, (movie_id,))
                
                row = cur.fetchone()
                if not row:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Фильм не найден'}),
                        'isBase64Encoded': False
                    }
                
                movie = {
                    'id': row[0],
                    'title': row[1],
                    'description': row[2],
                    'release_date': row[3].isoformat() if row[3] else None,
                    'chronological_order': row[4],
                    'phase_id': row[5],
                    'content_type': row[6],
                    'image_url': row[7],
                    'duration_minutes': row[8],
                    'director': row[9],
                    'box_office': row[10],
                    'rating': float(row[11]) if row[11] else None,
                    'universe': row[12],
                    'phase_name': row[13]
                }
                
                cur.execute("""
                    SELECT c.id, c.name, c.real_name, c.actor, mc.role
                    FROM characters c
                    JOIN movie_characters mc ON c.id = mc.character_id
                    WHERE mc.movie_id = %s
                    ORDER BY 
                        CASE mc.role 
                            WHEN 'main' THEN 1 
                            WHEN 'supporting' THEN 2 
                            ELSE 3 
                        END
                """, (movie_id,))
                
                characters = []
                for char_row in cur.fetchall():
                    characters.append({
                        'id': char_row[0],
                        'name': char_row[1],
                        'real_name': char_row[2],
                        'actor': char_row[3],
                        'role': char_row[4]
                    })
                
                cur.execute("""
                    SELECT id, title, description, timestamp_minutes
                    FROM easter_eggs
                    WHERE movie_id = %s
                    ORDER BY timestamp_minutes
                """, (movie_id,))
                
                easter_eggs = []
                for egg_row in cur.fetchall():
                    easter_eggs.append({
                        'id': egg_row[0],
                        'title': egg_row[1],
                        'description': egg_row[2],
                        'timestamp_minutes': egg_row[3]
                    })
                
                movie['characters'] = characters
                movie['easter_eggs'] = easter_eggs
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'movie': movie}),
                    'isBase64Encoded': False
                }
            
            query = """
                SELECT m.id, m.title, m.description, m.release_date, m.chronological_order,
                       m.phase_id, m.content_type, m.image_url, m.duration_minutes, m.director,
                       m.box_office, m.rating, m.universe,
                       p.name as phase_name, p.description as phase_description
                FROM movies m
                LEFT JOIN phases p ON m.phase_id = p.id
                WHERE 1=1
            """
            params = []
            
            if phase_id:
                query += " AND m.phase_id = %s"
                params.append(phase_id)
            
            if character_id:
                query += """ AND m.id IN (
                    SELECT movie_id FROM movie_characters WHERE character_id = %s
                )"""
                params.append(character_id)
            
            query += " ORDER BY m.chronological_order, m.release_date"
            
            cur.execute(query, tuple(params))
            
            movies = []
            for row in cur.fetchall():
                movies.append({
                    'id': row[0],
                    'title': row[1],
                    'description': row[2],
                    'release_date': row[3].isoformat() if row[3] else None,
                    'chronological_order': row[4],
                    'phase_id': row[5],
                    'content_type': row[6],
                    'image_url': row[7],
                    'duration_minutes': row[8],
                    'director': row[9],
                    'box_office': row[10],
                    'rating': float(row[11]) if row[11] else None,
                    'universe': row[12],
                    'phase_name': row[13],
                    'phase_description': row[14]
                })
            
            cur.execute("SELECT id, name, description, start_year, end_year FROM phases ORDER BY id")
            phases = []
            for phase_row in cur.fetchall():
                phases.append({
                    'id': phase_row[0],
                    'name': phase_row[1],
                    'description': phase_row[2],
                    'start_year': phase_row[3],
                    'end_year': phase_row[4]
                })
            
            cur.execute("SELECT id, name, real_name, actor, image_url FROM characters ORDER BY name")
            characters = []
            for char_row in cur.fetchall():
                characters.append({
                    'id': char_row[0],
                    'name': char_row[1],
                    'real_name': char_row[2],
                    'actor': char_row[3],
                    'image_url': char_row[4]
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'movies': movies,
                    'phases': phases,
                    'characters': characters
                }),
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
