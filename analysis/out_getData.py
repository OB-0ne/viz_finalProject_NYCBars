import pandas as pd
import numpy as np
from collections import Counter

from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler


def getMainData(month_list=[]):

    data = {}
	    
    # if len(month_range)>0:
    #    complain_data = complain_data[complain_data['precinct'].isin(precinct_list)]
    #get the NYC bar location by points
    
    data["BarLoc"] = getBarLocation()

    #get complain data for pie chart
	data["ComplainPie"] = getComplainData([],month_list)

    #get City counts for bars
    #data["BarCities"] = getCityData()
	data["BarCities"] = getArrestByComplaints(6,10, [],month_list)

    #get City counts for bars
    data["PCA1"] = getPCAScatterData('pca1_monthly', month_list)
    data["PCA2"] = getPCAScatterData('pca2_monthly', month_list)

    return data

def getMainData_Cate(precint_list, month_range=[]):

    data = {}

    #get complain data for pie chart
    data["ComplainPie"] = getComplainData(precint_list, month_range)

    #get City counts for bars
    #data["BarCities"] = getCityData()
    data["BarCities"] = getArrestByComplaints(6,10,precint_list, month_range)

    return data

def getBarLocation():

    #read data files
    bar_data = pd.read_csv("data/processed/bar_locations.csv")
    
    #needed column names
    col = ['precinct','Longitude','Latitude','Borough']

    #get only the needed columns
    bar_data = bar_data[col].values.tolist()
    #bar_data = bar_data[col]

    return bar_data

def getComplainData(precinct_list=[], month_range=[]):

    #read the data
    complain_data = pd.read_csv("data/processed/complain_count.csv")

    #filter as needed on the data
    if len(precinct_list)>0:
        complain_data = complain_data[complain_data['precinct'].isin(precinct_list)]
    
    print(month_range)
    if len(month_range)>0:
        complain_data = complain_data[complain_data['Month'].isin(month_range)]
    
    #get data for the whole year for all precincts
    groupby_col = ['Location Type']
    complain_data = complain_data.groupby(groupby_col).agg({'count'}).reset_index()
    complain_data.columns = complain_data.columns.droplevel(1)

    #needed columns
    col = ["ComplainCount","Location Type"]
    sort_col = ["ComplainCount"]

    return complain_data[col].sort_values(by=sort_col,ascending=False).values.tolist()


def getCityData(month_range=[]):
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

def getArrestByComplaints(top_n, per_n_people,precinct_list=[], month_range=[]):

    #read needed data
    main_data = pd.read_csv('data/processed/arrest2complain.csv')

    #filter as needed on the data
    if len(precinct_list)>0:
        main_data = main_data[main_data['precinct'].isin(precinct_list)]
    
    if len(month_range)>0:
        main_data = main_data[main_data['Month'].isin(month_range)]

    #needed columns
    cols_groupby = ['precinct','Borough']
    cols = ['precinct','ComplainCount','ArrestCount','Borough']
    return_col = ['precinct','ArrestPerComplain','Borough']

    #group by for all the needed data
    main_data = main_data[cols].groupby(cols_groupby).agg({'sum'}).reset_index()
    
    #calculate arrests per n people and sort
    main_data['ArrestPerComplain'] = (main_data['ArrestCount'] * per_n_people)/main_data['ComplainCount']
    main_data['ArrestPerComplain'] = main_data['ArrestPerComplain'].round(2)
    main_data = main_data.sort_values(by=['ArrestPerComplain'])

    #return needed data
    return main_data[return_col].head(top_n).values.tolist()


def getPCAScatterData(filename, month_range=[]):

    #read the PCA data
    pca_data = pd.read_csv('data/processed/'+ filename +'.csv')
    groupby_col = ['precinct','Borough']
    cols = ['ComplainCount','FelonyCrimes','MisdimCrimes','BarCount']
    return_col = ['precinct','PC1','PC2','Borough']
    
    if len(month_range)>0:
        pca_data = pca_data[pca_data['Month'].isin(month_range)]
    
    #group up on monthly level for now
    pca_data = pca_data.groupby(groupby_col).agg({ 'ComplainCount':'sum',
                                                    'FelonyCrimes':'sum',
                                                    'MisdimCrimes':'sum',
                                                    'BarCount':'mean'}).reset_index()

    #get the data work for PCA
    data = pca_data[cols]
    data = StandardScaler().fit_transform(data)
    pca = PCA(n_components= len(cols))
    principalComponents = pca.fit_transform(data)

    #Convert the outputs into a pandas dataframe again and merge with the original data
    principalComponents = pd.DataFrame(data = principalComponents, columns = get_PC_cols(len(principalComponents[0])))
    pca_data=pca_data.merge(principalComponents,left_index=True, right_index=True)

    #return the needed columns for plotting
    return pca_data[return_col].values.tolist()

def get_PC_cols(n_PC):
    
    col = []
    for i in range(n_PC):
        col.append('PC'+ str(i+1))

    return col
