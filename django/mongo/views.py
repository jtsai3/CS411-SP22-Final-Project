from urllib import response
import json
from django.shortcuts import render
from rest_framework.views import APIView
from django.http import HttpResponse
from rest_framework import status
from pymongo import MongoClient

def get_database():
    # Provide the mongodb atlas url to connect python to mongodb using pymongo
    CONNECTION_STRING = "mongodb://localhost:27017/"

    # Create a connection using MongoClient.
    client = MongoClient(CONNECTION_STRING)

    # Create the database
    return client['academicworld']

class MostPopularKeywordView(APIView):
    """Show top 10 most popular keywords in publications"""
    def get(self, request):
        dbName = get_database()
        collection = dbName["publications"]
        responseData = list(
            collection.aggregate([
                {"$unwind": "$keywords"},
                {"$project": {"keywords":1,"_id":0}},
                {"$group": {
                    "_id": "$keywords.name",
                    "pub_cnt": { "$sum" : 1 }}
                },
                {"$sort":{"pub_cnt": -1}},
                {"$limit":10}
                ])
            )
        return HttpResponse(json.dumps(responseData), content_type="application/json", status=status.HTTP_200_OK)
    
class PublicationTrendView(APIView):
    """Show number of publications relevant to keyword"""
    def get(self, request):
        #INPUT: keywordName (eg. {"keywordName": "internet"})
        try:    
            keywordName = request.GET.get('keywordName')
        except Exception as e:
            print("No input given: ", e)
        dbName = get_database()
        collection = dbName["publications"]
        responseData = list(
            collection.aggregate([
                            {"$unwind": "$keywords"},
                            {"$match": {"keywords.name": keywordName}},
                            {"$project": {"year":1,"keywords":1,"_id":0}},
                            {"$group": {
                                "_id": "$year",
                                "pub_cnt": { "$sum" : 1 }}
                            },
                            {"$sort":{"_id": 1}}
                            ])
            )
        return HttpResponse(json.dumps(responseData), content_type="application/json", status=status.HTTP_200_OK)
