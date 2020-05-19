from flask import Flask, render_template, request, jsonify
import json
import pandas as pd

from analysis.out_getData import getMainData 
from analysis.out_getData import getMainData_Cate

app = Flask(__name__)





@app.route("/")
def home():   
    return render_template("index.html")

if __name__ == "__main__":
    
    app.run(debug=True)


#--------------------------------------------
# All the GET calls go here
#--------------------------------------------

month_list = []

@app.route("/updateData/<data>")
def updateData(data):
    print('test')
    print(data)
    #check if reset values or update them
    if data == "reset":
        month_list = []
    else:
        #get the precint numbers as list
        month_list = [*range(int(data.split(",")[0]),int(data.split(",")[1])+1)]

    #added the neede data to the dictionary
    data = getMainData(month_list)

    return data


@app.route("/updateCateData/<data>")
def updateCateData(data):
    
    #check if reset values or update them
    if data == "reset":
        precint_list = []
    else:
        #get the precint numbers as list
        precint_list = data.split(",")

    #added the neede data to the dictionary
    data = getMainData_Cate(precint_list, month_list)
    
    return data
