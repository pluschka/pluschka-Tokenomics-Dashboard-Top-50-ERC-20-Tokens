"""
## Get Top 50 ERC-20 Tokens from CoinMarketCap
"""
import os
from dotenv import load_dotenv
import requests
import pandas as pd
import re

# load key
load_dotenv()
api_key = os.getenv("X-CMC_PRO_API_KEY")
if api_key is None:
    raise ValueError("API Key not found")


def get_erc20(api_key: str, limit: int = 50) -> pd.DataFrame:
    url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest"
    params = {"start": 1, "limit": 500, "convert": "USD"}
    headers = {"X-CMC_PRO_API_KEY": api_key, "Accepts": "application/json"}

    data = requests.get(url, params=params, headers=headers).json()["data"]
    erc20 = [
        {
            "id": c["id"],
            "symbol": c["symbol"],
            "name": c["name"],
            "price": c["quote"]["USD"]["price"],
            "market_cap": c["quote"]["USD"]["market_cap"],
            "circulating_supply": c["circulating_supply"],
            "total_supply": c["total_supply"],
            "max_supply": c["max_supply"],
            "contract": c["platform"]["token_address"]
        }
        for c in data
        if c.get("platform") and c["platform"]["slug"] == "ethereum"
    ]
    return pd.DataFrame(erc20[:limit])


erc20_data = get_erc20(api_key, 50)

erc20_data['name'] = erc20_data['name'].apply(lambda x: re.sub(r' ', r'_', x))

erc20_data.to_csv("erc20_data.csv", index=False, encoding="utf-8")
