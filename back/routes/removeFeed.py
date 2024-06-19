#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import feedparser



from flask import Blueprint, request, jsonify
import sqlite3
from flask_socketio import SocketIO, emit
con = sqlite3.connect("./db/database.db", check_same_thread=False)
bp = Blueprint('remove_feed', __name__)

@bp.route('/api/removeFeed', methods=['POST'])
def remove_feed():
    if request.method == 'POST':
        try:
            data = request.get_json()
            url = data['url'][0]
  
            cur = con.cursor()
            cur.execute("SELECT * FROM feeds WHERE url=?", (url,))
            if not cur.fetchone():
                return jsonify({'result': 'doesnt'})
            
            cur = con.cursor()
            cur.execute("DELETE FROM feeds WHERE url=?", (url,))
            con.commit()
            cur.close()

            emit('message', {"from": "back", "type": "feeds_update"}, broadcast=True, namespace='/')
            response = jsonify({'result': 'success'})
            return response
        except Exception as e:
            return jsonify({'error': str(e)})
        