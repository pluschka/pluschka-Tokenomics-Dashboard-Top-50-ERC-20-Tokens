import './Bar.css';

const TokenRiskAndsecurityBar = ({ tokens = [] }) => {
  const classes = {
    "Smart Contract Audits": {
      field: "Smart_Contract_Audits",
      definition: "Independent reviews of smart contract code to identify and fix vulnerabilities before deployment."
    },
    "Bug Bounty Programs": {
      field: "Bug_Bounty_Programs",
      definition: "Incentive programs that reward security researchers for discovering and responsibly disclosing vulnerabilities."
    },
    "Multi-Signature Wallets": {
      field: "Multi_Signature_Wallets",
      definition: "Wallets requiring multiple private keys to authorize a transaction, reducing the risk of single-point compromise."
    },
    "Insurance Funds": {
      field: "Insurance_Funds",
      definition: "Funds set aside to compensate users in case of hacks, exploits, or other significant losses."
    },
    "Decentralized Governance": {
      field: "Decentralized_Governance",
      definition: "Decision-making processes controlled collectively by token holders rather than a central authority."
    },
    "Rate Limiting and Circuit Breakers": {
      field: "Rate_Limiting_and_Circuit_Breakers",
      definition: "Mechanisms that restrict or pause operations to prevent abuse, system overload, or cascading failures."
    },
    "Token Vesting and Lockups": {
      field: "Token_Vesting_and_Lockups",
      definition: "Scheduled release of tokens over time to align incentives and reduce market dumping."
    },
    "Oracle Security": {
      field: "Oracle_Security",
      definition: "Measures ensuring the integrity and reliability of external data feeds used by smart contracts."
    },
    "Slashing Mechanisms": {
      field: "Slashing_Mechanisms",
      definition: "Penalties that remove part of a participant’s staked assets for malicious or negligent behavior."
    },
    "KYC / AML Compliance": {
      field: "KYC_AML_Compliance",
      definition: "Verification of user identities and monitoring of transactions to meet regulatory requirements."
    },
    "Other Risk and Security": {
      field: "Other_Risk_and_Security",
      definition: "Any other measures or mechanisms to mitigate risks and enhance platform security not covered by other categories."
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
          info: t.Information_Risk_and_Security,
          uncertainty: t.Uncertainty_Risk_and_Security
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

export default TokenRiskAndsecurityBar;
