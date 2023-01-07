"""cs411 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import FacultyView,KeywordView,PublicationView,UniversityView,\
    FacultyRelatedKeywordView,AddKeywordView,DeleteKeywordView

router = DefaultRouter()
router.register(r'faculty', FacultyView, basename='faculty')
router.register(r'keyword', KeywordView, basename='keyword')
router.register(r'publication', PublicationView, basename='publication')
router.register(r'university', UniversityView, basename='university')

urlpatterns = [
    path('', include(router.urls)),
    path("facultyRelated/", FacultyRelatedKeywordView.as_view(), name="facultyRelated"),
    path("addKeyword/", AddKeywordView.as_view(), name="addKeyword"),
    path("deleteKeyword/", DeleteKeywordView.as_view(), name="deleteKeyword"),
]
