// app/lib/revision-export-utils.js
/**
 * Utility functions for exporting and importing revision notes
 * Supports multiple formats: JSON, Markdown, PDF-ready HTML
 */

// Export revision notes to JSON format
export function exportToJSON(revisionData, options = {}) {
  const {
    includeMetadata = true,
    includeFormulas = true,
    includeVisuals = false, // Visual elements can be large
    compactFormat = false
  } = options;

  const exportData = {
    exportInfo: {
      timestamp: new Date().toISOString(),
      version: '1.0',
      source: 'NCE Revision Notes Platform'
    }
  };

  if (includeMetadata && revisionData.metadata) {
    exportData.metadata = revisionData.metadata;
  }

  if (revisionData.learning_objectives) {
    exportData.learning_objectives = revisionData.learning_objectives;
  }

  if (revisionData.key_concepts) {
    exportData.key_concepts = revisionData.key_concepts;
  }

  if (includeFormulas && revisionData.formulas_quick_reference) {
    exportData.formulas_quick_reference = revisionData.formulas_quick_reference;
  }

  if (revisionData.content_sections) {
    exportData.content_sections = revisionData.content_sections.map(section => ({
      ...section,
      // Optionally exclude visual elements to reduce size
      visual_elements: includeVisuals ? section.visual_elements : undefined
    }));
  }

  if (revisionData.exam_strategy) {
    exportData.exam_strategy = revisionData.exam_strategy;
  }

  if (revisionData.terminology_glossary) {
    exportData.terminology_glossary = revisionData.terminology_glossary;
  }

  if (revisionData.quick_revision_checklist) {
    exportData.quick_revision_checklist = revisionData.quick_revision_checklist;
  }

  const jsonString = JSON.stringify(exportData, null, compactFormat ? 0 : 2);
  return jsonString;
}

// Export revision notes to Markdown format
export function exportToMarkdown(revisionData, chapterInfo = {}) {
  let markdown = '';

  // Header
  markdown += `# ${chapterInfo.title || 'Revision Notes'}\n\n`;
  
  if (chapterInfo.paper && chapterInfo.chapter) {
    markdown += `**Paper:** ${chapterInfo.paper} | **Chapter:** ${chapterInfo.chapter}\n\n`;
  }

  // Metadata
  if (revisionData.metadata) {
    markdown += `## Chapter Overview\n\n`;
    markdown += `- **Difficulty:** ${revisionData.metadata.difficulty_level || 'N/A'}\n`;
    markdown += `- **Study Time:** ${revisionData.metadata.estimated_study_time_hours || 'N/A'} hours\n`;
    markdown += `- **Exam Weight:** ${revisionData.metadata.exam_weightage_percentage || 'N/A'}%\n`;
    markdown += `- **Complexity Score:** ${revisionData.metadata.content_complexity_score || 'N/A'}/10\n\n`;
  }

  // Learning Objectives
  if (revisionData.learning_objectives?.length > 0) {
    markdown += `## Learning Objectives\n\n`;
    revisionData.learning_objectives.forEach((obj, index) => {
      markdown += `${index + 1}. **${obj.objective}** (${obj.bloom_level})\n`;
      if (obj.exam_relevance) {
        markdown += `   - *Exam relevance: ${obj.exam_relevance}*\n`;
      }
    });
    markdown += '\n';
  }

  // Key Concepts
  if (revisionData.key_concepts?.length > 0) {
    markdown += `## Key Concepts\n\n`;
    revisionData.key_concepts.forEach(concept => {
      markdown += `### ${concept.name}\n\n`;
      markdown += `${concept.definition}\n\n`;
      
      if (concept.importance) {
        markdown += `**Why it matters:** ${concept.importance}\n\n`;
      }
      
      if (concept.real_world_applications?.length > 0) {
        markdown += `**Applications:**\n`;
        concept.real_world_applications.forEach(app => {
          markdown += `- ${app}\n`;
        });
        markdown += '\n';
      }
      
      if (concept.common_misconceptions?.length > 0) {
        markdown += `**Common mistakes:**\n`;
        concept.common_misconceptions.forEach(mistake => {
          markdown += `- ⚠️ ${mistake}\n`;
        });
        markdown += '\n';
      }
    });
  }

  // Quick Reference Formulas
  if (revisionData.formulas_quick_reference?.length > 0) {
    markdown += `## Quick Reference Formulas\n\n`;
    revisionData.formulas_quick_reference.forEach(formula => {
      markdown += `### ${formula.category}\n\n`;
      markdown += `\`\`\`\n${formula.quick_form}\n\`\`\`\n\n`;
      
      if (formula.when_to_use) {
        markdown += `**When to use:** ${formula.when_to_use}\n\n`;
      }
      
      if (formula.memory_aid) {
        markdown += `**Memory aid:** ${formula.memory_aid}\n\n`;
      }
    });
  }

  // Content Sections (simplified)
  if (revisionData.content_sections?.length > 0) {
    markdown += `## Detailed Content\n\n`;
    revisionData.content_sections.forEach(section => {
      markdown += `### ${section.title}\n\n`;
      markdown += `${section.summary}\n\n`;
      
      // Key Points
      if (section.detailed_content?.key_points?.length > 0) {
        markdown += `**Key Points:**\n`;
        section.detailed_content.key_points.forEach(point => {
          markdown += `- ${point.point}\n`;
          if (point.explanation) {
            markdown += `  - ${point.explanation}\n`;
          }
        });
        markdown += '\n';
      }
    });
  }

  // Exam Strategy
  if (revisionData.exam_strategy) {
    markdown += `## Exam Strategy\n\n`;
    
    if (revisionData.exam_strategy.high_yield_topics?.length > 0) {
      markdown += `### High Yield Topics\n\n`;
      revisionData.exam_strategy.high_yield_topics.forEach(topic => {
        markdown += `**${topic.topic}** (${topic.exam_frequency})\n`;
        markdown += `- Priority: ${topic.preparation_priority}/10\n`;
        markdown += `- ${topic.study_approach}\n\n`;
      });
    }
  }

  // Terminology
  if (revisionData.terminology_glossary?.length > 0) {
    markdown += `## Terminology\n\n`;
    revisionData.terminology_glossary.forEach(term => {
      markdown += `**${term.term}:** ${term.definition}\n\n`;
    });
  }

  // Quick Revision Checklist
  if (revisionData.quick_revision_checklist?.length > 0) {
    markdown += `## Quick Revision Checklist\n\n`;
    
    const priorityGroups = {
      must_know: 'Must Know',
      should_know: 'Should Know',
      good_to_know: 'Good to Know'
    };
    
    Object.entries(priorityGroups).forEach(([priority, label]) => {
      const items = revisionData.quick_revision_checklist.filter(item => item.priority === priority);
      if (items.length > 0) {
        markdown += `### ${label}\n\n`;
        items.forEach(item => {
          markdown += `- [ ] ${item.item} (${item.time_required})\n`;
        });
        markdown += '\n';
      }
    });
  }

  markdown += `\n---\n*Generated on ${new Date().toLocaleDateString()} from NCE Revision Notes Platform*\n`;

  return markdown;
}

