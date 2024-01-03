import os
from flask import Flask
import threading
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

def import_routes():
    routes_dir = os.path.join(os.path.dirname(__file__), 'routes')
    for filename in os.listdir(routes_dir):
        if filename.endswith('.py'):
            module_name = filename[:-3]
            module = __import__(f'routes.{module_name}', fromlist=[''])
            app.register_blueprint(module.bp)


import_routes()




if __name__ == '__main__':
    # t1 = threading.Thread(target=startup)
    # t2 = threading.Thread(target=app.run)
    app.run(debug=True)
