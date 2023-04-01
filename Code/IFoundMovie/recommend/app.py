from flask import Flask
import json
from flask import g
from flask import render_template
from flask import request,jsonify,current_app
import requests
import requests
from flask import redirect
from flask import url_for
import re
from datetime import datetime
from functools import wraps
import jwt
from jwt import exceptions
import mysql.connector
from mysql.connector import FieldType
from enum import Enum
from http import HTTPStatus
import connect
import functools
import datetime
import pandas as pd
import numpy as np
from scipy.spatial.distance import cosine
from difflib import SequenceMatcher

app = Flask(__name__)
dbconn = None
connection = None


def after_request(resp):
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Headers'] = '*'
    return resp


app.after_request(after_request)

# build header
headers = {
    'typ': 'jwt',
    'alg': 'HS256'
}

# Token
SALT = 'iv%i6xo7l8_t9bf_u!8#g#m*)*+ej@bek6)(@u3kh*42+unjv='

def create_token(id,username, password):
    # build payload
    payload = {
        'id': id,
        'username': username,
        'password': password,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)  # Timeout
    }
    result = jwt.encode(payload=payload, key=SALT, algorithm='HS256', headers=headers)
    return result


def verify_jwt(token, secret=None):
    """
    检验jwt
    :param token: jwt
    :param secret: 密钥
    :return: dict: payload
    """
    if not secret:
        secret = current_app.config['JWT_SECRET']
    try:
        payload = jwt.decode(token, secret, algorithms=['HS256'])
        return payload
    except exceptions.ExpiredSignatureError:  # 'token was expired'
        return 1
    except jwt.DecodeError:  # 'token verification failed'
        return 2
    except jwt.InvalidTokenError:  # 'illegal token'
        return 3


def getCursor():
    global dbconn
    global connection
    connection = mysql.connector.Connect(user=connect.dbuser, \
    password=connect.dbpass, host=connect.dbhost, \
    database=connect.dbname, port=connect.dbport,\
    auth_plugin='mysql_native_password',\
    autocommit=True)
    dbconn = connection.cursor()
    return dbconn


def login_required(f):
    'Let the decorator decorate the function properties will not change -- name property'
    '1st method, Use wraps of the functools module to decorate the inner functions'
    @functools.wraps(f)
    def wrapper(*args, **kwargs):
        try:
            if g.username == 1:
                return {'code': 4001, 'message': 'token expired'}, 401
            elif g.username == 2:
                return {'code': 4001, 'message': 'token authentication failure'}, 401
            elif g.username == 2:
                return {'code': 4001, 'message': 'Invalid token'}, 401
            else:
                return f(*args, **kwargs)
        except BaseException as e:
            return {'code': 4001, 'message': 'Please log in for authentication first.'}, 401

    '2nd method, The name attribute of the wrapper is modified before returning the inner function'
    # wrapper.__name__ = f.__name__
    return wrapper


@app.before_request
def jwt_authentication():
    """
    1. Obtain the token in request header Authorization
    2. Determine whether to start with Bearer
    3. Use the jwt module for verification
    4. Judge the verification result, extract the payload information in the token and assign the value to g object for storage upon success
    
    """
    auth = request.headers.get('Authorization')
    if auth and auth.startswith('Bearer '):
        "Extract token 0-6 by Bearer and Spaces taking up all characters after subscript 7"
        token = auth[7:]
        "Verified the token"
        g.username = None
        try:
            "Judge the result of token verification"
            payload = jwt.decode(token, SALT, algorithms=['HS256'])
            "Gets the information in the payload assigned to the g object"
            g.username = payload.get('username')
            g.id = payload.get('id')
            g.user=payload
        except exceptions.ExpiredSignatureError:  # 'token expired'
            g.username = 1
        except jwt.DecodeError:  # 'token verification failed'
            g.username = 2
        except jwt.InvalidTokenError:  # 'illegal token'
            g.username = 3


@app.route("/login", methods=["POST"])
def Login():
    connection = getCursor(); # Determine the parameters entered by the user
    username = request.form.get("username")
    password = request.form.get("password")
    if not username or not password:  # 
        return {"status_code": HTTPStatus.BAD_REQUEST, "message": "must have username and password"}
    connection.execute(f"SELECT * FROM users where username='{username}' and password='{password}';")
    user = connection.fetchone()
    if not user:
        return {"status_code": HTTPStatus.BAD_REQUEST, "message": "The user name or password is incorrect"}
    else:
        token = create_token(user[0], user[1], user[2])
        return {"data": {"user":user,"token":token}, "status_code": HTTPStatus.OK, "message": "successfully login"}


