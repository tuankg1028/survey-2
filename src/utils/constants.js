const categoryGroups = {
  Beauty: ["Beauty", "Lifestyle"],
  Business: ["Business"],
  Education: ["Education", "Educational"],
  Entertainment: ["Entertainment", "Photography"],
  Finance: [
    "Finance",
    "Events",
    "Action",
    "Action & Adventure",
    "Adventure",
    "Arcade",
    "Art & Design",
    "Auto & Vehicles",
    "Board",
    "Books & Reference",
    "Brain Games",
    "Card",
    "Casino",
    "Casual",
    "Comics",
    "Creativity",
    "House & Home",
    "Libraries & Demo",
    "News & Magazines",
    "Parenting",
    "Pretend Play",
    "Productivity",
    "Puzzle",
    "Racing",
    "Role Playing",
    "Simulation",
    "Strategy",
    "Trivia",
    "Weather",
    "Word"
  ],
  "Food & Drink": ["Food & Drink"],
  "Health & Fitness": ["Health & Fitness"],
  "Maps & Navigation": ["Maps & Navigation"],
  Medical: ["Medical"],
  "Music & Audio": [
    "Music & Audio",
    "Video Players & Editors",
    "Music & Video",
    "Music"
  ],
  Shopping: ["Shopping"],
  Social: ["Social", "Dating", "Communication"],
  Sports: ["Sports"],
  Tools: ["Tools", "Personalization"],
  "Travel & Local": ["Travel & Local"]
};

const categoriesCollection = [
  {
    id: "1",
    name: "Admin",
    level: "1",
    parent: "null",
    keywords: [""]
  },
  {
    id: "2",
    name: "Purchase",
    level: "1",
    parent: "null",
    keywords: ["business", "commercial", "businesses", "purchase"]
  },
  {
    id: "3",
    name: "Education",
    level: "1",
    parent: "null",
    keywords: [""]
  },
  {
    id: "4",
    name: "Healthcare",
    level: "1",
    parent: "null",
    keywords: [""]
  },
  {
    id: "5",
    name: "Booking",
    level: "1",
    parent: "null",
    keywords: ["booking"]
  },
  {
    id: "6",
    name: "Services",
    level: "1",
    parent: "null",
    keywords: [""]
  },
  {
    id: "7",
    name: "Marketing",
    level: "1",
    parent: "null",
    keywords: [""]
  },
  {
    id: "8",
    name: "Profiling",
    level: "2",
    parent: "1",
    keywords: ["profile", "profiling"]
  },
  {
    id: "9",
    name: "Analysis",
    level: "2",
    parent: "1",
    keywords: ["Analytics", "analysis", "analyze", "analyse", "analyzing"]
  },
  {
    id: "10",
    name: "Statistical",
    level: "2",
    parent: "1",
    keywords: ["Statistical", "statistics"]
  },
  {
    id: "11",
    name: "Advertisements",
    level: "2",
    parent: "1",
    keywords: ["ads", "advertising", "advertisement", "advertisers"]
  },
  {
    id: "12",
    name: "Maintenance",
    level: "2",
    parent: "1",
    keywords: ["maintain", "maintenance", "maintained"]
  },
  {
    id: "13",
    name: "Identifying",
    level: "2",
    parent: "1",
    keywords: [
      "identifier",
      "identifying",
      "authentication",
      "authenticate",
      "authenticates",
      "identity",
      "identities",
      "identifiable",
      "identifies"
    ]
  },
  {
    id: "14",
    name: "Testing/Troubleshooting",
    level: "2",
    parent: "1",
    keywords: ["Troubleshooting", "tests", "testing", "troubleshoot"]
  },
  {
    id: "15",
    name: "Payment",
    level: "2",
    parent: "2",
    keywords: ["purchase", "purchasing", "payment"]
  },
  {
    id: "16",
    name: "Delivery",
    level: "2",
    parent: "2",
    keywords: ["delivery", "shipping", "delivering"]
  },
  {
    id: "17",
    name: "Contacting",
    level: "2",
    parent: "2",
    keywords: ["Contacting", "contacts", "contacted", "communications"]
  },
  {
    id: "18",
    name: "Research",
    level: "2",
    parent: "3",
    keywords: ["research", "researching"]
  },
  {
    id: "19",
    name: "Survey",
    level: "2",
    parent: "3",
    keywords: ["survey"]
  },
  {
    id: "20",
    name: "Treatment",
    level: "2",
    parent: "4",
    keywords: ["Treatment"]
  },
  {
    id: "21",
    name: "Diagnosis",
    level: "2",
    parent: "4",
    keywords: ["diagnostics", "diagnosis"]
  },
  {
    id: "22",
    name: "Medical",
    level: "2",
    parent: "4",
    keywords: ["medical", "healthcare", "health care", "disease"]
  },
  {
    id: "23",
    name: "Improving quality",
    level: "2",
    parent: "6",
    keywords: ["improve", "improving", "improvement"]
  },
  {
    id: "24",
    name: "Developing the new services",
    level: "2",
    parent: "6",
    keywords: ["new service", "new product", "new feature", "new functions"]
  },
  {
    id: "25",
    name: "Direct Email",
    level: "2",
    parent: "7",
    keywords: ["direct && email"]
  },
  {
    id: "26",
    name: "Direct Phone",
    level: "2",
    parent: "7",
    keywords: ["direct && phone"]
  },
  {
    id: "27",
    name: "Booking",
    level: "2",
    parent: "5",
    keywords: ["booking"]
  }
];

