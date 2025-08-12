import './Bar.css';

const GovernanceBar = ({ tokens = [] }) => {
  const classes = {
    "On-Chain Governance": {
      field: "On_Chain_Governance",
      definition: "Governance processes executed directly on the blockchain through smart contracts, enabling transparent and verifiable decision-making."
    },
    "Off-Chain Governance": {
      field: "Off_Chain_Governance",
      definition: "Governance processes conducted outside the blockchain, such as forum discussions or social consensus, with results later implemented on-chain."
    },
    "DAO Governance": {
      field: "DAO_Governance",
      definition: "Decision-making managed by a Decentralized Autonomous Organization, where token holders collectively govern project rules and resources."
    },
    "Delegated Voting": {
      field: "Delegated_Voting",
      definition: "A governance model where participants delegate their voting power to trusted representatives to make decisions on their behalf."
    },
    "Quadratic Voting": {
      field: "Quadratic_Voting",
      definition: "A voting system where the cost of casting additional votes increases quadratically, balancing influence between large and small stakeholders."
    },
    "Multi-Signature Control": {
      field: "Multi_Signature_Control",
      definition: "Governance or fund management requiring multiple authorized parties to approve an action before it is executed."
    },
    "Council-Based Governance": {
      field: "Council_Based_Governance",
      definition: "Governance led by a designated council or committee, often elected or appointed to represent the community or stakeholders."
    },
    "Proposal Voting Systems": {
      field: "Proposal_Voting_Systems",
      definition: "Mechanisms for submitting and voting on proposals to change project parameters, allocate resources, or introduce new features."
    },
    "Time-Locked Governance": {
      field: "Time_Locked_Governance",
      definition: "Governance actions that include a delay period before execution, allowing stakeholders to react or challenge decisions."
    },
    "Community Treasury Voting": {
      field: "Community_Treasury_Voting",
      definition: "Community-driven decision-making over the allocation and use of treasury funds."
    },
    "Other Governance": {
      field: "Other_Governance",
      definition: "Any governance approach not covered by the above categories."
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
          info: t.Information_Governance,
          uncertainty: t.Uncertainty_Governance
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

export default GovernanceBar;