// Export to HTML format (suitable for printing or PDF conversion)
export function exportToHTML(revisionData, chapterInfo = {}) {
  const title = chapterInfo.title || 'Revision Notes';
  
  let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { 
            font-family: 'Georgia', serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px;
            background: white;
        }
        h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
        h2 { color: #34495e; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px; margin-top: 30px; }
        h3 { color: #2c3e50; margin-top: 25px; }
        .metadata { background: #ecf0f1; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .concept { border-left: 4px solid #3498db; padding-left: 15px; margin: 15px 0; }
        .formula { background: #f8f9fa; border: 1px solid #dee2e6; padding: 15px; border-radius: 5px; font-family: 'Courier New', monospace; }
        .important { background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 5px; }
        .critical { background: #f8d7da; border: 1px solid #f5c6cb; padding: 10px; border-radius: 5px; }
        .checklist { list-style-type: none; }
        .checklist li { margin: 5px 0; }
        .checklist li::before { content: "☐ "; font-weight: bold; }
        .priority-high { color: #dc3545; font-weight: bold; }
        .priority-medium { color: #fd7e14; }
        .priority-low { color: #28a745; }
        @media print {
            body { margin: 0; padding: 15px; }
            .no-print { display: none; }
            h1, h2 { page-break-after: avoid; }
        }
    </style>
</head>
<body>`;

  // Header
  html += `<h1>${title}</h1>`;
  
  if (chapterInfo.paper && chapterInfo.chapter) {
    html += `<p><strong>Paper:</strong> ${chapterInfo.paper} | <strong>Chapter:</strong> ${chapterInfo.chapter}</p>`;
  }

  // Metadata
  if (revisionData.metadata) {
    html += `<div class="metadata">`;
    html += `<h2>Chapter Overview</h2>`;
    html += `<ul>`;
    html += `<li><strong>Difficulty:</strong> ${revisionData.metadata.difficulty_level || 'N/A'}</li>`;
    html += `<li><strong>Study Time:</strong> ${revisionData.metadata.estimated_study_time_hours || 'N/A'} hours</li>`;
    html += `<li><strong>Exam Weight:</strong> ${revisionData.metadata.exam_weightage_percentage || 'N/A'}%</li>`;
    html += `<li><strong>Complexity Score:</strong> ${revisionData.metadata.content_complexity_score || 'N/A'}/10</li>`;
    html += `</ul>`;
    html += `</div>`;
  }

  // Learning Objectives
  if (revisionData.learning_objectives?.length > 0) {
    html += `<h2>Learning Objectives</h2><ol>`;
    revisionData.learning_objectives.forEach(obj => {
      html += `<li><strong>${obj.objective}</strong> (${obj.bloom_level})`;
      if (obj.exam_relevance) {
        html += `<br><em>Exam relevance: ${obj.exam_relevance}</em>`;
      }
      html += `</li>`;
    });
    html += `</ol>`;
  }

  // Key Concepts
  if (revisionData.key_concepts?.length > 0) {
    html += `<h2>Key Concepts</h2>`;
    revisionData.key_concepts.forEach(concept => {
      html += `<div class="concept">`;
      html += `<h3>${concept.name}</h3>`;
      html += `<p>${concept.definition}</p>`;
      
      if (concept.importance) {
        html += `<p><strong>Why it matters:</strong> ${concept.importance}</p>`;
      }
      
      if (concept.real_world_applications?.length > 0) {
        html += `<p><strong>Applications:</strong></p><ul>`;
        concept.real_world_applications.forEach(app => {
          html += `<li>${app}</li>`;
        });
        html += `</ul>`;
      }
      
      html += `</div>`;
    });
  }

  // Quick Reference Formulas
  if (revisionData.formulas_quick_reference?.length > 0) {
    html += `<h2>Quick Reference Formulas</h2>`;
    revisionData.formulas_quick_reference.forEach(formula => {
      html += `<div class="formula">`;
      html += `<h3>${formula.category}</h3>`;
      html += `<pre>${formula.quick_form}</pre>`;
      
      if (formula.when_to_use) {
        html += `<p><strong>When to use:</strong> ${formula.when_to_use}</p>`;
      }
      
      if (formula.memory_aid) {
        html += `<p><strong>Memory aid:</strong> ${formula.memory_aid}</p>`;
      }
      
      html += `</div>`;
    });
  }

  // Quick Revision Checklist
  if (revisionData.quick_revision_checklist?.length > 0) {
    html += `<h2>Quick Revision Checklist</h2>`;
    
    const priorityGroups = {
      must_know: { label: 'Must Know', class: 'priority-high' },
      should_know: { label: 'Should Know', class: 'priority-medium' },
      good_to_know: { label: 'Good to Know', class: 'priority-low' }
    };
    
    Object.entries(priorityGroups).forEach(([priority, config]) => {
      const items = revisionData.quick_revision_checklist.filter(item => item.priority === priority);
      if (items.length > 0) {
        html += `<h3 class="${config.class}">${config.label}</h3>`;
        html += `<ul class="checklist">`;
        items.forEach(item => {
          html += `<li class="${config.class}">${item.item} <em>(${item.time_required})</em></li>`;
        });
        html += `</ul>`;
      }
    });
  }

  html += `
<hr>
<p><em>Generated on ${new Date().toLocaleDateString()} from NCE Revision Notes Platform</em></p>
</body>
</html>`;

  return html;
}

// Download file helper
export function downloadFile(content, filename, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

// Export functions with download
export function downloadAsJSON(revisionData, chapterInfo = {}, options = {}) {
  const jsonContent = exportToJSON(revisionData, options);
  const filename = `${chapterInfo.paper || 'paper'}_${chapterInfo.chapter || 'chapter'}_revision_notes.json`;
  downloadFile(jsonContent, filename, 'application/json');
}

export function downloadAsMarkdown(revisionData, chapterInfo = {}) {
  const markdownContent = exportToMarkdown(revisionData, chapterInfo);
  const filename = `${chapterInfo.paper || 'paper'}_${chapterInfo.chapter || 'chapter'}_revision_notes.md`;
  downloadFile(markdownContent, filename, 'text/markdown');
}

export function downloadAsHTML(revisionData, chapterInfo = {}) {
  const htmlContent = exportToHTML(revisionData, chapterInfo);
  const filename = `${chapterInfo.paper || 'paper'}_${chapterInfo.chapter || 'chapter'}_revision_notes.html`;
  downloadFile(htmlContent, filename, 'text/html');
}

// Print helper
export function printRevisionNotes(revisionData, chapterInfo = {}) {
  const htmlContent = exportToHTML(revisionData, chapterInfo);
  const printWindow = window.open('', '_blank');
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}

// Import validation helper
export function validateImportedData(data) {
  const errors = [];
  const warnings = [];

  // Basic structure validation
  if (!data || typeof data !== 'object') {
    errors.push('Invalid data format: must be a valid JSON object');
    return { isValid: false, errors, warnings };
  }

  // Check for required fields
  const requiredFields = ['metadata', 'key_concepts'];
  requiredFields.forEach(field => {
    if (!data[field]) {
      warnings.push(`Missing ${field} section`);
    }
  });

  // Validate metadata structure
  if (data.metadata && typeof data.metadata !== 'object') {
    errors.push('Invalid metadata format');
  }

  // Validate concepts array
  if (data.key_concepts && !Array.isArray(data.key_concepts)) {
    errors.push('key_concepts must be an array');
  }

  // Check version compatibility
  if (data.exportInfo?.version && data.exportInfo.version !== '1.0') {
    warnings.push(`Data exported from version ${data.exportInfo.version}, may have compatibility issues`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
