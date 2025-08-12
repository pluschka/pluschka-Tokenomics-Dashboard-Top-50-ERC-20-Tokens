import React, { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import maxBins from '../data/max_supply_chart.json';

export default function MaxSupplyBinsBarChart() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const human = (n) => {
    const abs = Math.abs(n ?? 0);
    if (!Number.isFinite(n)) return '—';
    if (abs >= 1e12) return `${(n / 1e12).toFixed(abs >= 1e13 ? 0 : 2)} T`;
    if (abs >= 1e9) return `${(n / 1e9).toFixed(abs >= 1e10 ? 0 : 2)} B`;
    if (abs >= 1e6) return `${(n / 1e6).toFixed(abs >= 1e7 ? 0 : 2)} M`;
    if (abs >= 1e3) return `${(n / 1e3).toFixed(abs >= 1e4 ? 0 : 2)} k`;
    return `${n}`;
  };

  useEffect(() => {
    Chart.register(...registerables);
    const ctx = canvasRef.current.getContext('2d');
    chartRef.current?.destroy();

    const buckets = new Map();
    const missing = [];
    (maxBins.tokens || []).forEach(t => {
      const idx = Number.isFinite(t?.bin_idx) ? t.bin_idx : -1;
      const valid = Number.isFinite(t?.max_supply) && t.max_supply > 0;
      if (idx >= 0 && valid) {
        const arr = buckets.get(idx) || [];
        arr.push(t);
        buckets.set(idx, arr);
      } else {
        missing.push(t);
      }
    });

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: maxBins.bin_labels,
        datasets: [{
          label: 'Token Count',
          data: maxBins.bin_counts,
          backgroundColor: 'rgba(36, 53, 92, 1)',
          borderColor: 'rgba(36, 53, 92, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const idx = context.dataIndex;
                const label = maxBins.bin_labels[idx] || '';
                let list = buckets.get(idx) || [];

                const isNoMaxBar = label.toLowerCase().includes('no max');
                if (isNoMaxBar || (list.length === 0 && missing.length > 0 && idx === 0)) {
                  list = missing;
                }

                const lines = [];
                lines.push(`Bin: ${label}`);
                lines.push('Tokens in this Bin:');
                list.forEach(t => {
                  const ms = Number.isFinite(t?.max_supply) ? human(t.max_supply) : 'No max';
                  lines.push(`• ${t.name}: ${ms}`);
                });

                return lines;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            title: { display: true, text: 'Maximum Supply', font: { size: 14, weight: 'bold' } },
            ticks: { maxRotation: 45, minRotation: 45, autoSkip: true }
          },
          y: {
            grid: { display: false },
            beginAtZero: true,
            title: { display: true, text: 'Token Count', font: { size: 14, weight: 'bold' } }
          }
        }
      }
    });

    return () => chartRef.current?.destroy();
  }, []);

  return (
    <div style={{ height: 400, marginBottom: '100px'  }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
