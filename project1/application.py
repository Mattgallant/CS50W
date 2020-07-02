import os
import sys
import requests

from flask import Flask, session, render_template, request
from flask_session import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

app = Flask(__name__)

# Check for environment variable
if not os.getenv("DATABASE_URL"):
    raise RuntimeError("DATABASE_URL is not set")

# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)


# Set up database
engine = create_engine(os.getenv("DATABASE_URL"))
db = scoped_session(sessionmaker(bind=engine))


""" App Routes """ 
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/logout")
def logout():
	session["logged_in"] = False
	session["username"] = None
	return render_template("logout.html")

@app.route("/login")
def login():
	return render_template("login.html")

@app.route("/login/response", methods=["POST"])
def login_response():
	success = True
	username = request.form.get("username")
	password = request.form.get("password")

	# Check if user and pass exists
	db_user = db.execute("SELECT COUNT(*) FROM users where username = :username AND password = :password",
		{"username": username, "password":password}).fetchone()[0]
	success = True if (db_user == 1) else False
	if success:
		session["logged_in"] = True
		session["username"] = username

	return render_template("login_response.html", success=success, username=username)

@app.route("/register")
def register():
	return render_template("register.html")

@app.route("/register/response", methods=["POST"])
def register_response():
	username = request.form.get("username")
	password = request.form.get("password")

	# Check if user already exists
	allowed = db.execute("SELECT COUNT(*) FROM users WHERE username = :username", {"username": username}).fetchone()[0]
	# print(allowed, file=sys.stderr)
	allowed = True if (allowed == 0) else False
	if allowed:
		db.execute("INSERT INTO users (username, password) VALUES (:username, :password)", {"username": username, "password":password})
		db.commit()

	return render_template("register_response.html", allowed=allowed, username=username)

@app.route("/search")
def search():
	return "Not implemented"

@app.route("/browse", methods=["POST", "GET"])
def browse():
	limit_number = 20 # Default value
	limit_number = request.form.get("username")
	limit_number = 20 if (limit_number is None) else limit_number
	total_books = db.execute("SELECT COUNT(*) FROM books").fetchone()
	books = db.execute("SELECT isbn, title, author, year FROM books ORDER BY random() LIMIT :limit_number", {"limit_number": limit_number}).fetchall()
	return render_template("browse.html", books=books, current_number=limit_number, total_number=total_books[0])

@app.route("/book/<string:isbn>")
def book(isbn):
	""" Displays data about an individual book """
	res = requests.get("https://www.goodreads.com/book/review_counts.json", params={"key": "5Ln6YakuzBEM4Wcbrnaw", "isbns": isbn})
	if res.status_code != 200:
		goodreads_success = False
	else:
		goodreads_success = True

	res = res.json()

	book_info = db.execute("SELECT * FROM books where isbn= :isbn",
		{"isbn": isbn}).fetchone()
	print(book_info, file=sys.stderr)
	print(book_info["title"], file=sys.stderr)


	review_list = db.execute("SELECT * FROM reviews where book_id=:book_id", {"book_id": book_info["id"]}).fetchall()
	print(review_list, file=sys.stderr)


	return render_template("book.html", book=book_info, success=goodreads_success, goodreads = res, review_list=review_list)

@app.route("/book/<string:isbn>/posted", methods=["POST"])
def book_review(isbn):

	# Get required review data
	username = session["username"]
	user_id = db.execute("SELECT id FROM users WHERE username=:username", {"username": username}).fetchone()[0]
	book_info = db.execute("SELECT id, title from books where isbn =:isbn", {"isbn": isbn}).fetchone()
	book_id = book_info[0]
	book_title = book_info[1]
	review_text = request.form.get("review_text")

	db.execute("INSERT INTO reviews (username, book_title, user_id, book_id, review_text) VALUES (:username, :book_title, :user_id, :book_id, :review_text)"
		, {"username": username, "book_title": book_title, "user_id": user_id, "book_id":book_id, "review_text": review_text})
	db.commit()

	return book(isbn)



