from googlesearch import search
import webbrowser

res_temp = search("Python", advanced=True)
res = list(map(lambda x: x, res_temp))[0]
print(res.description)
# extract the main informations from the search


