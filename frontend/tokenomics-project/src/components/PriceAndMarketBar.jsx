import './Bar.css';

const PriceAndMarketBar = ({ tokens = [] }) => {
  const classes = {
    "Fixed Supply": {
      field: "Fixed_Supply",
      definition: "The total number of tokens is capped and cannot be increased."
    },
    "Inflationary Supply": {
      field: "Inflationary_Supply_Mining",
      definition: "New tokens are continuously created, increasing total supply over time."
    },
    "Deflationary Mechanisms": {
      field: "Deflationary_Mechanisms",
      definition: "Tokenomics design features that reduce a token’s circulating supply over time to create scarcity and potentially increase its value. Common methods include token burns, buybacks, halving events, and decreasing emission schedules."
    },
    "Halving or Exponential Decay": {
      field: "Halving_or_Exponential_Decay",
      definition: "Token issuance rate decreases periodically or exponentially over time."
    },
    "Dynamic Minting and Burning": {
      field: "Dynamic_Minting_and_Burning",
      definition: "Tokens are created or destroyed based on demand or network conditions."
    },
    "Bonding Curves": {
      field: "Bonding_Curves",
      definition: "Price is algorithmically determined by a predefined mathematical curve."
    },
    "Continuous Auctions and Streaming": {
      field: "Continuous_Auctions_and_Streaming",
      definition: "Tokens are distributed through ongoing auctions or time-based streams."
    },
    "Vesting and Staged Releases": {
      field: "Vesting_and_Staged_Releases",
      definition: "Tokens are unlocked gradually over a set period or in stages."
    },
    "AMM Pricing": {
      field: "AMM_Pricing",
      definition: "Prices are determined automatically by liquidity pools using set formulas."
    },
    "DAO Governance Controlled Pricing": {
      field: "DAO_Governance_Controlled_Pricing",
      definition: "Token price or supply is adjusted based on decisions by DAO members."
    },
    "Other Price and Market Mechanism": {
      field: "Other_Price_and_Market",
      definition: "Any alternative pricing or market approach not covered by other categories."
    }
  };

  const summary = Object.entries(classes)
    .map(([label, { field, definition }]) => {
      const matching = tokens.filter(t => t?.[field] === 1);
      return {
        label,
        definition,
        count: matching.length,
        names: matching.map(t => ({
          name: t.name,
          info: t.Information_Price_and_Market,
          uncertainty: t.Uncertainty_Price_and_Market
        }))
      };
    })
    .sort((a, b) => b.count - a.count);

  const total = tokens.length || 1;

  return (
    <div>
      <div className="summary-bar">
        {summary.map(({ label, definition, count, names }, idx) => {
          const percent = (count / total) * 100;
          return (
            <div
              key={label}
              className="summary-segment"
              style={{ width: `${percent}%`, backgroundColor: getColor(idx) }}
            >
              <div className="tooltip-wrapper">
                {percent > 8 && <span className="segment-label">{label}</span>}
                <div className="segment-tooltip">
                  <strong>{label}</strong><br />
                  <em>{definition}</em><br /><br />
                  {count} of {tokens.length} Tokens
                  <ul>
                    {names.map((token, i) => (
                      <li key={i}>
                        <strong>{token.name}</strong> – {token.info}
                        {token.uncertainty && <em> ({token.uncertainty})</em>}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="legend">
        {summary.map(({ label, count }, idx) => (
          <div key={label} className="legend-item">
            <span className="legend-color" style={{ backgroundColor: getColor(idx) }} />
            <span className="legend-label">{label}</span>
            <span className="legend-count">({count})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

function getColor(index) {
  const colors = [
    '#232e3fff', '#24355cff', '#253c78ff', '#777184ff',
    '#a08c8aff', '#b1a5a5ff', '#8f8282ff', '#6d5f5fff',
    '#574d4dff', '#403a3aff'
  ];
  return colors[index % colors.length];
}

export default PriceAndMarketBar;
