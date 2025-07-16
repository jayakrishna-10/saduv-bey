// FILE: app/components/dashboard/ChapterPerformanceChart.js
'use client';

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler 
} from 'chart.js';
import { format, subDays } from 'date-fns';
import { Calendar, TrendingUp, Filter, ChevronDown } from 'lucide-react';
import { getChartOptions } from '@/lib/chart-config';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function ChapterPerformanceChart({ selectedChapters = [], dateRange = 30 }) {
  const [performanceData, setPerformanceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState(dateRange);
  const [showChapterSelector, setShowChapterSelector] = useState(false);

  useEffect(() => {
    fetchPerformanceData();
  }, [selectedChapters, dateFilter]);

  const fetchPerformanceData = async () => {
    if (selectedChapters.length === 0) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/user/chapter-performance?chapters=${selectedChapters.join(',')}&days=${dateFilter}`);
      const data = await response.json();
      
      if (response.ok) {
        processChartData(data.performanceData);
      }
    } catch (error) {
      console.error('Error fetching chapter performance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processChartData = (data) => {
    // Generate date labels for the selected range
    const labels = [];
    const endDate = new Date();
    const startDate = subDays(endDate, dateFilter);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      labels.push(format(new Date(d), 'MMM dd'));
    }

    // Process data for each chapter
    const datasets = selectedChapters.map((chapter, index) => {
      const chapterData = data.filter(d => d.chapter === chapter);
      const dataPoints = labels.map(label => {
        const dateData = chapterData.find(d => 
          format(new Date(d.date), 'MMM dd') === label
        );
        return dateData ? dateData.accuracy : null;
      });

      const colors = [
        'rgb(99, 102, 241)', // indigo
        'rgb(34, 197, 94)',  // green
        'rgb(251, 146, 60)', // orange
        'rgb(147, 51, 234)', // purple
        'rgb(14, 165, 233)', // sky
      ];

      return {
        label: chapter,
        data: dataPoints,
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length] + '20',
        tension: 0.3,
        fill: true,
      };
    });

    setPerformanceData({
      labels,
      datasets
    });
  };

  const chartOptions = getChartOptions('line', {
    title: 'Chapter Performance Over Time',
    yAxisLabel: 'Accuracy (%)',
    xAxisLabel: 'Date',
    enableLegend: true,
    maintainAspectRatio: false,
  });

  if (selectedChapters.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Chapter Performance Trends
        </h3>
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Select chapters to view performance trends</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Chapter Performance Trends
        </h3>
        
        <div className="flex items-center gap-3">
          {/* Date Range Selector */}
          <div className="relative">
            <button
              onClick={() => setShowChapterSelector(!showChapterSelector)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Calendar className="h-4 w-4" />
              Last {dateFilter} days
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {showChapterSelector && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                {[7, 30, 90, 365].map(days => (
                  <button
                    key={days}
                    onClick={() => {
                      setDateFilter(days);
                      setShowChapterSelector(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      dateFilter === days ? 'bg-gray-100 dark:bg-gray-700' : ''
                    }`}
                  >
                    Last {days} days
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {selectedChapters.length} chapter{selectedChapters.length !== 1 ? 's' : ''} selected
          </span>
        </div>
      </div>

      <div className="h-[300px]">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : performanceData ? (
          <Line data={performanceData} options={chartOptions} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            No data available for selected period
          </div>
        )}
      </div>
    </div>
  );
}
