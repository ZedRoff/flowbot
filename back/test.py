#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import feedparser

# Création d'une instance
news_feed = feedparser.parse('https://www.cert.ssi.gouv.fr/alerte/feed/')


for entry in news_feed.entries[:3]:
    print(f"{entry.title} --> {entry.link}")
    

