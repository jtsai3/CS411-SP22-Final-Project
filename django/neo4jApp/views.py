from urllib import response
import json
from rest_framework.views import APIView
from django.http import HttpResponse
from rest_framework import status
from neo4j import GraphDatabase

class Neo4jConnection:
    
    def __init__(self, uri, user, pwd):
        self.__uri = uri
        self.__user = user
        self.__pwd = pwd
        self.__driver = None
        try:
            self.__driver = GraphDatabase.driver(self.__uri, auth=(self.__user, self.__pwd))
        except Exception as e:
            print("Failed to create the driver:", e)
        
    def close(self):
        if self.__driver is not None:
            self.__driver.close()
        
    def query(self, query, db=None):
        assert self.__driver is not None, "Driver not initialized!"
        session = None
        response = None
        try: 
            session = self.__driver.session(database=db) if db is not None else self.__driver.session() 
            response = list(session.run(query))
        except Exception as e:
            print("Query failed:", e)
        finally: 
            if session is not None:
                session.close()
        return response

class RelevantProfessorView(APIView):
    """Show top 10 professors most relevant to keyword (based on KRC)"""
    #INPUT: keywordName (eg. {"keywordName": "internet"})
    def get(self, request):
        try:
            keywordName = request.GET.get('keywordName')
        except Exception as e:
            print("No input given: ", e)
        conn = Neo4jConnection(uri="bolt://localhost:7687", user="neo4j", pwd="Password123")
        query_string = '''
                        MATCH (f:FACULTY)-[:PUBLISH]->(p:PUBLICATION)-[l:LABEL_BY]->(k:KEYWORD)
                        WHERE k.name = "{}"
                        RETURN f.name AS `faculty.name`, 
                            sum(p.numCitations * l.score) AS `KRC`
                        ORDER BY KRC DESC
                        LIMIT 10
                        '''.format(keywordName)
        responseData = list(conn.query(query_string, db='academicworld'))
        conn.close()
        return HttpResponse(json.dumps(responseData), content_type="application/json", status=status.HTTP_200_OK)


class AllKeywordsRelatedView(APIView):
    """Show keyword composition of professor (based on KRC), 20 max"""
    #INPUT: profName (eg. {"profName": "Jiawei Han"})
    def get(self, request):
        try:
            profName = request.GET.get('profName')
        except Exception as e:
            print("No input given: ", e)
        conn = Neo4jConnection(uri="bolt://localhost:7687", user="neo4j", pwd="Password123")
        query_string = '''
                        MATCH (f:FACULTY)-[:PUBLISH]->(p:PUBLICATION)-[l:LABEL_BY]->(k:KEYWORD)
                        WHERE f.name = "{}"
                        RETURN k.name AS `keyword.name`, 
                            sum(p.numCitations * l.score) AS `KRC`
                        ORDER BY KRC DESC
                        LIMIT 20
                        '''.format(profName)
        responseData = list(conn.query(query_string, db='academicworld'))
        conn.close()
        return HttpResponse(json.dumps(responseData), content_type="application/json", status=status.HTTP_200_OK)
