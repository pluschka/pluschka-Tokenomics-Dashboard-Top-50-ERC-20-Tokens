// src/components/TokenIncentiveBar.jsx
import './Bar.css';

function getColor(index) {
  const colors = [
    '#232e3fff', '#24355cff', '#253c78ff', '#777184ff',
    '#a08c8aff', '#b1a5a5ff', '#8f8282ff', '#6d5f5fff',
    '#574d4dff', '#403a3aff'
  ];
  return colors[index % colors.length];
}

const TokenIncentiveBar = ({ tokens = [] }) => {
  const classes = {
    "Staking Rewards": {
      field: "Staking_Rewards",
      definition: "Tokens distributed as rewards for locking up tokens to support network security and operations."
    },
    "Liquidity Mining": {
      field: "Liquidity_Mining",
      definition: "Tokens awarded to users who provide liquidity to decentralized exchanges or lending platforms."
    },
    "Governance Token Systems": {
      field: "Governance_Token_Systems",
      definition: "Tokens that grant holders the right to participate in decision-making processes within a protocol."
    },
    "Yield Farming": {
      field: "Yield_Farming",
      definition: "The practice of earning rewards by strategically moving funds between different DeFi protocols."
    },
    "Token-Based User Rewards": {
      field: "Token_Based_User_Rewards",
      definition: "Tokens given to users as incentives for engagement, activity, or loyalty within a platform."
    },
    "Other Incentive": {
      field: "Other_Incentive",
      definition: "Any incentive mechanism not covered by the main categories."
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
          info: t.Information_Incentive,
          uncertainty: t.Uncertainty_Incentive
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

export default TokenIncentiveBar;
