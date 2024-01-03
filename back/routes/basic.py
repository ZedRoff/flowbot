from flask import Blueprint

bp = Blueprint('basic', __name__)

@bp.route('/api')
def hello_world():
    return 'API is working !'

