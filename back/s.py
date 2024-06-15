from googlesearch import search
results = search("python", advanced=True, lang='fr')
for i, result in enumerate(results, start=1):
    print(result.url)
    if "wikipedia" in result.url:
        print(result.description)
  