import pandas as pd
import numpy as np
import geopandas as gpd


def mapPrecincts2Bars():
    
    #read the file
    precict_data = gpd.read_file("data/PolicePrecincts/geo_export_d3b370ea-1063-43ab-be43-0fcd056f4f68.shp")
    bar_data = pd.read_csv('data/bar_locations.csv')
    bar_data['index'] = bar_data.index
    bar_data = bar_data.reset_index(drop=True)
    bar_data = bar_data[bar_data['Borough']!='Unspecified']
    bar_data = gpd.GeoDataFrame(bar_data, geometry=gpd.points_from_xy(bar_data.Longitude, bar_data.Latitude))

    #merge on the two
    bar_data = gpd.sjoin(bar_data, precict_data, op='within') 

    #drop all the unnecessary columns
    bar_data = bar_data.drop('geometry',axis=1)
    bar_data = bar_data.drop('index_right',axis=1)
    bar_data = bar_data.drop('shape_area',axis=1)
    bar_data = bar_data.drop('shape_leng',axis=1)

    #save the data as csv
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

def makeArrestData():
    
    #read the file
    arrest_data = pd.read_csv('data/arrest_2016.csv')
    #add month column
    arrest_data['Month'] = pd.DatetimeIndex(arrest_data['ARREST_DATE']).month

    #get the only necessary columns
    cols = ['ARREST_PRECINCT','OFNS_DESC']
    arrest_data = arrest_data[cols]

    #felony crimes
    felony_crimes = ['DANGEROUS DRUGS','FELONY ASSAULT','DANGEROUS WEAPONS','CRIMINAL MISCHIEF & RELATED OFFENSES','ROBBERY','GRAND LARCENY','FORGERY','INTOXICATED & IMPAIRED DRIVING','OTHER OFFENSES RELATED TO THEFT','CRIMINAL TRESPASS']
    #misdemeanor crimes
    misd_crimes = ['ASSAULT 3 & RELATED OFFENSES','OTHER OFFENSES RELATED TO THEFT','PETIT LARCENY','VEHICLE AND TRAFFIC LAWS','MISCELLANEOUS PENAL LAW','OFFENSES AGAINST PUBLIC ADMINISTRATION','CRIMINAL TRESPASS']

    #drop all the unnecessary columns
    arrest_felony_data = arrest_data[arrest_data['OFNS_DESC'].isin(felony_crimes)]
    arrest_misd_data = arrest_data[arrest_data['OFNS_DESC'].isin(misd_crimes)]


    #pivot the table to get arrest counts
    arrest_felony_data = arrest_felony_data.pivot_table(values=['OFNS_DESC'],index='ARREST_PRECINCT',columns=['OFNS_DESC'], aggfunc=len,fill_value=0)
    arrest_felony_data['precinct'] = arrest_felony_data.index
    arrest_felony_data = arrest_felony_data.reset_index(drop=True)

    arrest_misd_data = arrest_misd_data.pivot_table(values=['OFNS_DESC'],index='ARREST_PRECINCT',columns=['OFNS_DESC'], aggfunc=len,fill_value=0)
    arrest_misd_data['precinct'] = arrest_misd_data.index
    arrest_misd_data = arrest_misd_data.reset_index(drop=True)

    
    #save the data as csv
    arrest_felony_data.to_csv('data/processed/arrest_felony.csv',index=False)
    arrest_misd_data.to_csv('data/processed/arrest_misd.csv',index=False)

