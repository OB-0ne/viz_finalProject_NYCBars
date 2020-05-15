import pandas as pd


def getMainData():

    #get the NYC bar location by points
    data = getBarLocation()

    return data

def getBarLocation():

    #read data files
    bar_data = pd.read_csv("data/processed/bar_locations.csv")
    
    #needed column names
    col = ['Longitude','Latitude']

    #get only the needed columns
    bar_data = bar_data[col].values.tolist()

    return bar_data