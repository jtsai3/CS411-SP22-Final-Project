# Title
Explore field of interest

# Purpose
The application is designed for prospective graduate students who are exploring different fields of research interest.

A student will be able to check the most popular topics and their popularity trend over time. They will be able to find professors who are most suitable as their research supervisors. They will also be able to see all fields touched by a particular faculty in case they prefer diving into a good combination of research topics. Moreover, a student can check the research strength of a university by looking at its keyword radar chart. There are options to modify the keyword pool as well.

# Demo

https://mediaspace.illinois.edu/media/t/1_4dbno5uy

# Installation
Frontend
- install nodejs v16.13.2
- under root directory, run `npm install` and `npm start`
- frontend will be running on [http://localhost:3000](http://localhost:3000)

Backend
- Activate the virtualenv for your project.
- Install project dependencies:\
`$ pythom -m pip install -r requirements.txt`

- Then simply apply the migrations:\
`$ python manage.py migrate`

- You can now run the development server:\
`$ python manage.py runserver 8000`

- Open [http://localhost:8000](http://localhost:8000) to view it in the browser.

# Usage
- Start both frontend and backend services
- Open [http://localhost:3000](http://localhost:3000) and try out the dashboard application 

# Design

## Frontend: React + Typescript + MUI

Frontend was build by React with Material Design UI framework. Each widget was written as individual React component for best encapsulation and flexibility. Charts were made with Apache ECharts library, which offers a great number of chart types and customizable chart configuration. Request to backend endpoints were handled by Axios library.

## Backend: Python Django REST Framework

Django is a high-level backend server side web framework that is free, open source and written in Python. The Django REST framework (DRF) is a toolkit built on top of the Django web framework that reduces the amount of code we need to write to create REST interfaces. 

DRF was used for this project becasue it is built on top of Python, which makes it easier to use. It also offers native support of SQL database connections and has official libraries support for NoSQL databases.

## Database: 

Three databases `MySQL`, `MongoDB`, and `Neo4j` are each used for the following widgets, respectively.

- MongoDB: Top 10 Most Popular Keywords, Publication Trend
- Neo4j: Top 10 Most Relevant Professors, All Keywords Related
- MySQL: Number of Faculty Related, Add Keyword, Remove Keyword


# Implementation

## Frontend
Below is an overall structure of the React frontend.
```
src
│   App.tsx
│   Header.tsx    
│
└─── Charts
|   |   index.tsx
|   |   TopKeywords.tsx
|   |   NumPublications.tsx
|   |   RelevantProf.tsx
|   |   KeywordComposition.tsx
|   |   NumFaculty.tsx
|   |   AddKeyword.tsx
|   |   RemoveKeyword.tsx
|
└─── utils
    |   request.ts
```
## Backend

Below is an overall structure of the Django backend. Only the important files are included in this graph.
```
django
│   manage.py
│   requirements.txt    
│
└─── cs411
│   │   settings.py
│   │   urls.py
│   
└─── mongo
│   │   urls.py
│   │   views.py
│   
└─── mysql
│   │   models.py
│   │   serializers.py
│   │   urls.py
│   │   views.py
│
└─── neo4jApp
    │   urls.py
    │   views.py
```

Under the `django` folder we have four subfolders: `cs411`, `mongo`, `mysql`, and `neo4jApp`. The subfolder `cs411` is our main app with `settings.py`, which is the settings file that indicate the application definition and our default database connection details (MySQL).

The subfolders `mongo`, `mysql`, and `neo4jApp` each refers to a Django app, which we "installed" in `settings.py` under `INSTALLED_APPS`. Each app works specifically with one database here. A basic description of how each files under the apps are implemented and the usage of them are as follow:

- `urls.py`: This is where we defined the mapping between URLs and views. The urls.py in the project folder `cs411` are the "base" URLs for the app. We then forwarded requests made on a certain route to our app's urls.py using `include`. 

- `view.py`: This file contains all "views" of an app, which is a Python Class / function that takes a web request and returns a web response. In our app, this response is a JSON response with HTTP status code to the frontend. The view itself contains whatever arbitrary logic is necessary to return that response.

- `models.py`: This file only exist for `mysql` app because Django only offers native support for SQL databases. A `model` is the single, definitive source of information about our data. It contains the essential fields and behaviors of the data we’re storing. Generally, each model maps to a single database table.

- `serializers.py`: Serializers allow complex data such as querysets and model instances to be converted to native Python datatypes that can then be easily rendered into JSON, XML or other content types. We only included this file for `mysql` app to serialize the `model` we have for MySQL tables and to be returned in `view`.

# Database Techniques

1. Indexing: Indexing were added to MySQL models `Faculty`, `Keyword`, and `University` in Django to create indexing in the database and speed up queries.\
For example: \
`indexes = [models.Index(fields=['name', ]), ]`

2. Constraint: `UniqueConstraint` were added to MySQL models `FacultyKeyword`, `FacultyPublication`, and `PublicationKeyword` in Django to create a unique constraint in the database.\
For example:\
`constraints = [models.UniqueConstraint(fields=['faculty', 'keyword'], name='unique keyword per faculty')]`

3. REST API for accessing databases: Several REST APIs were created for front-back end communication.\
For example:\
http://localhost:8000/mongo/publicationTrend/ \
http://localhost:8000/neo4j/relevantProfessor/ \
http://localhost:8000/mysql/facultyRelated/

# Extra-Credit Capabilities
- frontend-backend separation: standard pratice in industry
- pleasant UI/UX design: loading animation + autocomplete textbox for long list

# Contributions
- Qianyu Huang (qhuang23) - frontend + CORS header in backend + endpoint testing/debugging/connection - 20 Hours

- Jennifer Tsai (jtsai21) - backend logic + REST api setup + database connections + backend queries + endpoint testing/debugging/connection - 25 Hours