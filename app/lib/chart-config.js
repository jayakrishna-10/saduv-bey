// FILE: app/lib/chart-config.js
export const getChartOptions = (type, customOptions = {}) => {
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: customOptions.maintainAspectRatio !== false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: customOptions.enableLegend || false,
        position: customOptions.legendPosition || 'top',
        labels: {
          padding: 15,
          font: {
            size: 12,
            family: 'Inter, system-ui, sans-serif'
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        titleFont: {
          size: 14,
          weight: 'bold',
          family: 'Inter, system-ui, sans-serif'
        },
        bodyFont: {
          size: 13,
          family: 'Inter, system-ui, sans-serif'
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        ...customOptions.tooltip
      },
      title: {
        display: !!customOptions.title,
        text: customOptions.title || '',
        font: {
          size: 16,
          weight: 'bold',
          family: 'Inter, system-ui, sans-serif'
        },
        padding: {
          bottom: 20
        },
        color: 'rgb(75, 85, 99)' // gray-600
      }
    },
    scales: {}
  };

  // Configure scales based on chart type
  if (type === 'line' || type === 'bar') {
    baseOptions.scales = {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter, system-ui, sans-serif'
          },
          color: 'rgb(156, 163, 175)', // gray-400
          padding: 8,
          ...customOptions.xAxisTicks
        },
        title: {
          display: !!customOptions.xAxisLabel,
          text: customOptions.xAxisLabel || '',
          font: {
            size: 12,
            weight: 'medium',
            family: 'Inter, system-ui, sans-serif'
          },
          color: 'rgb(107, 114, 128)', // gray-500
          padding: { top: 10 }
        },
        ...customOptions.xAxis
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)', // gray-400 with opacity
          drawBorder: false,
          drawTicks: false
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter, system-ui, sans-serif'
          },
          color: 'rgb(156, 163, 175)', // gray-400
          padding: 8,
          ...customOptions.yAxisTicks
        },
        title: {
          display: !!customOptions.yAxisLabel,
          text: customOptions.yAxisLabel || '',
          font: {
            size: 12,
            weight: 'medium',
            family: 'Inter, system-ui, sans-serif'
          },
          color: 'rgb(107, 114, 128)', // gray-500
          padding: { right: 10 }
        },
        ...customOptions.yAxis
      }
    };
  }

  // Apply horizontal bar specific options
  if (customOptions.indexAxis === 'y') {
    baseOptions.indexAxis = 'y';
    // Swap x and y configurations for horizontal bars
    const tempX = baseOptions.scales.x;
    baseOptions.scales.x = baseOptions.scales.y;
    baseOptions.scales.y = tempX;
  }

  // Merge with custom scales
  if (customOptions.scales) {
    baseOptions.scales = {
      ...baseOptions.scales,
      ...customOptions.scales
    };
  }

  // Add onClick handler if provided
  if (customOptions.onClick) {
    baseOptions.onClick = customOptions.onClick;
  }

  return baseOptions;
};

// Color palettes for consistent theming
export const chartColors = {
  primary: {
    main: 'rgb(99, 102, 241)', // indigo-500
    light: 'rgba(99, 102, 241, 0.2)',
    dark: 'rgb(79, 70, 229)' // indigo-600
  },
  secondary: {
    main: 'rgb(168, 85, 247)', // purple-500
    light: 'rgba(168, 85, 247, 0.2)',
    dark: 'rgb(147, 51, 234)' // purple-600
  },
  success: {
    main: 'rgb(34, 197, 94)', // green-500
    light: 'rgba(34, 197, 94, 0.2)',
    dark: 'rgb(22, 163, 74)' // green-600
  },
  warning: {
    main: 'rgb(251, 146, 60)', // orange-400
    light: 'rgba(251, 146, 60, 0.2)',
    dark: 'rgb(249, 115, 22)' // orange-500
  },
  danger: {
    main: 'rgb(239, 68, 68)', // red-500
    light: 'rgba(239, 68, 68, 0.2)',
    dark: 'rgb(220, 38, 38)' // red-600
  },
  info: {
    main: 'rgb(59, 130, 246)', // blue-500
    light: 'rgba(59, 130, 246, 0.2)',
    dark: 'rgb(37, 99, 235)' // blue-600
  }
};

// Gradient configurations
export const chartGradients = {
  primary: ['rgb(99, 102, 241)', 'rgb(139, 92, 246)'], // indigo to violet
  secondary: ['rgb(168, 85, 247)', 'rgb(217, 70, 239)'], // purple to fuchsia
  success: ['rgb(34, 197, 94)', 'rgb(16, 185, 129)'], // green to emerald
  warning: ['rgb(251, 146, 60)', 'rgb(251, 191, 36)'], // orange to amber
  danger: ['rgb(239, 68, 68)', 'rgb(236, 72, 153)'], // red to pink
  info: ['rgb(59, 130, 246)', 'rgb(6, 182, 212)'] // blue to cyan
};

// Create gradient for charts
export const createGradient = (ctx, chartArea, colors) => {
  if (!chartArea) return colors[0];
  
  const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(1, colors[1]);
  
  return gradient;
};

// Animation configurations
export const chartAnimations = {
  smooth: {
    duration: 750,
    easing: 'easeInOutQuart'
  },
  fast: {
    duration: 400,
    easing: 'easeOutQuart'
  },
  slow: {
    duration: 1200,
    easing: 'easeInOutCubic'
  }
};

// Default dataset styling
export const getDatasetDefaults = (type, index = 0) => {
  const colorKeys = Object.keys(chartColors);
  const colorKey = colorKeys[index % colorKeys.length];
  const color = chartColors[colorKey];

  const defaults = {
    borderWidth: 2,
    borderColor: color.main,
    backgroundColor: color.light,
    pointBackgroundColor: color.main,
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: color.main,
    pointRadius: 4,
    pointHoverRadius: 6,
    tension: 0.4
  };

  if (type === 'bar') {
    return {
      ...defaults,
      borderRadius: 6,
      borderSkipped: false,
      maxBarThickness: 40
    };
  }

  return defaults;
};
