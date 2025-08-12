# Tokenomics Dashboard – Top 50 ERC-20 Tokens

A descriptive statistics overview of various tokenomics aspects for the top 50 ERC-20 tokens as of July 2025.  
The analysis covers:  
- Supply
- Emission Type
- Governance
- Class
- Distribution
- Incentive Mechanism
- Price & Market
- Risk & Security
- Vesting & Cliff


## Data Sources
- CoinMarketCap API (Top 50 Tokelist and supply-related data)
- Official Whitepapers** (via AI agents for qualitative tokenomics data)


## Project Structure

Tokenomics/
│
├── get_data/                      # Python scripts for data fetching & preprocessing
│   ├── get_erc20.py               # Fetch top 50 ERC-20 tokens from CoinMarketCap
│   ├── main.py                    # Extract tokenomics info from whitepapers using AI Agents
│   ├── preprocess_supply.py       # Process supply data into chart-ready JSON
│   └── requirements.txt           # Python dependencies
│
├── frontend/tokenomics-project/   # React + Vite frontend for visualization
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md                      # Project documentation


## Workflow

1. get_erc20.py – Fetches top 50 ERC-20 tokens from CoinMarketCap.

2. main.py – Extracts qualitative tokenomics categories from whitepapers using AI agents.

3. preprocess_supply.py – Processes supply data (Total, Max, Circulating) into binned JSON for charts.

4. Frontend displays data via interactive charts and tables.


## Usage
### Running the Frontend with Preloaded Data

You can view the dashboard without fetching new data:

cd frontend/tokenomics-project
npm install
npm run dev

### Fetching & Processing the Latest Data

To fetch up-to-date data for the top 50 ERC-20 tokens:

cd get_data
pip install -r requirements.txt
python get_erc20.py
python main.py
python preprocess_supply.py

cd ../frontend/tokenomics-project
npm install
npm run dev

Important Notes

OpenAI API Key Required because main.py uses AI agents to extract qualitative tokenomics data from whitepapers via web search.
Costs for GPT-4 are around $10–15 for 50 tokens. To reduce costs enable web search and upload whitepapers manually. Switch to GPT-5 for better performance and potentially lower cost.
You can run the same pipeline for your own list of tokens – feel free to fork and adapt.

## Technologies Used

### Backend (Data Processing)

    Python 3.12+

    pandas

    numpy

    pycoingecko / requests

    OpenAI API

### Frontend (Visualization)

    React

    Vite

    Charting libraries (TBA / as implemented)

## License

MIT License – feel free to use, modify, and distribute.

## Author

Anastasia – www.linkedin.com/in/anastasia-tsymboulova-575b81349
