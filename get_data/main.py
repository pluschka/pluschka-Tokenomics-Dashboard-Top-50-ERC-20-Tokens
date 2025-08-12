import asyncio
import os
import pandas as pd
import re
from pathlib import Path
import json
from dotenv import load_dotenv
from functions import get_erc20, research_agent, extract_data

"""
Get Top 50 ERC-20 Tokens from CoinMarketCap.
"""
# load key
load_dotenv()
api_key = os.getenv("X-CMC_PRO_API_KEY")
if api_key is None:
    raise ValueError("API Key not found")

erc20_data = get_erc20(api_key, 50)

# rename tokennames because later they are used as filenames
erc20_data['name'] = erc20_data['name'].apply(lambda x: re.sub(r' ', r'_', x))

erc20_data.to_csv(Path("data/erc20_data") / "erc20_data.csv",
                  index=False,
                  encoding="utf-8")

"""
Get information about the tokenomics subjects class, governance, distribution,
emissiontype, incentive, price and market, risk and security, vesting and cliff
with OpenAI Agents SDK.
"""

load_dotenv(override=True)
api_key = os.getenv("OPENAI_API_KEY")
if api_key is None:
    raise ValueError("API Key not found")


async def main():
    total_tokens = len(erc20_data)

    tokenomics_subjects = [
        "class",
        "governance",
        "distribution",
        "emissiontype",
        "incentive",
        "price_and_market",
        "risk_and_security",
        "vesting_and_cliff"
    ]

    # for each token in the list research all subjects
    for token_loc in range(1, total_tokens + 1):
        for subject in tokenomics_subjects:
            print(f"\n--- Processing {token_loc}/{total_tokens} {subject} ---")
            try:
                await research_agent(tokenomics_subject=subject,
                                     token_loc=token_loc)
                extract_data(tokenomics_subject=subject, token_loc=token_loc)
                await asyncio.sleep(1)
            except Exception as e:
                print(f"Error {token_loc}, Subject '{subject}': {e}")
                await asyncio.sleep(2)


if __name__ == "__main__":
    asyncio.run(main())

"""
Join the subject jsons to the erc20_data as final data set.
"""

tokenomics_subjects = [
    "class",
    "governance",
    "distribution",
    "emissiontype",
    "incentive",
    "price_and_market",
    "risk_and_security",
    "vesting_and_cliff"
]

all_token_dfs = []

# for each token
for token in erc20_data["name"]:

    subject_dfs = []

    # for each subject for each token join the rows
    for subject in tokenomics_subjects:
        file_path = Path("data/json_output") / f"{subject}_{token}_result.json"

        with open(file_path, "r", encoding="utf-8") as f:
            json_data = json.load(f)

        df = pd.DataFrame(json_data["tokens"])

        # delete dulicate columns
        if subject == "class":
            df = df.rename(columns={"Token": "name"})
        else:
            df = df.drop(columns="Token")

        # rename duplicate column
        if subject == "price_and_market":
            df = df.rename(columns={"Inflationary_Supply":
                                    "Inflationary_Supply_Price_and_Market"})

        subject_dfs.append(df)

    # join the subjects for each token
    merged_subjects = pd.concat(subject_dfs, axis=1)

    all_token_dfs.append(merged_subjects)

df_all_subjects = pd.concat(all_token_dfs, axis=0, ignore_index=True)

# join each token row to erc20_data
erc20_full_data = erc20_data.merge(df_all_subjects, how="left", on="name")

erc20_full_data["name"] = erc20_full_data["name"].apply(
    lambda x: re.sub(r"_", r" ", x)
)

erc20_full_data.to_csv(
    Path("data/result") / "erc20_full_data.csv",
    index=False
)

erc20_full_data.to_json(
    Path(
        r"D:\Tokenomics\frontend\tokenomics-project\src\data"
    ) / "erc20_full_data.json",
    orient="records",
    force_ascii=False,
    indent=2
)
