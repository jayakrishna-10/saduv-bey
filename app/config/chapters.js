// app/config/chapters.js

export const books = [
  {
    id: 1,
    title: "General Aspects of Energy Management and Energy Audit",
    slug: "general-aspects",
    description: "Fundamental concepts and principles of energy management",
    color: "from-blue-500 to-indigo-600",
    chapters: [
      {
        id: "1.1",
        title: "Energy Scenario",
        slug: "energy-scenario",
        path: "b1c1",
        description: "Overview of energy scenarios, global and Indian context",
        readingTime: "25 mins",
        topics: ["Global Energy Scenario", "Indian Energy Scene", "Energy Security"],
        status: "available"
      },
      {
        id: "1.2",
        title: "Basics of Energy and its Various Forms",
        slug: "basics-of-energy",
        path: "b1c2",
        description: "Understanding different forms of energy and their fundamentals",
        readingTime: "30 mins",
        topics: ["Energy Forms", "Electrical Energy", "Thermal Energy"],
        status: "available"
      },
      {
        id: "1.3",
        title: "Energy Management and Audit",
        slug: "energy-management-audit",
        path: "b1c3",
        description: "Principles and practices of energy management and auditing",
        readingTime: "35 mins",
        topics: ["Energy Audit", "Management Systems", "Energy Performance"],
        status: "available"
      },
      {
        id: "1.4",
        title: "Material and Energy Balance",
        slug: "material-energy-balance",
        path: "b1c4",
        description: "Understanding material and energy flow in systems",
        readingTime: "30 mins",
        topics: ["Material Balance", "Energy Balance", "Flow Charts"],
        status: "available"
      },
      {
        id: "1.5",
        title: "Energy Action Planning",
        slug: "energy-action-planning",
        path: "b1c5",
        description: "Developing and implementing energy action plans",
        readingTime: "25 mins",
        topics: ["Action Planning", "Implementation", "Monitoring"],
        status: "coming-soon"
      },
      {
        id: "1.6",
        title: "Financial Management",
        slug: "financial-management",
        path: "b1c6",
        description: "Financial aspects of energy management projects",
        readingTime: "30 mins",
        topics: ["Financial Analysis", "Investment Criteria", "Project Finance"],
        status: "available"
      },
      {
        id: "1.7",
        title: "Project Management",
        slug: "project-management",
        path: "b1c7",
        description: "Managing energy efficiency projects effectively",
        readingTime: "35 mins",
        topics: ["Project Planning", "Implementation", "Monitoring"],
        status: "available"
      },
      {
        id: "1.8",
        title: "Energy Monitoring and Targeting",
        slug: "energy-monitoring",
        path: "b1c8",
        description: "Systems and methods for energy monitoring",
        readingTime: "30 mins",
        topics: ["Monitoring Systems", "Targeting", "Performance Analysis"],
        status: "available"
      },
      {
        id: "1.9",
        title: "Global Environmental Concerns",
        slug: "environmental-concerns",
        path: "b1c9",
        description: "Environmental impact and sustainability considerations",
        readingTime: "25 mins",
        topics: ["Climate Change", "Environmental Impact", "Sustainability"],
        status: "available"
      }
    ]
  },
  {
    id: 2,
    title: "Energy Efficiency in Thermal Utilities",
    slug: "thermal-utilities",
    description: "Comprehensive coverage of thermal energy systems",
    color: "from-orange-500 to-red-600",
    chapters: [
      {
        id: "2.1",
        title: "Fuels and Combustion",
        slug: "fuels-combustion",
        path: "b2c1",
        description: "Understanding fuel types and combustion processes",
        readingTime: "30 mins",
        topics: ["Fuels", "Combustion", "Efficiency"],
        status: "available"
      },
      {
        id: "2.2",
        title: "Boilers",
        slug: "boilers",
        path: "b2c2",
        description: "Boiler systems and their optimization",
        readingTime: "35 mins",
        topics: ["Boiler Types", "Efficiency", "Operations"],
        status: "available"
      },
      {
        id: "2.3",
        title: "Steam System",
        slug: "steam-system",
        path: "b2c3",
        description: "Steam generation and distribution systems",
        readingTime: "30 mins",
        topics: ["Steam Generation", "Distribution", "Usage"],
        status: "available"
      },
      {
        id: "2.4",
        title: "Furnaces",
        slug: "furnaces",
        path: "b2c4",
        description: "Industrial furnaces and their efficiency",
        readingTime: "25 mins",
        topics: ["Furnace Types", "Operations", "Optimization"],
        status: "available"
      },
      {
        id: "2.5",
        title: "Insulation and Refractories",
        slug: "insulation",
        path: "b2c5",
        description: "Thermal insulation and refractory materials",
        readingTime: "30 mins",
        topics: ["Insulation", "Refractories", "Heat Loss"],
        status: "available"
      },
      {
        id: "2.6",
        title: "FBC Boilers",
        slug: "fbc-boilers",
        path: "b2c6",
        description: "Fluidized bed combustion boilers",
        readingTime: "35 mins",
        topics: ["FBC Technology", "Operations", "Benefits"],
        status: "available"
      },
      {
        id: "2.7",
        title: "Cogeneration",
        slug: "cogeneration",
        path: "b2c7",
        description: "Combined heat and power systems",
        readingTime: "30 mins",
        topics: ["CHP Systems", "Applications", "Benefits"],
        status: "available"
      },
      {
        id: "2.8",
        title: "Waste Heat Recovery",
        slug: "waste-heat-recovery",
        path: "b2c8",
        description: "Systems and methods for heat recovery",
        readingTime: "25 mins",
        topics: ["Heat Recovery", "Applications", "Economics"],
        status: "available"
      }
    ]
  },
  {
    id: 3,
    title: "Energy Efficiency in Electrical Utilities",
    slug: "electrical-utilities",
    description: "Detailed study of electrical energy systems",
    color: "from-emerald-500 to-cyan-600",
    chapters: [
      {
        id: "3.1",
        title: "Electric Motors",
        slug: "electric-motors",
        path: "b3c1",
        description: "Types, efficiency, and operation of electric motors",
        readingTime: "30 mins",
        topics: ["Motor Types", "Efficiency", "Applications"],
        status: "available"
      },
      {
        id: "3.2",
        title: "Compressed Air Systems",
        slug: "compressed-air",
        path: "b3c2",
        description: "Compressed air generation and distribution",
        readingTime: "35 mins",
        topics: ["Generation", "Distribution", "Efficiency"],
        status: "available"
      },
      {
        id: "3.3",
        title: "HVAC Systems",
        slug: "hvac-systems",
        path: "b3c3",
        description: "Heating, ventilation, and air conditioning",
        readingTime: "30 mins",
        topics: ["HVAC Types", "Efficiency", "Control"],
        status: "available"
      },
      {
        id: "3.4",
        title: "Fans and Blowers",
        slug: "fans-blowers",
        path: "b3c4",
        description: "Types and applications of fans and blowers",
        readingTime: "25 mins",
        topics: ["Types", "Selection", "Efficiency"],
        status: "available"
      },
      {
        id: "3.5",
        title: "Pumps and Pumping Systems",
        slug: "pumping-systems",
        path: "b3c5",
        description: "Pump types and system optimization",
        readingTime: "30 mins",
        topics: ["Pump Types", "Systems", "Efficiency"],
        status: "available"
      },
      {
        id: "3.6",
        title: "Cooling Towers",
        slug: "cooling-towers",
        path: "b3c6",
        description: "Types and operation of cooling towers",
        readingTime: "35 mins",
        topics: ["Tower Types", "Operation", "Efficiency"],
        status: "available"
      },
      {
        id: "3.7",
        title: "Lighting Systems",
        slug: "lighting-systems",
        path: "b3c7",
        description: "Energy-efficient lighting solutions",
        readingTime: "30 mins",
        topics: ["Light Sources", "Controls", "Efficiency"],
        status: "available"
      },
      {
        id: "3.8",
        title: "DG Sets",
        slug: "dg-sets",
        path: "b3c8",
        description: "Diesel generator sets and their efficiency",
        readingTime: "25 mins",
        topics: ["DG Types", "Operation", "Maintenance"],
        status: "available"
      },
      {
        id: "3.9",
        title: "Power Factor",
        slug: "power-factor",
        path: "b3c9",
        description: "Understanding and improving power factor",
        readingTime: "30 mins",
        topics: ["PF Basics", "Correction", "Benefits"],
        status: "available"
      },
      {
        id: "3.10",
        title: "Maximum Demand Control",
        slug: "maximum-demand-control",
        path: "b3c10",
        description: "Managing and controlling maximum power demand",
        readingTime: "25 mins",
        topics: ["Demand Management", "Control Strategies", "Cost Optimization"],
        status: "available"
      }
    ]
  }
];

