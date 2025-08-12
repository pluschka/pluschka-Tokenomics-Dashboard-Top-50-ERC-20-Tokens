import numpy as np
import json
import pandas as pd
from pathlib import Path

"""
This file contains the preprocessing of the Total Supply, Maximum Supply and
Circurlating Supply Chart. For each chart the values are logged, bined and
saved in the corresponding json format for each chart.
"""
"""
Total Supply
"""
# load data
df = pd.read_csv(Path("./data/result/erc20_full_data.csv"))
tokens = df[["name", "total_supply"]].to_dict(orient="records")

# log total supply
vals = np.array([t["total_supply"] for t in tokens], dtype=float)
logs = np.log(vals)

# set metrics
bin_width = 0.5
log_base = "e"
lo = np.floor(logs.min())
hi = np.ceil(logs.max())
edges = np.arange(np.floor(logs.min()),
                  np.ceil(logs.max()) + bin_width,
                  bin_width)
counts, _ = np.histogram(logs, bins=edges)


# alter format for more readability on the chart
def human_format(num):
    for unit in ['', 'k', 'M', 'B', 'T']:
        if abs(num) < 1000:
            return f"{num:.0f} {unit}".strip()
        num /= 1000
    return "T+"  # if >1e15


def fmt_range(a, b):
    lo_val = np.exp(a)
    hi_val = np.exp(b)
    return f"{human_format(lo_val)} – {human_format(hi_val)}"


bin_labels = [fmt_range(edges[i], edges[i+1]) for i in range(len(edges)-1)]

bin_idx = np.digitize(logs, edges) - 1

# save the processed data
data = {
    "total_tokens": len(tokens),
    "log_base": log_base,
    "bin_edges": edges.tolist(),
    "bin_counts": counts.tolist(),
    "bin_labels": bin_labels,
    "tokens": [
        {
            "name": t["name"],
            "total_supply": float(val),
            "log_supply": round(log, 4),
            "bin_idx": int(idx)
        }
        for t, val, log, idx in zip(tokens, vals, logs, bin_idx)
    ]
}

json_str = json.dumps(data, indent=2)
print(json_str)

with open(Path("data/result") / "total_supply_chart.json", "w") as f:
    f.write(json_str)

out_path = (
    Path(r"D:\Tokenomics\frontend\tokenomics-project\src\data")
    / "total_supply_chart.json"
)

with open(out_path, "w", encoding="utf-8") as f:
    f.write(json_str)


"""
Maximum Supply
"""
# load data
tokens = df[["name", "max_supply"]].to_dict(orient="records")

# set metrics
BIN_WIDTH = 0.5
LOG_BASE = "e"
INCLUDE_NO_MAX_BAR = True

clean_vals = []
clean_names = []
missing_names = []

# check for missing maximum supply
for t in tokens:
    name = t.get("name")
    v = t.get("max_supply")
    try:
        v = float(v)
        if not np.isfinite(v) or v <= 0:
            missing_names.append(name)
        else:
            clean_vals.append(v)
            clean_names.append(name)
    except Exception:
        missing_names.append(name)

clean_vals = np.array(clean_vals, dtype=float)

# append to result if missing
if clean_vals.size == 0:
    data = {
        "total_tokens": len(tokens),
        "log_base": LOG_BASE,
        "bin_edges": [],
        "bin_counts": [len(missing_names)] if INCLUDE_NO_MAX_BAR else [],
        "bin_labels": ["No max supply"] if INCLUDE_NO_MAX_BAR else [],
        "tokens": [
            {"name": n, "max_supply": None, "log_supply": None, "bin_idx": -1}
            for n in missing_names
        ]
    }

# log max supply if and append to result if its not missing
else:
    logs = np.log(clean_vals)
    lo = np.floor(logs.min())
    hi = np.ceil(logs.max())
    edges = np.arange(lo, hi + BIN_WIDTH, BIN_WIDTH)

    if edges.size < 2:
        edges = np.array([lo, lo + BIN_WIDTH])

    counts, _ = np.histogram(logs, bins=edges)
    bin_labels = [fmt_range(edges[i], edges[i+1]) for i in range(len(edges)-1)]
    bin_idx = np.digitize(logs, edges) - 1

    # Prepare the output list for tokens with valid max_supply values
    tokens_out = []

    for name, val, lg, idx in zip(clean_names, clean_vals, logs, bin_idx):
        tokens_out.append({
            "name": name,
            "max_supply": float(val),
            "log_supply": float(np.round(lg, 4)),
            "bin_idx": int(idx)
        })

    for name in missing_names:
        tokens_out.append({
            "name": name,
            "max_supply": None,
            "log_supply": None,
            "bin_idx": -1
        })

    if INCLUDE_NO_MAX_BAR and len(missing_names) > 0:
        bin_labels = ["No max supply"] + bin_labels
        counts = np.concatenate([[len(missing_names)], counts])

        for obj in tokens_out:
            if obj["bin_idx"] is not None and obj["bin_idx"] >= 0:
                obj["bin_idx"] += 1

        for obj in tokens_out:
            if obj["bin_idx"] == -1:
                obj["bin_idx"] = 0

    # save the processed data
    data = {
        "total_tokens": len(tokens),
        "log_base": LOG_BASE,
        "bin_edges": edges.tolist(),
        "bin_counts": counts.tolist(),
        "bin_labels": bin_labels,
        "tokens": tokens_out
    }

json_str = json.dumps(data, indent=2)
print(json_str)

with open(Path("data/result") / "max_supply_chart.json",
          "w",
          encoding="utf-8") as f:
    f.write(json_str)

out_path = (
    Path(r"D:\Tokenomics\frontend\tokenomics-project\src\data")
    / "max_supply_chart.json"
)
out_path.parent.mkdir(parents=True, exist_ok=True)
with open(out_path, "w", encoding="utf-8") as f:
    f.write(json_str)

"""
Circulating Supply
"""
# load data
tokens = df[["name", "circulating_supply"]].to_dict(orient="records")
vals = np.array([t["circulating_supply"] for t in tokens], dtype=float)

# log circulating_supply
logs = np.log(vals)

# set metrics
bin_width = 0.5
log_base = "e"
lo = np.floor(logs.min())
hi = np.ceil(logs.max())
edges = np.arange(np.floor(logs.min()),
                  np.ceil(logs.max()) + bin_width,
                  bin_width)
counts, _ = np.histogram(logs, bins=edges)
bin_labels = [fmt_range(edges[i], edges[i+1]) for i in range(len(edges)-1)]
bin_idx = np.digitize(logs, edges) - 1

# save data
data = {
    "total_tokens": len(tokens),
    "log_base": log_base,
    "bin_edges": edges.tolist(),
    "bin_counts": counts.tolist(),
    "bin_labels": bin_labels,
    "tokens": [
        {
            "name": t["name"],
            "circulating_supply": float(val),
            "log_supply": round(log, 4),
            "bin_idx": int(idx)
        }
        for t, val, log, idx in zip(tokens, vals, logs, bin_idx)
    ]
}

json_str = json.dumps(data, indent=2)
print(json_str)

with open(Path("data/result") / "circulating_supply.json", "w") as f:
    f.write(json_str)

out_path = (
    Path(r"D:\Tokenomics\frontend\tokenomics-project\src\data")
    / "circulating_supply_chart.json"
)

out_path.parent.mkdir(parents=True, exist_ok=True)

with open(out_path, "w", encoding="utf-8") as f:
    f.write(json_str)
