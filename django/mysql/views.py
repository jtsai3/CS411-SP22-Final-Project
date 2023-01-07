from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.views import APIView
from django.db import connection
from django.http import HttpResponse, JsonResponse

from rest_framework import status
import json

from .serializers import Faculty_serializers, FacultyKeyword_serializers,FacultyPublication_serializers,Keyword_serializers,\
    Publication_serializers,PublicationKeyword_serializers,University_serializers
from .models import Faculty,FacultyKeyword,FacultyPublication,Keyword,Publication,PublicationKeyword,University

def dictfetchall(cursor):
    "Return all rows from a cursor as a dict"
    """
    columns = [col[0] for col in cursor.description]
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]
    """
    desc = cursor.description
    return [dict(zip([col[0] for col in desc], row)) 
            for row in cursor.fetchall()]

# Create your views here.
class FacultyView(viewsets.ModelViewSet):
    """
    A ViewSet for tasks related to the Faculty
    """
    queryset = Faculty.objects.all()
    serializer_class = Faculty_serializers

class KeywordView(viewsets.ModelViewSet):
    queryset = Keyword.objects.all()
    serializer_class = Keyword_serializers
    
class PublicationView(viewsets.ModelViewSet):
    queryset = Publication.objects.all()
    serializer_class = Publication_serializers

class UniversityView(viewsets.ModelViewSet):
    queryset = University.objects.all()
    serializer_class = University_serializers
    
class FacultyRelatedKeywordView(APIView):
    """Show # of faculty relevant to top 10 keywords in a given univeristy 
    (relavant to: prof has keyword score >= 50)"""
    def get(self, request):
        #INPUT: universityName (eg. {"universityName": "University of illinois at Urbana Champaign"})
        try:
            universityName = request.GET.get('universityName')
        except Exception as e:
            print("No input given: ", e)
        query_string = '''
                       SELECT keyword.name AS keyword, 
                         COUNT(*) AS count
                       FROM faculty
                       JOIN faculty_keyword
                         ON faculty.id = faculty_keyword.faculty_id
                       JOIN university
                         ON faculty.university_id = university.id
                       JOIN keyword
                         ON faculty_keyword.keyword_id = keyword.id
                       WHERE university.name = %s
                         AND faculty_keyword.score >= 50
                       GROUP BY keyword.id
                       ORDER BY count DESC
                       LIMIT 10;
                       '''
        with connection.cursor() as cursor:
            cursor.execute(query_string, [universityName])
        responseData = dictfetchall(cursor)
        return HttpResponse(json.dumps(responseData), content_type="application/json", status=status.HTTP_200_OK)
    
class AddKeywordView(APIView):
    def post(self,request):
        #INPUT: keywordName (eg. {"keywordName": "abcdef"})
        try:
            keywordName = request.data['keywordName']
        except Exception as e:
            print("No input given: ", e)
        exist = Keyword.objects.filter(name=keywordName).exists()
        if not exist:
            latestID = Keyword.objects.latest('id').id
            newKeyword = Keyword(id=latestID+1,name=keywordName)
            newKeyword.save()
            return HttpResponse(status=status.HTTP_200_OK)
        else:
            message = "Keyword already exist."
            return JsonResponse({'status':'false','message':message}, status=400)
    
class DeleteKeywordView(APIView):
    def post(self,request):
        #INPUT: keywordName (eg. {"keywordName": "abcdef"})
        try:
            keywordName = request.data['keywordName']
        except Exception as e:
            print("No input given: ", e)
        exist = Keyword.objects.filter(name=keywordName).exists()
        if exist:
            instance = Keyword.objects.get(name=keywordName)
            try:
                instance.delete()
                return HttpResponse(status=status.HTTP_200_OK)
            except:
                message = "Cannot delete a keyword with other relations."
                return JsonResponse({'status':'false','message':message}, status=400)
        else:
            message = "Keyword does not exist."
            return JsonResponse({'status':'false','message':message}, status=400)