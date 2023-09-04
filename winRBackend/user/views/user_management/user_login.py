import jwt
import time
import bcrypt
from user.tags import USER
from django.conf import settings
from datetime import datetime,timedelta
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from user.models import DnUserMaster,DnAdminMaster
from custom_lib.api_view_class import CustomAPIView
from custom_lib.helper import valid_serializer, generate_token
from user.serializers import LoginSerializer, AdminLoginSerializer


class LoginView(CustomAPIView):
    @swagger_auto_schema(
        tags=[USER],
        request_body=LoginSerializer
    )
    def post(self, request):
        data = valid_serializer(LoginSerializer(data=request.data), error_code=12006)
        username = data["username"]
        password = data["password"]
        
        userObjs = DnUserMaster.objects.filter(username=username)
        if not userObjs.exists():
            raise Exception(12008)
        user=userObjs.first()
        password = password.encode('utf-8')
        userBytes = user.password.encode('utf-8')
        result = bcrypt.checkpw(password, userBytes)
        if not result:
            raise Exception(12010)
        
        id=user.pk
        userName=user.username
        if user.is_first == 0:
            newToken = generate_token()
            timestamp = int(time.time()) + 600
            to_save = newToken + "#&@*" + str(timestamp)
            DnUserMaster.objects.filter(id=id).update(timestamp=to_save)
            return Response({"newToken": to_save, "userId": id})

        payload = {
                   "exp" : datetime.utcnow() + timedelta(minutes=int(settings.JWT_EXPIRATION_IN_MINUTES)),
                   "iat" : datetime.utcnow()
                   }
        jwtToken = jwt.encode(payload,'ADITYA-SECRET',algorithm='HS256')
        return Response({"jwt":jwtToken, "userId":id, "userName":userName})
    

class AdminLoginView(CustomAPIView):
    @swagger_auto_schema(
        tags=[USER],
        request_body=AdminLoginSerializer
    )
    def post(self, request):
        data = valid_serializer(AdminLoginSerializer(data=request.data), error_code=12006)
        email = data["email"]
        password = data["password"]
        
        suObj = DnAdminMaster.objects.filter(email=email)
        if not suObj.exists():
            raise Exception(12006) 

        su=suObj.first()
        password = password.encode('utf-8')
        userBytes =su.password.encode('utf-8')
        result = bcrypt.checkpw(password,userBytes)
        if not result:
            raise Exception(12010)
        id=su.pk
        userName=su.username
        payload = {
                   "exp" : datetime.utcnow() + timedelta(minutes=int(settings.JWT_EXPIRATION_IN_MINUTES)),
                   "iat" : datetime.utcnow()
                   }
        jwtToken = jwt.encode(payload,'ADITYA-SECRET',algorithm='HS256')
        return Response({"jwt":jwtToken, "userId":id, "userName":userName})