from django.shortcuts import render
from django.http import HttpResponse
import json
from rest_framework import generics, authentication, permissions
from api import serializers
from .models import User, WishModel
from django.db.models import Q
from rest_framework import viewsets
from rest_framework.exceptions import ValidationError
from rest_framework import status
from rest_framework.response import Response


class CreateUserView(generics.CreateAPIView):
    serializer_class = serializers.UserSerializer

class WishViewSet(viewsets.ModelViewSet):
    queryset = WishModel.objects.all()
    serializer_class = serializers.WishSerializer
    authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

def CreateLink(request, pk):
    # print(WishModel.objects.all())
    wish = WishModel.objects.get(pk=pk)
    link = 'http://www.amazon.co.jp/gp/search/?__mk_ja_JP=%83J%83%5E%83J%83i&field-keywords={0}'.format(wish)
    itemName = link[80:]
    linkDict = {
        'link': link,
        'itemName': itemName,
    }
    return HttpResponse(json.dumps(linkDict))
