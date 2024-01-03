from flask import Blueprint

bp = Blueprint('test', __name__)

@bp.route('/api/test')
def hello_world():
    return 'Hello, World!'

