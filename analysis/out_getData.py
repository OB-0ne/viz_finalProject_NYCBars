import pandas as pd


def getMainData():

    data = {}

    #get the NYC bar location by points
    data["BarLoc"] = getBarLocation()

    #get complain data for pie chart
    data["ComplainPie"] = getComplainData()

    return data

def getBarLocation():

    #read data files
    bar_data = pd.read_csv("data/processed/bar_locations.csv")
    
    #needed column names
    col = ['index','Longitude','Latitude','Borough']

    #get only the needed columns
    bar_data = bar_data[col].values.tolist()
    #bar_data = bar_data[col]

    return bar_data

def getComplainData():

    #read the data
    complain_data = pd.read_csv("data/processed/complain_count.csv")

    #get data for the whole year for all precincts
    groupby_col = ['Location Type']
    complain_data = complain_data.groupby(groupby_col).agg({'count'}).reset_index()
    complain_data.columns = complain_data.columns.droplevel(1)

    #needed columns
    col = ["ComplainCount"]

    return complain_data[col].values.tolist()

