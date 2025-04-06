from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

TOKEN_MAP = {
    '24ad193a650d5a824asdasdfsa9d84ffasdfasdf212ab43993': 'Token',
    '': ''
}

class SimpleUser:
    def __init__(self, user_id):
        self.user_id = user_id
        self.is_authenticated = True

    def __str__(self):
        return self.user_id

class StaticHeaderTokenAuthentication(BaseAuthentication):
    def authenticate(self, request):
        token = request.headers.get('token', '')
        if token not in TOKEN_MAP:
            raise AuthenticationFailed('Invalid token')
        user_id = TOKEN_MAP[token]
        if not user_id:
            return None
        user = SimpleUser(user_id)
        return (user, token)

    def authenticate_header(self, request):
        return 'Token'