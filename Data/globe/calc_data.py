import os
import pandas as pd

total = 0
for file in os.listdir("./globe/bulkdata"):
    df = pd.read_csv("./globe/bulkdata/" + file)
    total += len(df)

print(total)
