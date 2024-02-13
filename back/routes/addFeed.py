#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import feedparser



from flask import Blueprint, request, jsonify
import sqlite3
con = sqlite3.connect("./db/database.db", check_same_thread=False)
bp = Blueprint('add_feeds', __name__)

@bp.route('/api/addFeeds', methods=['POST'])
def add_feeds():
    if request.method == 'POST':
        try:
            data = request.get_json()
            url = data['url']
            
            # check if the url is valid
            feed = feedparser.parse(url)
            if feed.bozo == 1:
                return jsonify({'result': 'Invalid feed url'})
            
            cur = con.cursor()

            cur.execute("SELECT * FROM feeds WHERE url=?", (url,))
            if cur.fetchone():
                return jsonify({'result': 'Feed already exists'})
            
            cur.execute("INSERT INTO feeds (url) VALUES (?)", (url,))
            con.commit()
            cur.close()
            response = jsonify({'result': 'Feed added successfully'})
            return response
        except Exception as e:
            return jsonify({'error': str(e)})
   