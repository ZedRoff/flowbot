import feedparser
from flask import Blueprint, request, jsonify
import sqlite3

bp = Blueprint('get_feeds', __name__)

def get_db_connection():
    con = sqlite3.connect("./db/database.db", check_same_thread=False)
    con.row_factory = sqlite3.Row  # This will allow us to fetch rows as dictionaries
    return con

def is_rss_feed(feed):
    return 'title' in feed.feed and len(feed.entries) > 0

@bp.route('/api/getFeeds', methods=['GET'])
def get_feeds():
    try:
        if request.method == 'GET':
            news = []
            with get_db_connection() as con:
                cur = con.cursor()
                cur.execute("SELECT * FROM feeds")
                links = cur.fetchall()
                
                for link in links:
                    feed = feedparser.parse(link['url'])
                    
                    if is_rss_feed(feed):
                        journal = feed.feed.title if 'title' in feed.feed else 'Source inconnue'
                        for post in feed.entries[:3]:
                            headline = post.title if 'title' in post else 'Titre inconnu'
                            news.append({'journal': journal, 'headline': headline, 'is_rss': True})
                    else:
                        news.append({'journal': 'Inconnu', 'headline': 'Feed invalide', 'is_rss': False})
                
                cur.close()
            response = jsonify({'result': news})
            return response
    except Exception as e:
        return jsonify({'error': str(e)})

