// FILE: app/lib/chart-config.js

/**
 * Get Chart.js configuration options
 * @param {string} type - Chart type (line, bar, etc.)
 * @param {Object} customOptions - Custom options to override defaults
 * @returns {Object} Chart.js options configuration
 */
export function getChartOptions(type = 'line', customOptions = {}) {
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: customOptions.maintainAspectRatio !== undefined 
      ? customOptions.maintainAspectRatio 
      : true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: customOptions.enableLegend || false,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12
          },
          color: (context) => {
            return context.chart.canvas.closest('.dark') ? '#e5e7eb' : '#374151';
          }
        }
      },
      title: {
        display: !!customOptions.title,
        text: customOptions.title || '',
        font: {
          size: 16,
          weight: 'normal'
        },
        padding: {
          top: 10,
          bottom: 30
        },
        color: (context) => {
          return context.chart.canvas.closest('.dark') ? '#f3f4f6' : '#111827';
        }
      },
      tooltip: {
        backgroundColor: (context) => {
          return context.chart.canvas.closest('.dark') ? 'rgba(31, 41, 55, 0.95)' : 'rgba(17, 24, 39, 0.95)';
        },
        titleColor: '#f3f4f6',
        bodyColor: '#e5e7eb',
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y + '%';
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          font: {
            size: 11
          },
          color: (context) => {
            return context.chart.canvas.closest('.dark') ? '#9ca3af' : '#6b7280';
          }
        },
        title: {
          display: !!customOptions.xAxisLabel,
          text: customOptions.xAxisLabel || '',
          font: {
            size: 12
          },
          color: (context) => {
            return context.chart.canvas.closest('.dark') ? '#e5e7eb' : '#374151';
          }
        }
      },
      y: {
        display: true,
        position: customOptions.yAxisPosition || 'left',
        grid: {
          color: (context) => {
            return context.chart.canvas.closest('.dark') ? 'rgba(107, 114, 128, 0.2)' : 'rgba(229, 231, 235, 0.5)';
          },
          drawBorder: false
        },
        ticks: {
          font: {
            size: 11
          },
          color: (context) => {
            return context.chart.canvas.closest('.dark') ? '#9ca3af' : '#6b7280';
          },
          callback: function(value) {
            return value + '%';
          }
        },
        title: {
          display: !!customOptions.yAxisLabel,
          text: customOptions.yAxisLabel || '',
          font: {
            size: 12
          },
          color: (context) => {
            return context.chart.canvas.closest('.dark') ? '#e5e7eb' : '#374151';
          }
        },
        beginAtZero: true,
        max: 100
      }
    }
  };

  // Type-specific configurations
  if (type === 'bar' && customOptions.indexAxis === 'y') {
    // Horizontal bar chart
    baseOptions.indexAxis = 'y';
    baseOptions.scales.x.max = 100;
    baseOptions.scales.y.grid = {
      display: false,
      drawBorder: false
    };
    baseOptions.scales.x.grid = {
      color: (context) => {
        return context.chart.canvas.closest('.dark') ? 'rgba(107, 114, 128, 0.2)' : 'rgba(229, 231, 235, 0.5)';
      },
      drawBorder: false
    };
  }

  // Handle onClick if provided
  if (customOptions.onClick) {
    baseOptions.onClick = customOptions.onClick;
  }

  // Handle onHover if provided
  if (customOptions.onHover) {
    baseOptions.onHover = customOptions.onHover;
  }

  return baseOptions;
}

/**
 * Get color palette for charts
 * @param {number} count - Number of colors needed
 * @returns {Array} Array of color strings
 */
export function getChartColors(count = 5) {
  const colors = [
    'rgb(99, 102, 241)',   // indigo-500
    'rgb(34, 197, 94)',    // green-500
    'rgb(251, 191, 36)',   // amber-400
    'rgb(239, 68, 68)',    // red-500
    'rgb(147, 51, 234)',   // purple-600
    'rgb(14, 165, 233)',   // sky-500
    'rgb(236, 72, 153)',   // pink-500
    'rgb(245, 158, 11)',   // amber-500
    'rgb(59, 130, 246)',   // blue-500
    'rgb(16, 185, 129)'    // emerald-500
  ];

  return colors.slice(0, count);
}

/**
 * Get gradient configuration for charts
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {string} color - Base color
 * @returns {CanvasGradient} Gradient object
 */
export function getGradient(ctx, color) {
  const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
  const rgb = color.match(/\d+/g);
  
  if (rgb) {
    gradient.addColorStop(0, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.3)`);
    gradient.addColorStop(1, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.01)`);
  }
  
  return gradient;
}

/**
 * Format data for Chart.js
 * @param {Array} data - Raw data array
 * @param {Object} options - Formatting options
 * @returns {Object} Formatted dataset
 */
export function formatChartData(data, options = {}) {
  const {
    label = 'Dataset',
    borderColor = 'rgb(99, 102, 241)',
    backgroundColor = 'rgba(99, 102, 241, 0.1)',
    fill = true,
    tension = 0.3
  } = options;

  return {
    label,
    data,
    borderColor,
    backgroundColor,
    fill,
    tension,
    pointRadius: 4,
    pointHoverRadius: 6,
    pointBackgroundColor: borderColor,
    pointBorderColor: '#fff',
    pointBorderWidth: 2,
    pointHoverBackgroundColor: borderColor,
    pointHoverBorderColor: '#fff',
    pointHoverBorderWidth: 2
  };
}

/**
 * Get responsive breakpoints for charts
 * @returns {Object} Breakpoint configuration
 */
export function getChartBreakpoints() {
  return {
    mobile: {
      maxWidth: 640,
      aspectRatio: 1.5,
      fontSize: 10
    },
    tablet: {
      maxWidth: 1024,
      aspectRatio: 2,
      fontSize: 11
    },
    desktop: {
      minWidth: 1024,
      aspectRatio: 2.5,
      fontSize: 12
    }
  };
}

/**
 * Apply dark mode to chart instance
 * @param {Chart} chart - Chart.js instance
 * @param {boolean} isDark - Dark mode state
 */
export function applyDarkMode(chart, isDark) {
  if (!chart) return;

  const textColor = isDark ? '#e5e7eb' : '#374151';
  const gridColor = isDark ? 'rgba(107, 114, 128, 0.2)' : 'rgba(229, 231, 235, 0.5)';

  // Update scales
  if (chart.options.scales) {
    Object.values(chart.options.scales).forEach(scale => {
      if (scale.ticks) scale.ticks.color = textColor;
      if (scale.title) scale.title.color = textColor;
      if (scale.grid) scale.grid.color = gridColor;
    });
  }

  // Update plugins
  if (chart.options.plugins) {
    if (chart.options.plugins.legend) {
      chart.options.plugins.legend.labels.color = textColor;
    }
    if (chart.options.plugins.title) {
      chart.options.plugins.title.color = textColor;
    }
  }

  chart.update();
}
