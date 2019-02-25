# -*- coding: utf-8 -*-
"""
Routes and views for the flask application.
"""

from datetime import datetime
from flask import render_template,Flask,jsonify,abort,request,send_from_directory,url_for,send_file
from WebData_Tool import app
import time
import urllib
import json
from   werkzeug import secure_filename
import pandas as pd
import numpy  as np
import os
import sys
import xlrd
from   concurrent.futures import ThreadPoolExecutor
from   WebData_Tool.bckend01 import bckend01



ALLOWED_EXTENSIONS = set(['txt', 'csv', 'png', 'jpg', 'jpeg', 'html','xls'])
app.config['UPLOAD_FOLDER2'] = 'WebData_Tool/static/uploads/tc'

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


@app.route('/')
@app.route('/home')
def home():
    """Renders the home page."""
    return render_template(
        'index.html',
        title='Home Page',
        year=datetime.now().year,
    )


@app.route('/up_00', methods=['POST'])
def post_fileup00():
    """Renders the about page."""
    jsonstr = []
    if request.method == 'POST':
        if  os.path.exists(app.config['UPLOAD_FOLDER2']):                
            for i in os.listdir(app.config['UPLOAD_FOLDER2']):
                     os.remove(app.config['UPLOAD_FOLDER2']+'/'+i)                    
        file02 = request.files.getlist('file02')
        for file02_item in file02:
            if file02_item and allowed_file(file02_item.filename):
                filename02 = secure_filename(file02_item.filename)   
                path_url02 = app.config['UPLOAD_FOLDER2'] +'/'+filename02
                file02_item.save(path_url02)
    jsonstr.append( {"status":1})
    return jsonify(jsonstr)


@app.route('/stsup01', methods=['PUT'])
def put_stsup01():
    return jsonify({"status":1})


@app.route('/submit01', methods=['POST'])
def post_submit01():    
    jsonstr = []
    #executor = ThreadPoolExecutor(2)    
    if request.method == 'POST':
        try:
            #executor.submit(bckend01,app.config['UPLOAD_FOLDER2']);
            bckend01(app.config['UPLOAD_FOLDER2'])
        except:
            jsonstr.append( {"status":0})
            return jsonify(jsonstr)
    jsonstr.append( {"status":1})
    return jsonify(jsonstr)

@app.route('/downloads/', methods=['GET'])
def downloads():
    filename = 'report_result.csv'
    #return send_file('static/downloads/tc/'+filename, attachment_filename=filename)
    return send_file('static/downloads/tc/'+filename, attachment_filename=filename)







    
