import numpy as np
import pandas as pd

data_arrests = pd.read_csv('NYPD_arrests.csv', low_memory=False)
# data_complaints = pd.read_csv('NYPD_complaints.csv', low_memory=False)
data_arrests.set_index('ARREST_DATE', inplace=True)
start_date = '12/31/2016'
end_date = '01/01/2016'
df = data_arrests.copy(deep=True)
df = df[start_date:end_date]
print(len(df.index))
file_name = 'arrest_2016.csv'
df.to_csv(file_name, sep=',')

# check files at https://drive.google.com/drive/folders/1sVLEUSCsNlOUQJ-1TZoRnGZO0M7mSU_x?usp=sharing
