# Localhost
## Frontend
In your terminal, cd into the frontend folder and type in
```
 npm install
``` 
To run your program, type in 
```
npm start
```
The site will be displayed on: http://localhost:3000


## Backend
In your terminal, cd into the backend folder

### Running Development Server

First, install virtualenv, create and activate the environment called **venv**:

```bash
$ pip3 install virtualenv
$ virtualenv -p python3 venv
$ source venv/bin/activate
```
You will then have a ```(venv)``` before the ```$```, meaning that you are now in your virtual environment. Then, install the python package dependencies, which include Flask.
```
(venv)$ pip install -r requirements.txt
```

To install Postgres with Homebrew([postgresapp](http://postgresapp.com/) also works). If you are using linux, use your linux distributon's package manager to install postgres (**do this in new terminal**):
```
$ brew install postgresql
$ brew link postgresql
```
This should start your postgres server:
```
$ brew services start postgresql
```
To stop:
```
$ brew services stop postgresql
```
On a separate CLI, check whether you can access the database. Your postgres server must be on in order for this to work:
```
$ createdb
$ psql -h localhost
# \q
```
After installing Postgres, create a user(with name 'testusr' and password 'password') and a database called 'testdb' then grant privileges. We will do this in your CLI:
```
$ psql
# create user testusr with password 'password';
# create database testdb owner testusr encoding 'utf-8';
# GRANT ALL PRIVILEGES ON DATABASE testdb TO testusr;
```
Note: Please replace the user name and password and database name to what you want in your own application. You must change those configurations in ```config.py``` and in ```.env```
<br>
(**go back to the terminal with your virtual environment running**)
<br>
To populate the database type in:
```
(venv)$ python manage.py recreate_db
```
Then, to run the server type in:
```
(venv)$ python manage.py runserver
```
To deactivate when you're using it:
```
(venv)$ deactivate venv
```
If you are using pip, your command line will have `(venv)$` in front instead of the `(flask......) bash-3.2$` Now look above for instructions to run the server.

The API should be at http://127.0.0.1:3453/ 


# Deploying to Heroku
Separate the frontend and the backend into two different repositories

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
## Frontend
Change all axios calls from http://127.0.0.1:3453 to whatever your heroku backend's url is

To create a new heroku app out of your frontend repository
```
heroku create
```
To Deploy your code 
```
git push heroku master
```
Login into heroku in your command line:
