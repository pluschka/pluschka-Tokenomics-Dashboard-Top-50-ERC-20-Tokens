from agents import Agent, Runner, WebSearchTool
from pathlib import Path
import pandas as pd
from openai import OpenAI
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
import requests

"""
Get Top 50 ERC-20 Tokens from CoinMarketCap.
"""


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


"""
Get information about the tokenomics subjects class, governance, distribution,
emissiontype, incentive, price and market, risk and security, vesting and cliff
with OpenAI Agents SDK.
"""


async def research_agent(tokenomics_subject="emissiontype", token_loc=1):
    """
    Main research function to run an agent on a tokenomics topic for a subset
    of ERC20 tokens.
    """
    # load key
    load_dotenv(override=True)
    api_key = os.getenv("OPENAI_API_KEY")
    if api_key is None:
        raise ValueError("API Key not found")

    instruction_txt = f"{tokenomics_subject}_instruction.txt"

    # Load instruction text
    file_path = Path("instructions") / instruction_txt
    with file_path.open("r", encoding="utf-8") as f:
        instruction = f.read()

    # Load ERC20 token list
    start = token_loc - 1
    erc20_data = pd.read_csv(Path("data/erc20_data") / "erc20_data.csv")
    token = erc20_data['name'].iloc[start]

    # Build prompt
    prompt = f"""Please read the following instuctions carefully and analyze
                 the token {token}.
                 The Instructions: {instruction}
                 Do not add any explanation, heading, links, or markdown only
                 valid JSON!
                 The Column "Token" must match exactly the Tokenname: {token}!
                 """

    # Initialize agent
    agent = Agent(
        name="Tokenomics Agent",
        instructions=prompt,
        tools=[WebSearchTool()],
        model="gpt-4o"
    )

    # Run agent
    result = await Runner.run(agent, prompt)

    # Extract final output
    final_output = result.final_output

    # Save result to /data/text_output
    output_path = Path("data/text_output") / \
        f"{tokenomics_subject}_{token}_result.txt"
    output_path.write_text(final_output, encoding="utf-8")

    return final_output

"""
Extract the json file from the textfile of the agent.
"""


def extract_data(tokenomics_subject="emissiontype", token_loc=1):
    # load key
    load_dotenv(override=True)
    api_key = os.getenv("OPENAI_API_KEY")
    if api_key is None:
        raise ValueError("API Key not found")

    client = OpenAI(api_key=api_key)

    # System-Prompt
    prompt = """You are given the output of an AI agent that contains
unstructured text with a table or JSON-like section. Your task is to
extract that table or JSON object, validate its structure, and return
a clean JSON object.

Return only the validated JSON object. Strictly no markdown or extra text.
"""
    # Load ERC20 token list
    start = token_loc - 1
    erc20_data = pd.read_csv(Path("data/erc20_data") / "erc20_data.csv")
    token = erc20_data['name'].iloc[start]

    # read Agent-Output file
    output_path = Path("data/text_output") / \
        f"{tokenomics_subject}_{token}_result.txt"
    agent_output = output_path.read_text(encoding="utf-8")

    # load corresponding pydantic_class
    ModelClass = pydantic_class(tokenomics_subject)

    # OpenAI-Parsing
    response = client.responses.parse(
        model="gpt-4o",
        input=[
            {"role": "system",
             "content": prompt},
            {"role": "user",
             "content": f"Here is the text from the AI agent:\n{agent_output}"}
        ],
        text_format=ModelClass,
    )

    parsed_output = response.output_parsed

    # save as json
    json_output_path = (
        Path("data/json_output") /
        f"{tokenomics_subject}_{token}_result.json"
    )
    json_output_path.parent.mkdir(parents=True, exist_ok=True)
    json_output_path.write_text(parsed_output.model_dump_json(indent=2),
                                encoding="utf-8")

    return parsed_output


"""
pydantic classes
"""


# Emissiontype
class TokenEmissionProfile(BaseModel):
    Token: str
    Fixed_Supply_Hard_Cap: int
    Halvening_Exponential_Decay: int
    Linear_Emission: int
    Staged_Vesting_Supply: int
    Inflationary_Supply: int
    Bonding_Curve_Issuance: int
    Rebase_Elastic_Supply: int
    Mint_Burn_On_Demand: int
    Dynamic_Staking_Supply: int
    DAO_Governance_Controlled: int
    Continuous_Auction_Streaming: int
    Other_Emission: int
    Information_Emission: str
    Uncertainty_Emission: Optional[str]


class EmissiontypeModel(BaseModel):
    tokens: List[TokenEmissionProfile]


# Governance Mechanism
class TokenGovernanceProfile(BaseModel):
    Token: str
    On_Chain_Governance: int
    Off_Chain_Governance: int
    DAO_Governance: int
    Delegated_Voting: int
    Quadratic_Voting: int
    Multi_Signature_Control: int
    Council_Based_Governance: int
    Proposal_Voting_Systems: int
    Time_Locked_Governance: int
    Community_Treasury_Voting: int
    Other_Governance: int
    Information_Governance: str
    Uncertainty_Governance: Optional[str]


class GovernanceModel(BaseModel):
    tokens: List[TokenGovernanceProfile]


# Class
class TokenClassProfile(BaseModel):
    Token: str
    Payment_Token: int
    Utility_Token: int
    Investment_Token: int
    Other_Class: int
    Information_Class: str
    Uncertainty_Class: Optional[str]


class TokenClassModel(BaseModel):
    tokens: List[TokenClassProfile]


# Distribution
class TokenDistributionProfile(BaseModel):
    Token: str
    Airdrops: int
    Initial_Coin_Offering: int
    Initial_Exchange_Offering: int
    Security_Token_Offering: int
    Initial_DEX_Offering: int
    Liquidity_Bootstrapping_Pool: int
    Fair_Launch: int
    Direct_Sale: int
    Community_Incentives: int
    Bounty_Programs: int
    Other_Distribution: int
    Information_Distribution: str
    Uncertainty_Distribution: Optional[str]


class DistributionModel(BaseModel):
    tokens: List[TokenDistributionProfile]


# Incentive
class TokenIncentiveProfile(BaseModel):
    Token: str
    Staking_Rewards: int
    Liquidity_Mining: int
    Governance_Token_Systems: int
    Yield_Farming: int
    Token_Based_User_Rewards: int
    Other_Incentive: int
    Information_Incentive: str
    Uncertainty_Incentive: Optional[str]


class IncentiveModel(BaseModel):
    tokens: List[TokenIncentiveProfile]


# Price and Market
class TokenMarketMechanismProfile(BaseModel):
    Token: str
    Fixed_Supply: int
    Inflationary_Supply: int
    Deflationary_Mechanisms: int
    Halving_or_Exponential_Decay: int
    Dynamic_Minting_and_Burning: int
    Bonding_Curves: int
    Continuous_Auctions_and_Streaming: int
    Vesting_and_Staged_Releases: int
    AMM_Pricing: int
    DAO_Governance_Controlled_Pricing: int
    Other_Price_and_Market: int
    Information_Price_and_Market: str
    Uncertainty_Price_and_Market: Optional[str]


class MarketMechanismModel(BaseModel):
    tokens: List[TokenMarketMechanismProfile]


# Risk and Security
class TokenRiskSecurityProfile(BaseModel):
    Token: str
    Smart_Contract_Audits: int
    Bug_Bounty_Programs: int
    Multi_Signature_Wallets: int
    Insurance_Funds: int
    Decentralized_Governance: int
    Rate_Limiting_and_Circuit_Breakers: int
    Token_Vesting_and_Lockups: int
    Oracle_Security: int
    Slashing_Mechanisms: int
    KYC_AML_Compliance: int
    Other_Risk_and_Security: int
    Information_Risk_and_Security: str
    Uncertainty_Risk_and_Security: Optional[str]


class RiskSecurityModel(BaseModel):
    tokens: List[TokenRiskSecurityProfile]


# Vesting and Cliff
class TokenVestingCliffProfile(BaseModel):
    Token: str
    Cliff_Period: int
    Linear_Vesting: int
    Graded_Vesting: int
    Milestone_Based_Vesting: int
    Hybrid_Vesting: int
    Revocable_Vesting: int
    Non_Revocable_Vesting: int
    Team_Founder_Vesting: int
    Investor_Vesting: int
    Community_Incentive_Vesting: int
    Other_Vesting_and_Cliff: int
    Information_Vesting_and_Cliff: str
    Uncertainty_Vesting_and_Cliff: Optional[str]


class VestingCliffModel(BaseModel):
    tokens: List[TokenVestingCliffProfile]


def pydantic_class(subject: str) -> type[BaseModel]:
    """
    This function selects the correct data structure for each Tokenomic topic.
    """
    if subject == "emissiontype":
        return EmissiontypeModel
    elif subject == "governance":
        return GovernanceModel
    elif subject == "class":
        return TokenClassModel
    elif subject == "distribution":
        return DistributionModel
    elif subject == "incentive":
        return IncentiveModel
    elif subject == "price_and_market":
        return MarketMechanismModel
    elif subject == "risk_and_security":
        return RiskSecurityModel
    elif subject == "vesting_and_cliff":
        return VestingCliffModel
