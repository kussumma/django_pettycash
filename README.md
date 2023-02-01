# Django PettyCash

<div align="center">
    <img src="src/static/images/logo.png" width="250" height="150">
</div>

<br>

<div align="center">

![last commit](https://badgen.net/github/last-commit/zenpeaky/django_pettycash/main)
![count commit](https://badgen.net/github/commits/zenpeaky/django_pettycash/main)
![star](https://badgen.net/github/stars/zenpeaky/django_pettycash)
![forks](https://badgen.net/github/forks/zenpeaky/django_pettycash)
![issues](https://badgen.net/github/open-issues/zenpeaky/django_pettycash)
![python](https://badgen.net/badge/python/3.11/blue)
![django](https://badgen.net/badge/django/4.1/green)

</div>

<br>

Django PettyCash is an application for managing Petty Cash. This app is built with Django 4.1 with full use of Jquery AJAX on the frontend. The html template is created separately from the javascript module. This app also uses Django Allauth for its authentication management.
Views in this application prioritize the implementation of class based views as much as possible, with returns in the form of json for ajax consumption.

<hr>

Current features:
- location management
- account management
- transaction management
- authentication in the usual way
- authenticate with google
- report creation in view and pdf (jsPDF)
- user profile view

Upcoming Features:
- user custom model
- dashboard charts and analytics
- realtime transaction notifications
- scheduling transactions on the calendar
- save report with google drive

Features that still need to be improved:
- making more detailed reports and better pdf views
- adjustment of the model to better suit the needs of Petty Cash in general.

Upcoming developments:
- implementing views with react
- django-rest-framework implementation
- implementing Google Drive Api
- implementing whitenoise
