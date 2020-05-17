import pandas as pd
import numpy as np
import geopandas as gpd


def mapPrecincts2Bars():
    
    #read the file
    precict_data = gpd.read_file("data/PolicePrecincts/geo_export_d3b370ea-1063-43ab-be43-0fcd056f4f68.shp")
    bar_data = pd.read_csv('data/bar_locations.csv')
    bar_data['index'] = bar_data.index
    print(bar_data)
    bar_data = bar_data.reset_index(drop=True)
    print(bar_data)
    bar_data = gpd.GeoDataFrame(bar_data, geometry=gpd.points_from_xy(bar_data.Longitude, bar_data.Latitude))

    #merge on the two
    bar_data = gpd.sjoin(bar_data, precict_data, op='within') 

    #drop all the unnecessary columns
    bar_data = bar_data.drop('geometry',axis=1)
    bar_data = bar_data.drop('index_right',axis=1)
    bar_data = bar_data.drop('shape_area',axis=1)
    bar_data = bar_data.drop('shape_leng',axis=1)

    #save the data as csv
    print(bar_data)
    pd.DataFrame(bar_data).to_csv('data/processed/bar_locations.csv',index=False) 

def mapPrecincts2Complains():
    
    #read the file
    precict_data = gpd.read_file("data/PolicePrecincts/geo_export_d3b370ea-1063-43ab-be43-0fcd056f4f68.shp")
    bar_data = pd.read_csv('data/party_in_nyc.csv')
    bar_data = gpd.GeoDataFrame(bar_data, geometry=gpd.points_from_xy(bar_data.Longitude, bar_data.Latitude))

    #merge on the two
    bar_data = gpd.sjoin(bar_data, precict_data, op='within')

    #drop all the unnecessary columns
    bar_data = bar_data.drop('geometry',axis=1)
    bar_data = bar_data.drop('index_right',axis=1)
    bar_data = bar_data.drop('shape_area',axis=1)
    bar_data = bar_data.drop('shape_leng',axis=1)
    bar_data = bar_data.drop('Latitude',axis=1)
    bar_data = bar_data.drop('Longitude',axis=1)

    #save the data as csv
    bar_data = pd.DataFrame(bar_data)
    bar_data.to_csv('data/processed/party_in_nyc.csv', index=False)

def makePrecinctComplains():

    #read the data
    complain_data = pd.read_csv('data/processed/party_in_nyc.csv')

    #group by the precint and complain type
    groupby_col = ['Location Type','precinct','Month']

    #make a count columns
    complain_data['ComplainCount'] = complain_data['precinct']
    complain_data['Month'] = pd.DatetimeIndex(complain_data['Created Date']).month

    #group by the needed columns to get the complain counts
    complain_data = complain_data[groupby_col+['ComplainCount']].groupby(groupby_col).agg({'count'}).reset_index()
    complain_data.columns = complain_data.columns.droplevel(1)

    #save the data
    complain_data.to_csv('data/processed/complain_count.csv', index=False)


mapPrecincts2Bars()
#mapPrecincts2Complains()

makePrecinctComplains()