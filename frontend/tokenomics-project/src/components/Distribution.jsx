import './Bar.css';

const DistributionBar = ({ tokens = [] }) => {
  const classes = {
    "Airdrops": {
      field: "Airdrops",
      definition: "Free distribution of tokens to multiple wallet addresses, often used to promote awareness and adoption."
    },
    "Initial Coin Offering (ICO)": {
      field: "Initial_Coin_Offering",
      definition: "A fundraising method where new cryptocurrency tokens are sold to early investors before being listed on exchanges."
    },
    "Initial Exchange Offering (IEO)": {
      field: "Initial_Exchange_Offering",
      definition: "A token sale conducted through a centralized exchange, which manages the fundraising process on behalf of the project."
    },
    "Security Token Offering (STO)": {
      field: "Security_Token_Offering",
      definition: "A regulated token sale where the tokens represent securities, subject to compliance with applicable financial regulations."
    },
    "Initial DEX Offering (IDO)": {
      field: "Initial_DEX_Offering",
      definition: "A token sale conducted through a decentralized exchange (DEX), often using automated liquidity pools."
    },
    "Liquidity Bootstrapping Pool (LBP)": {
      field: "Liquidity_Bootstrapping_Pool",
      definition: "A mechanism that uses a token pool with adjustable weights to distribute tokens while reducing price manipulation during launch."
    },
    "Fair Launch": {
      field: "Fair_Launch",
      definition: "A token distribution where all participants have equal access without private sales or preferential allocations."
    },
    "Direct Sale": {
      field: "Direct_Sale",
      definition: "Tokens sold directly by the project team to buyers without an intermediary exchange or fundraising event."
    },
    "Community Incentives": {
      field: "Community_Incentives",
      definition: "Tokens allocated to reward community participation, contributions, and engagement."
    },
    "Bounty Programs": {
      field: "Bounty_Programs",
      definition: "Rewards given to users who complete specific tasks such as promoting the project, finding bugs, or contributing content."
    },
    "Other Distribution": {
      field: "Other_Distribution",
      definition: "Any other method of token distribution not covered by the above categories."
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
          info: t.Information_Distribution,
          uncertainty: t.Uncertainty_Distribution
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
              style={{
                width: `${percent}%`,
                backgroundColor: getColor(idx)
              }}
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
            <span
              className="legend-color"
              style={{ backgroundColor: getColor(idx) }}
            ></span>
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

export default DistributionBar;
