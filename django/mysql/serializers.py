# Transfer python from models.py into json
from rest_framework import serializers
from .models import Faculty,FacultyKeyword,FacultyPublication,Keyword,Publication,PublicationKeyword,University

class Faculty_serializers(serializers.ModelSerializer):
    class Meta:
        model = Faculty
        fields = ('id', 'name', 'position', 'research_interest', 'email', 
                    'phone', 'photo_url', 'university')
        
class FacultyKeyword_serializers(serializers.ModelSerializer):
    class Meta:
        model = FacultyKeyword
        fields = ('faculty', 'keyword', 'score')

class FacultyPublication_serializers(serializers.ModelSerializer):
    class Meta:
        model = FacultyPublication
        fields = ('faculty', 'publication')
        
class Keyword_serializers(serializers.ModelSerializer):
    class Meta:
        model = Keyword
        fields = ('id', 'name')
        

class Publication_serializers(serializers.ModelSerializer):
    class Meta:
        model = Publication
        fields = ('id', 'title', 'venue', 'year', 'num_citations')
        
class PublicationKeyword_serializers(serializers.ModelSerializer):
    class Meta:
        model = PublicationKeyword
        fields = ('publication', 'keyword', 'score')
        
class University_serializers(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = ('id', 'name', 'photo_url')