@app.route("/register",methods=["POST"])
def register():
    connection = getCursor()
    username = request.form.get("username")
    password = request.form.get("password")
    if not username or not password:  # Determine the parameters entered by the user
        return {"data": None, "status_code": HTTPStatus.BAD_REQUEST, "message": "must have username and password"}
    connection.execute(f"SELECT * FROM users where username='{username}';")
    user = connection.fetchall()
    if not user:
        connection.execute(f"""insert into users(username,`password`)values('{username}','{password}')""")
        return {"status_code": HTTPStatus.OK, "message": "Registered user successfully"}
    else:
        return {"status_code": HTTPStatus.BAD_REQUEST, "message": "The userName has been registered"}







@app.route('/token', methods=['GET', 'POST'])
@login_required
def submit_test_info_():
    user = g.user
    return user

def createDirector_csv():
    path1 = './data/movie.csv'
    ratings = pd.read_csv(path1, names=None)
    df_li = ratings.values.tolist()
    result = []
    for s_li in df_li:
        bl = False
        for rs in result:
            if len(result) > 0:
                if s_li[1] == rs.get("director_name"):
                    bl = True
        if bl == False:
            result.append({
                "did": len(result) + 1,
                "director_name": s_li[1],
            })
    data = pd.DataFrame(result)
    pd.DataFrame(data).to_csv('./data/director.csv',index=False)

def createMovie_csv():
    path1 = './data/movie.csv'
    path2 = './data/director.csv'
    ratings = pd.read_csv(path1, names=None)
    ratings2 = pd.read_csv(path2, names=None)
    ratings_li = ratings.values.tolist()
    ratings2_li = ratings2.values.tolist()
    results = []
    for now_r_li in ratings_li:
        director_name = now_r_li[1]
        for now_r2_li in ratings2_li:
            if now_r_li[1] == now_r2_li[1]:
                director_name = now_r2_li[0]
        results.append({
            "mid": now_r_li[0],
            "director_name": director_name,
            "actor_1_name": now_r_li[2],
            "actor_2_name": now_r_li[3],
            "actor_3_name": now_r_li[4],
            "genres": now_r_li[5],
            "movie_title": now_r_li[6],
        })
    data = pd.DataFrame(data=results)
    pd.DataFrame(data).to_csv('./data/movie.csv', index=False)

def createRecord_csv():
    path1 = './data/movie.csv'
    ratings = pd.read_csv(path1, names=None)
    ratings_li = ratings.values.tolist()
    results = []
    for now_r_li in ratings_li:
        results.append({
            "mid": now_r_li[0],
            "did": now_r_li[1],
            "count": 0,
        })
    data = pd.DataFrame(data=results)

    pd.DataFrame(data).to_csv('./data/record.csv', index=False)


# Check whether the movie exists in the movie table and director table based on the movie information. If the movie does not exist, just added it
def judgmentMovie(movieName,directorName,genresList):
    path1 = './data/movie.csv'
    path2 = './data/director.csv'
    path3 = './data/record.csv'

    movie = pd.read_csv(path1, names=None)
    director = pd.read_csv(path2, names=None)
    record = pd.read_csv(path3, names=None)

    movieList = movie.values.tolist()
    directorList = director.values.tolist()
    recordList = record.values.tolist()
    bl_director=False
    bl_movie=False
    bl_record=False
    did=len(directorList) + 1
    mid=len(movieList)+1
    count=0

    # Converts the type array to a string for storage
    genres=""
    for item in genresList:
        if genres!= "":
            genres+=" "+item
        else:
            genres=item
    if genres=="":
        genres="Null"

    for item in directorList:
        if item[1]==directorName:
            bl_director=True
            did = item[0]
    for item in movieList:
        if item[6]==movieName:
            bl_movie=True
            mid=item[0]
    index=0
    now_index=0
    for item in recordList:
        if item[0]==did and item[1]==mid:
            count=item[2]+1
            now_index=index
            bl_record=True
        index = index + 1

    if bl_director==False:
        nowData = ['']
        nowData[0] = (did,directorName)
        data = pd.DataFrame(nowData)
        pd.DataFrame(data).to_csv('./data/director.csv', index=False,mode='a+',header=False)
    if bl_movie==False:
        nowData=['']
        nowData[0]=(mid,did,"Null","Null","Null",genres,movieName)
        data = pd.DataFrame(nowData)
        pd.DataFrame(nowData).to_csv('./data/movie.csv', index=False, mode='a+', header=False)

    if bl_record==False:
        count=1
        nowData = ['']
        nowData[0] =(did,mid,count)
        data = pd.DataFrame(nowData)
        pd.DataFrame(nowData).to_csv('./data/record.csv', index=False, mode='a+', header=False)
    else:
        recordList[now_index]=[did,mid,count]
        data = pd.DataFrame(data=recordList)
        pd.DataFrame(data).to_csv('./data/record.csv', index=False)
    return did

