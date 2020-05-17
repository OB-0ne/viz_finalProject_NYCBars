import pandas as pd
from collections import Counter


def getMainData():

    data = {}

    #get the NYC bar location by points
    data["BarLoc"] = getBarLocation()

    #get complain data for pie chart
    data["ComplainPie"] = getComplainData()

    #get City counts for bars
    data["BarCities"] = getCityData()

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


def getCityData():
    # read city data 
    city_data = pd.read_csv('data/processed/party_in_nyc.csv')
    city_data = city_data.dropna()

    # needed columns
    col = ['City']
    city_data = city_data[col].values.tolist()
    new_city_data = list()
    for i in range(len(city_data)):
        temp = city_data[i][0]
        new_city_data.append(temp)

    keys = Counter(new_city_data).keys()
    values = Counter(new_city_data).values()
    c = zip(*sorted(zip(values, keys)))
    keys, values = [list(tuple) for tuple in c]
    keys = keys[::-1]
    values = values[::-1]
    needed_keys = keys[:6]
    needed_values = values[:6]
    f_list = list()
    for i in range(6):
        f_list.append([needed_keys[i], needed_values[i]])

    return f_list
