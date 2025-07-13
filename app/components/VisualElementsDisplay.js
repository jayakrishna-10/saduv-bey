// app/components/VisualElementsDisplay.js
'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Table, 
  BarChart3, 
  Eye, 
  Download, 
  Maximize2, 
  X,
  Info,
  TrendingUp,
  PieChart
} from 'lucide-react';

export function VisualElementsDisplay({ visualElements }) {
  const [selectedChart, setSelectedChart] = useState(null);
  const [fullscreenTable, setFullscreenTable] = useState(null);

  if (!visualElements) return null;

  return (
    <div className="space-y-8">
      {/* Tables */}
      {visualElements.tables && visualElements.tables.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Table className="h-5 w-5 text-blue-500" />
            Data Tables ({visualElements.tables.length})
          </h4>
          <div className="space-y-6">
            {visualElements.tables.map((table, index) => (
              <motion.div
                key={table.table_id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {/* Table Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-gray-100">{table.title}</h5>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{table.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded text-xs">
                        {table.category}
                      </span>
                      <button
                        onClick={() => setFullscreenTable(table)}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        <Maximize2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        {table.headers.map((header, i) => (
                          <th key={i} className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-600">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {table.data.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          {row.map((cell, j) => (
                            <td key={j} className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table Insights */}
                {table.key_insights && table.key_insights.length > 0 && (
                  <div className="px-6 py-4 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-700">
                    <h6 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Key Insights
                    </h6>
                    <ul className="space-y-1">
                      {table.key_insights.map((insight, i) => (
                        <li key={i} className="text-blue-800 dark:text-blue-200 text-sm flex items-start gap-2">
                          <span className="text-blue-500 mt-1.5 w-1 h-1 rounded-full bg-current flex-shrink-0" />
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Usage Instructions */}
                {table.usage_instructions && (
                  <div className="px-6 py-4 bg-green-50 dark:bg-green-900/20 border-t border-green-200 dark:border-green-700">
                    <h6 className="font-medium text-green-900 dark:text-green-100 mb-2">Usage Instructions</h6>
                    <p className="text-green-800 dark:text-green-200 text-sm">{table.usage_instructions}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Charts and Graphs */}
      {visualElements.graphs_charts && visualElements.graphs_charts.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-500" />
            Charts & Graphs ({visualElements.graphs_charts.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visualElements.graphs_charts.map((chart, index) => (
              <motion.div
                key={chart.chart_id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer"
                onClick={() => setSelectedChart(chart)}
              >
                {/* Chart Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-gray-100">{chart.title}</h5>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{chart.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded text-xs">
                        {chart.type}
                      </span>
                      <Eye className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Chart Preview */}
                <div className="p-6">
                  <div className="h-48 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg flex items-center justify-center border border-purple-200 dark:border-purple-700">
                    <div className="text-center">
                      <PieChart className="h-12 w-12 text-purple-400 mx-auto mb-2" />
                      <p className="text-purple-600 dark:text-purple-400 text-sm">Click to view chart details</p>
                    </div>
                  </div>
                </div>

                {/* Chart Info */}
                {chart.axes_info && (
                  <div className="px-6 py-4 bg-purple-50 dark:bg-purple-900/20 border-t border-purple-200 dark:border-purple-700">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-purple-900 dark:text-purple-100">X-Axis:</span>
                        <p className="text-purple-800 dark:text-purple-200">{chart.axes_info.x_axis?.label}</p>
                      </div>
                      <div>
                        <span className="font-medium text-purple-900 dark:text-purple-100">Y-Axis:</span>
                        <p className="text-purple-800 dark:text-purple-200">{chart.axes_info.y_axis?.label}</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Diagrams */}
      {visualElements.diagrams && visualElements.diagrams.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Eye className="h-5 w-5 text-green-500" />
            Diagrams ({visualElements.diagrams.length})
          </h4>
          <div className="space-y-6">
            {visualElements.diagrams.map((diagram, index) => (
              <motion.div
                key={diagram.diagram_id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {/* Diagram Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-gray-100">{diagram.title}</h5>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{diagram.description}</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded text-xs">
                      {diagram.type}
                    </span>
                  </div>
                </div>

                {/* Diagram Content */}
                <div className="p-6">
                  <div className="mb-6">
                    <div className="h-64 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg flex items-center justify-center border border-green-200 dark:border-green-700">
                      <div className="text-center">
                        <Eye className="h-12 w-12 text-green-400 mx-auto mb-2" />
                        <p className="text-green-600 dark:text-green-400 text-sm">Diagram visualization</p>
                      </div>
                    </div>
                  </div>

                  {/* Components */}
                  {diagram.components && diagram.components.length > 0 && (
                    <div className="mb-6">
                      <h6 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Components</h6>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {diagram.components.map((component, i) => (
                          <div key={i} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                            <h7 className="font-medium text-green-900 dark:text-green-100 text-sm">{component.name}</h7>
                            <p className="text-green-800 dark:text-green-200 text-xs mt-1">{component.function}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Relationships */}
                  {diagram.key_relationships && diagram.key_relationships.length > 0 && (
                    <div>
                      <h6 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Key Relationships</h6>
                      <ul className="space-y-2">
                        {diagram.key_relationships.map((relationship, i) => (
                          <li key={i} className="text-gray-700 dark:text-gray-300 text-sm flex items-start gap-2">
                            <TrendingUp className="h-3 w-3 mt-0.5 flex-shrink-0 text-green-500" />
                            {relationship}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Table Modal */}
      {fullscreenTable && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setFullscreenTable(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">{fullscreenTable.title}</h3>
              <button
                onClick={() => setFullscreenTable(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      {fullscreenTable.headers.map((header, i) => (
                        <th key={i} className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-600">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {fullscreenTable.data.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        {row.map((cell, j) => (
                          <td key={j} className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Chart Details Modal */}
      {selectedChart && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setSelectedChart(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">{selectedChart.title}</h3>
              <button
                onClick={() => setSelectedChart(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
              <p className="text-gray-600 dark:text-gray-400 mb-6">{selectedChart.description}</p>
              
              {/* Chart Details */}
              <div className="space-y-6">
                {selectedChart.axes_info && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Axes Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">X-Axis</h5>
                        <p className="text-blue-800 dark:text-blue-200 text-sm">{selectedChart.axes_info.x_axis?.label}</p>
                        <p className="text-blue-600 dark:text-blue-400 text-xs mt-1">Units: {selectedChart.axes_info.x_axis?.units}</p>
                      </div>
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                        <h5 className="font-medium text-green-900 dark:text-green-100 mb-2">Y-Axis</h5>
                        <p className="text-green-800 dark:text-green-200 text-sm">{selectedChart.axes_info.y_axis?.label}</p>
                        <p className="text-green-600 dark:text-green-400 text-xs mt-1">Units: {selectedChart.axes_info.y_axis?.units}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedChart.key_data_points && selectedChart.key_data_points.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Key Data Points</h4>
                    <div className="space-y-3">
                      {selectedChart.key_data_points.map((point, i) => (
                        <div key={i} className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-purple-900 dark:text-purple-100">({point.x}, {point.y})</span>
                            <span className="text-purple-600 dark:text-purple-400 text-sm">{point.label}</span>
                          </div>
                          <p className="text-purple-800 dark:text-purple-200 text-sm">{point.significance}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedChart.interpretation && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Interpretation</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{selectedChart.interpretation}</p>
                  </div>
                )}

                {selectedChart.reading_technique && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Reading Technique</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{selectedChart.reading_technique}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