const categoriesThirdParty = [
  {
    id: "0",
    name: "Third party",
    level: "0",
    parent: "null",
    keywords: [
      "Third-party",
      "3rd parties",
      "third party",
      "third parties",
      "3rd party"
    ]
  },
  {
    id: "2",
    name: "Purpose",
    level: "1",
    parent: "null",
    keywords: [""]
  },
  {
    id: "10",
    name: "Payment",
    level: "2",
    parent: "2",
    keywords: ["payment; purchase; order; credit card"]
  },
  {
    id: "11",
    name: "Delivery",
    level: "2",
    parent: "2",
    keywords: ["diliver; delivery; deliverer"]
  },
  {
    id: "12",
    name: "Marketing",
    level: "2",
    parent: "2",
    keywords: ["marketing"]
  },
  {
    id: "13",
    name: "Advertisement",
    level: "2",
    parent: "2",
    keywords: ["Advertising; ads; advertisement; advertiser;"]
  },
  {
    id: "14",
    name: "Analysis",
    level: "2",
    parent: "2",
    keywords: [
      "Analysis; analytical; analysed; analyzed; analytics; market research"
    ]
  }
];
// id, name, level, parent
const collections = [
  ["2", "name", "2", "1", ""],
  ["3", "phone", "2", "1", ""],
  ["4", "email", "2", "1", ""],
  ["5", "location", "2", "1", ""],
  ["6", "age", "2", "1", ""],
  ["7", "gender", "2", "1", ""],
  ["9", "steps", "2", "8", ""],
  ["10", "heart rate", "2", "8", ""],
  ["11", "weight", "2", "8", ""],
  ["12", "height", "2", "8", ""],
  ["13", "SPO2", "2", "8", ""],
  ["14", "calories", "2", "8", ""],
  ["15", "sugar level", "2", "8", ""],
  ["16", "fat level", "2", "8", ""]
];
const permissions = [
  ["2", "file storage", "2", "1", ""],
  ["3", "location", "2", "1", ""],
  ["4", "wireless connection", "2", "1", ""],
  ["5", "email, contacts", "2", "1", ""],
  ["6", "sensors", "2", "1", ""],
  ["7", "camera", "2", "1", ""],
  ["9", "location", "2", "8", ""],
  ["10", "wireless connection", "2", "8", ""]
];
const interactions = [
  ["1", "outdoor", "1", "null", ""],
  ["2", "sport", "2", "1", ""],
  ["3", "relax", "2", "1", ""],
  ["4", "daily life", "2", "1", ""],
  ["5", "friends", "3", "2,3,4", ""],
  ["6", "family", "3", "2,3,4", ""],
  ["7", "colleagues", "3", "2,3", ""],
  ["8", "indoor", "1", "null", ""],
  ["9", "at home", "2", "8", ""],
  ["10", "at work", "2", "8", ""],
  ["11", "having a treatment at home", "2", "8", ""],
  ["12", "having a treatment at hospital", "2", "8", ""],
  ["13", "family", "3", "9,10,11,12", ""],
  ["14", "friends", "3", "9,11,12", ""],
  ["15", "colleagues", "3", "10", ""],
  ["16", "doctors", "3", "11,12", ""],
  ["17", "nurses", "3", "11,12", ""]
];
const STAGES = {
  training: "training",
  testing1: "testing1",
  testing2: "testing2",
  testing3: "testing3",
  testing4: "testing4",
  end: "end"
};
export {
  interactions,
  permissions,
  collections,
  categoryGroups,
  categoriesCollection,
  categoriesThirdParty,
  STAGES
};
