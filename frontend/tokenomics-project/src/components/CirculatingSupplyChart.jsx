import React, { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import tokenBins from '../data/circulating_supply_chart.json';

export default function CirculatingSupplyChart() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    Chart.register(...registerables);
    const ctx = canvasRef.current.getContext('2d');

    chartRef.current?.destroy();

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: tokenBins.bin_labels,
        datasets: [{
          label: 'Token Count',
          data: tokenBins.bin_counts,
          backgroundColor: 'rgba(37, 60, 120, 1)',
          borderColor: 'rgba(37, 60, 120, 1)',
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
              title: (items) => {

                const idx = items[0].dataIndex;
                return `Bin: ${tokenBins.bin_labels[idx]}`;
              },
              label: () => null,
              afterBody: (items) => {
                const idx = items[0].dataIndex;
                const tokensInBin = tokenBins.tokens.filter(t => t.bin_idx === idx);

                if (tokensInBin.length === 0) {
                  return ['No Tokens in this bin'];
                }

                return tokensInBin.map(
                  t => `${t.name}: ${t.circulating_supply.toLocaleString('en-US')}`
                );
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            title: {
              display: true,
              text: 'Circulating Supply',
              font: { size: 14, weight: 'bold' }
            },
            ticks: {
              maxRotation: 45,
              minRotation: 45,
              autoSkip: true
            }
          },
          y: {
            grid: { display: false },
            beginAtZero: true,
            title: {
              display: true,
              text: 'Token Count',
              font: { size: 14, weight: 'bold' }
            }
          }
        }
      }
    });

    return () => chartRef.current?.destroy();
  }, []);

  return (
    <div style={{ height: 400, marginBottom: '100px'  }}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}
