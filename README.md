# Django PettyCash

<div align="center">
    <img src="src/static/images/logo.png" width="150" height="100">
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

<div align="center">
<img width="800" alt="SCR-20230201-du8" src="https://user-images.githubusercontent.com/47457477/215966321-4c1c652e-d003-41aa-a8db-e8e7c611e739.png">
</div>

<br>

<hr>

Current features:
- CRUD
- Ajax
- Basic Analytics
- Basic and Google Auth
- Async Notification
- Media file with mongodb gridfs

<br>

How to install:

run poetry and activate it shell
```bash
poetry install && poetry shell && cd src
```

copy and set env value
```bash
cp src/django_pettycash/.env.example src/django_pettycash/.env
```

migrate database
```bash
python manage.py migrate
```

load sample data
```bash
python manage.py loaddata */fixtures/*.json 
```

run app
```bash
python manage.py runserver
```

open localhost:8000 and you should see the login form