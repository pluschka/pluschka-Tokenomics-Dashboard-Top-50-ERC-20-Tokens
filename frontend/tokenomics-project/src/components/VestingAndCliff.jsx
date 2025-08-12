import './Bar.css';

const VestingAndCliffBar = ({ tokens = [] }) => {
  const classes = {
    "Cliff Period": {
      field: "Cliff_Period",
      definition: "Fixed initial period during which no tokens are released; after expiration, a portion or all allocated tokens are unlocked."
    },
    "Linear Vesting": {
      field: "Linear_Vesting",
      definition: "Steady, proportional release of tokens over a defined period."
    },
    "Graded Vesting": {
      field: "Graded_Vesting",
      definition: "Release of tokens in multiple predefined tranches at set intervals."
    },
    "Milestone-Based Vesting": {
      field: "Milestone_Based_Vesting",
      definition: "Token release triggered only upon reaching specific project or performance milestones."
    },
    "Hybrid Vesting": {
      field: "Hybrid_Vesting",
      definition: "Combination of different vesting methods, such as cliff plus linear or cliff plus milestone-based."
    },
    "Revocable Vesting": {
      field: "Revocable_Vesting",
      definition: "A vesting arrangement that can be terminated early by the project or issuer under certain conditions."
    },
    "Non-Revocable Vesting": {
      field: "Non_Revocable_Vesting",
      definition: "A vesting arrangement that cannot be unilaterally terminated once it has begun."
    },
    "Team & Founder Vesting": {
      field: "Team_Founder_Vesting",
      definition: "Vesting schedules specifically applied to team members and project founders."
    },
    "Investor Vesting": {
      field: "Investor_Vesting",
      definition: "Vesting schedules applied to private or institutional investors."
    },
    "Community Incentive Vesting": {
      field: "Community_Incentive_Vesting",
      definition: "Vesting schedules for tokens allocated to community rewards or incentive programs."
    },
    "Other Vesting and Cliff": {
      field: "Other_Vesting_and_Cliff",
      definition: "Any other vesting or cliff arrangements not covered by the above categories."
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
          info: t.Information_Vesting_and_Cliff,
          uncertainty: t.Uncertainty_Vesting_and_Cliff
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

export default VestingAndCliffBar;
