from django.urls import include, path
from .views import MostPopularKeywordView,PublicationTrendView


urlpatterns = [
    path("mostPopularKeyword/", MostPopularKeywordView.as_view(), name="popularKeyword"),
    path("publicationTrend/", PublicationTrendView.as_view(), name="publicationTrend"),
]
