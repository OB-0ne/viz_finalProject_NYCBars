import pandas as pd
import numpy as np
import geopandas as gpd


def mapPrecincts2Bars():
    
    #read the file
    precict_data = gpd.read_file("data/PolicePrecincts/geo_export_d3b370ea-1063-43ab-be43-0fcd056f4f68.shp")
    bar_data = pd.read_csv('data/bar_locations.csv')
    bar_data = gpd.GeoDataFrame(bar_data, geometry=gpd.points_from_xy(bar_data.Longitude, bar_data.Latitude))

    #merge on the two
    bar_data = gpd.sjoin(bar_data, precict_data, op='within') 

    #drop all the unnecessary columns
    bar_data = bar_data.drop('geometry',axis=1)
    bar_data = bar_data.drop('index_right',axis=1)
    bar_data = bar_data.drop('shape_area',axis=1)
    bar_data = bar_data.drop('shape_leng',axis=1)

    #save the data as csv
    pd.DataFrame(bar_data).to_csv('data/processed/bar_locations.csv', index=False)    
