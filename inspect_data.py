import pandas as pd
import json

df = pd.read_excel('SmartAllocate_600_Employee_Database_Updated.xlsx')
print('Columns and nulls:')
print(df.isnull().sum())

print('\nUnique counts & samples for each column:')
for c in df.columns:
    print(f"\n--- {c} (unique={df[c].nunique()}) ---")
    if df[c].nunique() <= 15:
        print(df[c].value_counts().to_dict())
    else:
        print('Sample:', df[c].head(5).tolist())

