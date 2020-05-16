from flask import Flask, render_template, request, jsonify
import json
import pandas as pd

from analysis.out_getData import getMainData 

app = Flask(__name__)





@app.route("/")
def home():   
    return render_template("index.html")

if __name__ == "__main__":
    
    app.run(debug=True)


#--------------------------------------------
# All the GET calls go here
#--------------------------------------------

@app.route("/updateData")
def updateData():
    
    #added the neede data to the dictionary
    data = getMainData()
    
    return data