def makePCAData1():

    #read the file
    arrest_data = pd.read_csv('data/arrest_2016.csv')
    complain_data = pd.read_csv('data/processed/complain_count.csv')
    bar_data = pd.read_csv('data/processed/bar_locations.csv')
    
    #add month column to arrests
    arrest_data['Month'] = pd.DatetimeIndex(arrest_data['ARREST_DATE']).month

    #crime type columns
    felony_crimes = ['DANGEROUS DRUGS','FELONY ASSAULT','DANGEROUS WEAPONS','CRIMINAL MISCHIEF & RELATED OFFENSES','ROBBERY','GRAND LARCENY','FORGERY','INTOXICATED & IMPAIRED DRIVING','OTHER OFFENSES RELATED TO THEFT','CRIMINAL TRESPASS']
    misd_crimes = ['ASSAULT 3 & RELATED OFFENSES','OTHER OFFENSES RELATED TO THEFT','PETIT LARCENY','VEHICLE AND TRAFFIC LAWS','MISCELLANEOUS PENAL LAW','OFFENSES AGAINST PUBLIC ADMINISTRATION','CRIMINAL TRESPASS']

    #selected columns
    arrest_col = ['OFNS_DESC','ARREST_PRECINCT','Month']
    arrest_col_group = ['ARREST_PRECINCT','Month']

    complain_col = ['precinct','Month','ComplainCount']
    complain_col_group = ['precinct','Month']

    bar_col = ['precinct','Borough','City']
    bar_col_group = ['precinct','Borough'] 
    bar_col_merge = ['precinct'] 

    #select only the needed columns
    arrest_data = arrest_data[arrest_col]
    complain_data = complain_data[complain_col]
    bar_data = bar_data[bar_col]

    #make the PCA data, by counting the needed data and mergig on precinct number and month data
    pca_data = complain_data.groupby(complain_col_group).agg({'sum'}).reset_index()
    pca_data = pca_data.merge(arrest_data[arrest_data['OFNS_DESC'].isin(felony_crimes)].groupby(arrest_col_group).agg({'count'}).reset_index(),left_on=complain_col_group,right_on=arrest_col_group)
    pca_data.rename(columns={'OFNS_DESC':'FelonyCrimes'}, inplace=True)
    pca_data = pca_data.merge(arrest_data[arrest_data['OFNS_DESC'].isin(misd_crimes)].groupby(arrest_col_group).agg({'count'}).reset_index(),on=arrest_col_group)
    pca_data.rename(columns={'OFNS_DESC':'MisdimCrimes'}, inplace=True)
    pca_data = pca_data.merge(bar_data.groupby(bar_col_group).agg({'count'}).reset_index(),on=bar_col_merge)
    pca_data.rename(columns={'City':'BarCount'}, inplace=True)
    
    #removing extra columns and levels
    pca_data = pca_data.drop('ARREST_PRECINCT',axis=1)
    pca_data.columns = pca_data.columns.droplevel(1)

    #save the file
    pca_data.to_csv('data/processed/pca1_monthly.csv',index=False)

def makePCAData2():

    #read the file
    arrest_data = pd.read_csv('data/arrest_2016.csv')
    complain_data = pd.read_csv('data/processed/complain_count.csv')
    bar_data = pd.read_csv('data/processed/bar_locations.csv')
    
    #add month column to arrests
    arrest_data['Month'] = pd.DatetimeIndex(arrest_data['ARREST_DATE']).month

    #crime type columns
    felony_crimes = ['DANGEROUS DRUGS','DANGEROUS WEAPONS','ROBBERY','GRAND LARCENY','INTOXICATED & IMPAIRED DRIVING','OTHER OFFENSES RELATED TO THEFT']
    misd_crimes = ['ASSAULT 3 & RELATED OFFENSES','OTHER OFFENSES RELATED TO THEFT','PETIT LARCENY']
    complain_types = ['Club/Bar/Restaurant']

    #filter the arrest data further
    #arrest_data = arrest_data[arrest_data['AGE_GROUP'].isin(['18-24'])]

    #selected columns
    arrest_col = ['OFNS_DESC','ARREST_PRECINCT','Month']
    arrest_col_group = ['ARREST_PRECINCT','Month']

    complain_col = ['precinct','Month','ComplainCount']
    complain_col_group = ['precinct','Month']

    bar_col = ['precinct','Borough','City']
    bar_col_group = ['precinct','Borough'] 
    bar_col_merge = ['precinct'] 

    #select only the needed columns
    arrest_data = arrest_data[arrest_col]
    complain_data = complain_data[complain_data['Location Type'].isin(complain_types)]
    complain_data = complain_data[complain_col]
    bar_data = bar_data[bar_col]

    #make the PCA data, by counting the needed data and mergig on precinct number and month data
    pca_data = complain_data.groupby(complain_col_group).agg({'sum'}).reset_index()
    pca_data = pca_data.merge(arrest_data[arrest_data['OFNS_DESC'].isin(felony_crimes)].groupby(arrest_col_group).agg({'count'}).reset_index(),left_on=complain_col_group,right_on=arrest_col_group)
    pca_data.rename(columns={'OFNS_DESC':'FelonyCrimes'}, inplace=True)
    pca_data = pca_data.merge(arrest_data[arrest_data['OFNS_DESC'].isin(misd_crimes)].groupby(arrest_col_group).agg({'count'}).reset_index(),on=arrest_col_group)
    pca_data.rename(columns={'OFNS_DESC':'MisdimCrimes'}, inplace=True)
    pca_data = pca_data.merge(bar_data.groupby(bar_col_group).agg({'count'}).reset_index(),on=bar_col_merge)
    pca_data.rename(columns={'City':'BarCount'}, inplace=True)
    
    #removing extra columns and levels
    pca_data = pca_data.drop('ARREST_PRECINCT',axis=1)
    pca_data.columns = pca_data.columns.droplevel(1)

    #save the file
    pca_data.to_csv('data/processed/pca2_monthly.csv',index=False)
    

