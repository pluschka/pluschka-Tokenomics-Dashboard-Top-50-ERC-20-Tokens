import './Bar.css';

const TokenClassBar = ({ tokens = [] }) => {
  const classes = {
    "Payment Token": {
      field: "Payment_Token",
      definition: "Primarily serves as a medium of exchange for goods and services, similar to digital currency."
    },
    "Utility Token": {
      field: "Utility_Token",
      definition: "Provides access to a specific product or service within a blockchain ecosystem."
    },
    "Investment Token": {
      field: "Investment_Token",
      definition: "Represents an asset, profit share, or other investment interest, often subject to regulation."
    },
    "Other Class": {
      field: "Other_Class",
      definition: "Any token classification not covered by the main categories."
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
          info: t.Information_Class,
          uncertainty: t.Uncertainty_Class
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

export default TokenClassBar;