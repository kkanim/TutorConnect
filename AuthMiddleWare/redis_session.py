import redis
from uuid import uuid4
import json

class RedisSession:
    """
    Redis Session management class for storing session token
    """

    def __init__(self):
        self._redis = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)
    
    def set_cookie(self, response, key, value, max_age=3600, secure=True):
        return response.set_cookie(
            key,
            value,
            httponly=True,
            secure=secure,
            samesite="Lax",
            max_age=max_age,
        )

    def create_session(self, user_details, max_age=3600*24):
        session_token = str(uuid4())
        refresh_token = str(uuid4())
        self._redis.set(session_token, json.dumps(user_details), ex=3600)
        self._redis.set(refresh_token, json.dumps(user_details), ex=max_age)
        return {'session_token': session_token, 'refresh_token': refresh_token}

    def delete_session(self, session_token, refresh_token):
        self._redis.delete(session_token)
        self._redis.delete(refresh_token)
        return True

    def update_cache(self, user_details, session_token='', refresh_token=''):
        try:
            if len(session_token) > 0 and len(refresh_token) > 0:
                session_ttl = self._redis.ttl(session_token)
                refresh_ttl = self._redis.ttl(refresh_token)
                self._redis.setex(session_token, session_ttl, json.dumps(user_details))
                self._redis.setex(refresh_token, refresh_ttl, json.dumps(user_details))
                return True
            return False
        except Exception as e:
            print("Error in update_cache[From RedisSession]: ", e)
            return False

    def refresh_session(self, refresh_token):
        user_details = self._redis.get(refresh_token)
        if user_details:
            session_token = str(uuid4())
            self._redis.set(session_token, user_details, ex=3600)
            return {'renew': True, 'session_token': session_token, 'user_details': json.loads(user_details)}
        return False

    def check_session(self, session_token, refresh_token):
        user_details = self._redis.get(session_token)
        if user_details:
            return {'renew': False, 'user_details': json.loads(user_details)}
        return self.refresh_session(refresh_token)