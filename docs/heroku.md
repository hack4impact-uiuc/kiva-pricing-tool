# Deploying to Heroku
Before you start, separate the frontend and the backend into two different repositories

## Backend
### Heroku Deployment
Heroku allows you to easily deploy your application without worrying about dependencies and how to set up your server. Once it's set up you can just push your code to Heroku and it will automatically update.<br>
**You must have a Heroku Account and have the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed on your computer.** 

First, create an application in your Heroku dashboard, click on the "Deploy" tab and find the ```git remote add ....``` and run that command in your repository.
While you're still in your Heroku Dashboard, click add `Heroku Postgres`. This will add a Postgres Database to your app(we will connect it later).

Then, login into heroku in your command line:
```
$ heroku login
```
To double check whether you have the postgres add-on:
```
$ heroku addons
```
And you should get something with ```heroku-postgresql (postgresql-metric-75135)```<br>
To let Heroku know get the Production Configurations, we will have to set an environment variable ```FLASK_ENV``` to ```"prod"```. 
```
$ heroku config:set FLASK_ENV="prod"	
```
Then push your latest changes to heroku: 
```
$ git push heroku master
```
After pushing your app to heroku, you need to migrate and update heroku postgres:
```
$ heroku run bash
~ $ python manage.py db init
~ $ python manage.py db migrate
~ $ python manage.py db upgrade
```
Finally, open up your live app by clicking the "Open App" button on the top-right corner of your Heroku dashboard!
### Heroku Postgres CLI 
A pretty neat command to go into the heroku postgres CLI is:
```
$ heroku pg:psql
```
Note: You are already inside your database!
### Version Errors when migrating database
This happens when the alembic table SQLAlchemy uses screws up. You must remove it and migrate the database again.<br>
Go into the Heroku postgres database
```
$ heroku pg:psql
```
Then, delete the alembic table.
``` 
# DROP TABLE alembic_version;
```
Go into your Heroku CLI and remigrate your database
```
$ heroku run bash
$ python manage.py db init
$ python manage.py db migrate
$ python manage.py db upgrade
```
### Resetting your Database
For the first step you have two options, for the first option you should go into your heroku backend's postgress add-on, then go to the settings page and press **Reset Database**.
<br>
The second option is to type this into your terminal:

```
$ heroku pg:reset DATABASE
```

Go into your Heroku CLI and remigrate your database
```
$ heroku run bash
$ python manage.py db init
$ python manage.py db migrate
$ python manage.py db upgrade
$ python manage.py recreate_db
```

## Frontend
Change flaskURL in frontend/src/utils from http://127.0.0.1:3453 to whatever your heroku backend's url is

To create a new heroku app out of your frontend repository
```
heroku create
```
To Deploy your code 
```
git push heroku master
```
Login into heroku in your command line:
