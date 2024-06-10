#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import feedparser



from flask import Blueprint, request, jsonify
import sqlite3
from flask_socketio import SocketIO, emit
con = sqlite3.connect("./db/database.db", check_same_thread=False)
bp = Blueprint('add_feeds', __name__)

@bp.route('/api/addFeed', methods=['POST'])
def add_feeds():
    if request.method == 'POST':
        try:
            data = request.get_json()
            url = data['url']
            
            # check if the url is valid
            feed = feedparser.parse(url)
            if feed.bozo == 1:
                return jsonify({'result': 'invalid'})
            
            cur = con.cursor()

            cur.execute("SELECT * FROM feeds WHERE url=?", (url,))
            if cur.fetchone():
                return jsonify({'result': 'already'})
            
            cur.execute("INSERT INTO feeds (url) VALUES (?)", (url,))
            con.commit()
            cur.close()
            emit('message', {"from": "back", "type": "feeds_update"}, broadcast=True, namespace='/')
            response = jsonify({'result': 'success'})
            return response
        except Exception as e:
            return jsonify({'error': str(e)})
   