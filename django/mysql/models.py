from pickle import TRUE
from django.db import models


class Faculty(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=512, blank=True, null=True)
    position = models.CharField(max_length=512, blank=True, null=True)
    research_interest = models.CharField(max_length=512, blank=True, null=True)
    email = models.CharField(max_length=512, blank=True, null=True)
    phone = models.CharField(max_length=512, blank=True, null=True)
    photo_url = models.CharField(max_length=512, blank=True, null=True)
    university = models.ForeignKey('University', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = TRUE
        db_table = 'faculty'
        indexes = [models.Index(fields=['name', ]), ]


class FacultyKeyword(models.Model):
    faculty = models.OneToOneField(Faculty, models.DO_NOTHING, primary_key=True)
    keyword = models.ForeignKey('Keyword', models.DO_NOTHING)
    score = models.FloatField(blank=True, null=True)

    class Meta:
        managed = TRUE
        db_table = 'faculty_keyword'
        constraints = [
            models.UniqueConstraint(fields=['faculty', 'keyword'], name='unique keyword per faculty')
        ]
        


class FacultyPublication(models.Model):
    faculty = models.OneToOneField(Faculty, models.DO_NOTHING, primary_key=True)
    publication = models.ForeignKey('Publication', models.DO_NOTHING)

    class Meta:
        managed = TRUE
        db_table = 'faculty_publication'
        constraints = [
            models.UniqueConstraint(fields=['faculty', 'publication'], name='unique faculty per publication')
        ]



class Keyword(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=512, blank=True, null=True)

    class Meta:
        managed = TRUE
        db_table = 'keyword'
        indexes = [models.Index(fields=['name', ]), ]


class Publication(models.Model):
    id = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=512, blank=True, null=True)
    venue = models.CharField(max_length=512, blank=True, null=True)
    year = models.CharField(max_length=512, blank=True, null=True)
    num_citations = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = TRUE
        db_table = 'publication'


class PublicationKeyword(models.Model):
    publication = models.OneToOneField(Publication, models.DO_NOTHING, primary_key=True)
    keyword = models.ForeignKey(Keyword, models.DO_NOTHING)
    score = models.FloatField(blank=True, null=True)

    class Meta:
        managed = TRUE
        db_table = 'publication_keyword'
        constraints = [
            models.UniqueConstraint(fields=['publication', 'keyword'], name='unique keyword per publication')
        ]


class University(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=512, blank=True, null=True)
    photo_url = models.CharField(max_length=512, blank=True, null=True)

    class Meta:
        managed = TRUE
        db_table = 'university'
        indexes = [models.Index(fields=['name', ]), ]
