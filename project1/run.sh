# This script sets up flask app and sets the database. Use to run flask app.

export FLASK_APP=application.py
export FLASK_DEBUG=1
export DATABASE_URL=postgres://ndhvqnikcvpgme:b98df759ef3b666dc582656738584e4974f3c3462c81dfe6a81e63f1c0efb385@ec2-18-210-214-86.compute-1.amazonaws.com:5432/dgsnde2be3upp
start chrome http://127.0.0.1:5000/
flask run