# Get the most similar director information
def topn_simusers(did, n,pd_users):
    users = pd_users.loc[did,:].sort_values(ascending = False)
    topn_users = users.iloc[:n,]
    topn_users = topn_users.rename('score')
    #print("Similar actor as actor:", did)
    return topn_users

# Build matrix
def createDataFrame():
    path = './data/now_data.csv'
    ratings = pd.read_csv(path, names=None)
    rp = ratings.pivot_table(columns='mid', index='did', values='matching')
    rp = rp.fillna(0)
    rp_mat = np.matrix(rp)
    m, n = rp.shape
    mat_users = np.zeros((m, m))  # Two dimensional array, put the small one here
    # Movie director similarity matrix (1- corrected cosine similarity = corrected cosine distance)
    for i in range(m):
        for j in range(m):
            if i != j:
                mat_users[i][j] = (1 - cosine(np.array(rp_mat[i, :])[0] - np.mean(rp_mat[:, j]),
                                              np.array(rp_mat[j, :])[0] - np.mean(rp_mat[:, j])))
            else:
                mat_users[i][j] = 0
    # Build the dataframe by obtained matrix
    pd_users = pd.DataFrame(mat_users, index=rp.index, columns=rp.index)
    return pd_users

# Generates the current movie table
def crateNowData(cd_title,cd_gener_list,did):
    path1 = './data/movie.csv'
    path2 = './data/record.csv'
    ratings = pd.read_csv(path1, names=None)
    record = pd.read_csv(path2, names=None)
    ratings_li = ratings.values.tolist()
    record_li = record.values.tolist()
    movieList = []
    generList = []
    for now_r_li in ratings_li:
        matching = 0
        # Gets the current number of movie hits
        for record in record_li:
            if now_r_li[0] == record[1]:
                matching = record[2] * 0.1
        # Check whether the names are similar
        xsd_name = (SequenceMatcher(None, cd_title, now_r_li[6]).ratio())
        if xsd_name > 0.5:
            matching = matching + xsd_name * 10

        # Compare whether the topic is similar
        now_gener = now_r_li[5].split(" ")
        for gener in now_gener:
            for cd_gener in cd_gener_list:
                if (gener == cd_gener):
                    matching = matching + 1
        if matching > 1:
            movieList.append({
                "did": now_r_li[1],
                "mid": now_r_li[0],
                "matching": matching
            })
    data = pd.DataFrame(data=movieList).sort_values("did")
    pd.DataFrame(data).to_csv('./data/now_data.csv', index=False)

# Query movie data based on did
def getMovieByDid(did):
    path1 = './data/movie.csv'
    ratings = pd.read_csv(path1, names=None,usecols=["director_name","movie_title"])
    ratings_li = ratings.values.tolist()
    list=[]
    for li in ratings_li:
        #print(str(li[0])==str(did))
        if str(li[0])==str(did):
            list.append(li[1])
    return list

@app.route('/remod', methods=['GET', 'POST'])
def remod():
    data=json.loads(request.get_data().decode("utf-8"))
    directorName = data.get("directorName")
    movieName = data.get("movieName")
    genresList=data.get("genresList")
    did=judgmentMovie(movieName=movieName,directorName=directorName,genresList=genresList)
    # Compare the similarity of movie titles
    crateNowData(cd_title=movieName,cd_gener_list=genresList,did=did)
    pd_users=createDataFrame()
    simusers=topn_simusers(did=did,n=3,pd_users=pd_users)
    simuser_list=str(simusers).split("\n")
    index=0
    results_list=[]
    for simuser in simuser_list:
        if(index!=0 and index<(len(simuser_list)-1)):
            results_list.append(getMovieByDid(simuser.split(" ")[0]))
        index = index + 1
    return results_list


# Query all reviews for the current movie number
@app.route('/comments/<string:mid>', methods=['GET'])
def comments(mid):
    connection = getCursor()
    connection.execute(f"SELECT * FROM comment where mid='{mid}';")
    comment_list = connection.fetchall()
    #print(comment_list)
    return {"data": {"commentList": comment_list}, "status_code": HTTPStatus.OK, "message": "successfully"}

# Query the user name based on the id
@app.route('/user/<string:uid>', methods=['GET'])
def getuser(uid):
    connection = getCursor()
    connection.execute(f"SELECT username FROM users where uid='{uid}';")
    user = connection.fetchone()
    return {"data": {"user": user}, "status_code": HTTPStatus.OK, "message": "successfully"}


# Comment
@app.route('/comment', methods=['POST'])
@login_required
def addComment():
    connection = getCursor()
    content = request.form.get("content")
    start_time = request.form.get("start_time")
    mid = request.form.get("mid")
    connection.execute(f"""insert into comment(content,`start_time`,mid,uid)values('{content}','{start_time}','{mid}',{g.id})""")
    return {"status_code": HTTPStatus.OK, "message": "successfully comment"}


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)