// Helper functions
export function getBookBySlug(slug) {
  return books.find(book => book.slug === slug);
}

export function getChapterBySlug(bookSlug, chapterSlug) {
  const book = getBookBySlug(bookSlug);
  return book?.chapters.find(chapter => chapter.slug === chapterSlug);
}

export function getNextChapter(bookSlug, currentChapterSlug) {
  const book = getBookBySlug(bookSlug);
  const currentIndex = book?.chapters.findIndex(chapter => chapter.slug === currentChapterSlug);
  return book?.chapters[currentIndex + 1];
}

export function getPreviousChapter(bookSlug, currentChapterSlug) {
  const book = getBookBySlug(bookSlug);
  const currentIndex = book?.chapters.findIndex(chapter => chapter.slug === currentChapterSlug);
  return book?.chapters[currentIndex - 1];
}

export function getAllTopics() {
  const topicsSet = new Set();
  books.forEach(book => {
    book.chapters.forEach(chapter => {
      chapter.topics.forEach(topic => topicsSet.add(topic));
    });
  });
  return Array.from(topicsSet).sort();
}

export function searchChapters(query) {
  const normalizedQuery = query.toLowerCase();
  return books.flatMap(book =>
    book.chapters
      .filter(chapter =>
        chapter.title.toLowerCase().includes(normalizedQuery) ||
        chapter.description.toLowerCase().includes(normalizedQuery) ||
        chapter.topics.some(topic => topic.toLowerCase().includes(normalizedQuery))
      )
      .map(chapter => ({
        ...chapter,
        bookTitle: book.title,
        bookSlug: book.slug
      }))
  );
}

export function getChapterStatus(bookSlug, chapterSlug) {
  const chapter = getChapterBySlug(bookSlug, chapterSlug);
  return chapter?.status || 'unavailable';
}
