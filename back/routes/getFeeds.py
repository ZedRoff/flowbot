
import feedparser
from flask import Blueprint, request, jsonify
import sqlite3

con = sqlite3.connect("./db/database.db", check_same_thread=False)
bp = Blueprint('get_feeds', __name__)

@bp.route('/api/getFeeds', methods=['GET'])
def get_feeds():
    try:
        if request.method == 'GET':
            cur = con.cursor()
            cur.execute("SELECT * FROM feeds")
            links = cur.fetchall()
            news = []
            for link in links:
                feed = feedparser.parse(link[1])
                for post in feed.entries[:3]:
                    news.append({'title': post.title, 'link': post.link, 'published': post.published})
            cur.close()
            response = jsonify({'result': news})
            return response
    except Exception as e:
        return jsonify({'error': str(e)})