def makeArrestByComplaints():

    #read the file
    arrest_data = pd.read_csv('data/arrest_2016.csv')
    complain_data = pd.read_csv('data/processed/complain_count.csv')
    bar_data = pd.read_csv('data/processed/bar_locations.csv')
    
    #add month column to arrests
    arrest_data['Month'] = pd.DatetimeIndex(arrest_data['ARREST_DATE']).month

    #crime type columns
    crimes = ['DANGEROUS DRUGS','FELONY ASSAULT','DANGEROUS WEAPONS','CRIMINAL MISCHIEF & RELATED OFFENSES','ROBBERY','GRAND LARCENY','FORGERY','INTOXICATED & IMPAIRED DRIVING','OTHER OFFENSES RELATED TO THEFT','CRIMINAL TRESPASS','ASSAULT 3 & RELATED OFFENSES','OTHER OFFENSES RELATED TO THEFT','PETIT LARCENY','VEHICLE AND TRAFFIC LAWS','MISCELLANEOUS PENAL LAW','OFFENSES AGAINST PUBLIC ADMINISTRATION','CRIMINAL TRESPASS']
    
    #selected columns
    arrest_col = ['OFNS_DESC','ARREST_PRECINCT','Month']
    arrest_col_group = ['ARREST_PRECINCT','Month']

    complain_col = ['precinct','Month','ComplainCount']
    complain_col_group = ['precinct','Month']

    bar_col = ['precinct','Borough','City']
    bar_col_group = ['precinct','Borough'] 
    bar_col_merge = ['precinct'] 

    #select only the needed columns
    arrest_data = arrest_data[arrest_col]
    arrest_data = arrest_data[arrest_data['OFNS_DESC'].isin(crimes)]
    complain_data = complain_data[complain_col]
    bar_data = bar_data[bar_col]

    #make the PCA data, by counting the needed data and mergig on precinct number and month data
    pca_data = complain_data.merge(bar_data,on=bar_col_merge)
    pca_data = complain_data.groupby(complain_col_group).agg({'sum'}).reset_index()
    pca_data = pca_data.merge(arrest_data.groupby(arrest_col_group).agg({'count'}).reset_index(),left_on=complain_col_group,right_on=arrest_col_group)
    pca_data.rename(columns={'OFNS_DESC':'ArrestCount'}, inplace=True)
    pca_data = pca_data.merge(bar_data.groupby(bar_col_group).agg({'count'}).reset_index(),on=bar_col_merge)
    
    print(pca_data)

    #removing extra columns and levels
    pca_data = pca_data.drop('ARREST_PRECINCT',axis=1)
    pca_data = pca_data.drop('City',axis=1)
    pca_data.columns = pca_data.columns.droplevel(1)

    #save the file
    pca_data.to_csv('data/processed/arrest2complain.csv',index=False)
    


#mapPrecincts2Bars()
#mapPrecincts2Complains()

#makePrecinctComplains()
#makeArrestData()
#makePCAData1()
makePCAData2()
#makeArrestByComplaints()