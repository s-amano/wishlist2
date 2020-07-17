from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api import views

router = DefaultRouter()
router.register('wishlist',views.WishViewSet)

urlpatterns = [
    path('user/create/', views.CreateUserView.as_view(), name='create'),
    path('link/<int:pk>/', views.CreateLink, name='link'),
    path('', include(router.urls)),
]
