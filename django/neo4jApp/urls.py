from django.urls import include, path
from .views import RelevantProfessorView,AllKeywordsRelatedView


urlpatterns = [
    path("relevantProfessor/", RelevantProfessorView.as_view(), name="relevantProfessor"),
    path("keywordsRelated/", AllKeywordsRelatedView.as_view(), name="allKeywordsRelated"),
]
