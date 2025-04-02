import os
import pandas as pd

run_path= os.path.dirname(os.path.abspath(__file__))
os.chdir(run_path)

total = 0

for file in os.listdir("./bulkdata"):
    df = pd.read_csv("./bulkdata/" + file)
    total += len(df)

print(total)
