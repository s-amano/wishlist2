from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.authtoken.models import Token
from api.models import WishModel

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)
        Token.objects.create(user=user)
        return user

class WishSerializer(serializers.ModelSerializer):

    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)

    class Meta:
        model = WishModel
        fields = ('id', 'title', 'created_at')
