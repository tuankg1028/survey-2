const TOTAL_TRAINING = 20;
const TOTAL_TESTING = 20;
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
  ["1", "personal data", "1", "null"],
  ["2", "name", "2", "1"],
  ["3", "phone number", "2", "1"],
  ["4", "email", "2", "1"],
  ["5", "location", "2", "1"],
  ["6", "age", "2", "1"],
  ["7", "gender", "2", "1"],
  ["8", "health data", "1", "null"],
  ["9", "steps", "2", "8"],
  ["10", "heart rate", "2", "8"],
  ["11", "weight", "2", "8"],
  ["12", "height", "2", "8"],
  ["13", "SPO2", "2", "8"],
  ["14", "calories", "2", "8"],
  ["15", "sugar level", "2", "8"],
  ["16", "fat level", "2", "8"],
  ["17", "travel distance", "2", "8"],
  ["18", "sleep", "2", "8"],
  ["19", "health goal", "2", "8"]
];
const permissions = [
  ["1", "device", "1", "null"],
  ["2", "Bluetooth", "2", "1"],
  ["3", "Camera", "2", "1"],
  ["4", "Location", "2", "1"],
  ["5", "File Storage", "2", "1"],
  ["6", "Microphone", "2", "1"],
  ["7", "Sensors", "2", "1"],
  ["8", "Wifi", "2", "1"],
  ["9", "Identity", "2", "1"],
  ["10", "Contacts", "2", "1"]
];
const interactions = [
  ["1", "outdoor", "1", "null"],
  ["2", "playing sport", "2", "1"],
  ["3", "relaxing", "2", "1"],
  ["4", "doing daily activities", "2", "1"],
  ["5", "indoor", "1", "null"],
  ["6", "at home", "2", "5"],
  ["7", "at work", "2", "5"],
  ["8", "having treatment at home", "2", "5"],
  ["9", "at the hospital", "2", "5"],
  ["10", "under an emergency", "2", "5"],
  ["11", "friends", "3", "2,3,4,6,7,8,9,10"],
  ["12", "family", "3", "2,3,4,6,7,8,9,10"],
  ["13", "doctors", "3", "2,3,4,6,7,8,9,10"],
  ["14", "nurses", "3", "2,3,4,6,7,8,9,10"],
  ["15", "location", "4", "11,12,13,14"],
  ["16", "steps", "4", "11,12,13,14"],
  ["17", "heart rate", "4", "11,12,13,14"],
  ["18", "weight", "4", "11,12,13,14"],
  ["19", "height", "4", "11,12,13,14"],
  ["20", "SPO2", "4", "11,12,13,14"],
  ["21", "calories", "4", "11,12,13,14"],
  ["22", "sugar level", "4", "11,12,13,14"],
  ["23", "fat level", "4", "11,12,13,14"],
  ["24", "travel distance", "4", "11,12,13,14"],
  ["25", "sleep quality", "4", "11,12,13,14"],
  ["26", "health goals", "4", "11,12,13,14"]
];
const services = [
  ["1", "Phone Application", "1", "null"],
  ["2", "Communication", "2", "1"],
  ["3", "Dating", "2", "1"],
  ["4", "Education", "2", "1"],
  ["5", "Entertainment", "2", "1"],
  ["6", "Events", "2", "1"],
  ["7", "Finance", "2", "1"],
  ["8", "Food & Drink", "2", "1"],
  ["9", "Health & Fitness", "2", "1"],
  ["10", "House & Home", "2", "1"],
  ["11", "Libraries & Demo", "2", "1"],
  ["12", "Lifestyle", "2", "1"],
  ["13", "Maps & Navigation", "2", "1"],
  ["14", "Medical", "2", "1"],
  ["15", "Music & Audio", "2", "1"],
  ["16", "News & Magazines", "2", "1"],
  ["17", "Parenting", "2", "1"],
  ["18", "Personalization", "2", "1"],
  ["19", "Photography", "2", "1"],
  ["20", "Productivity", "2", "1"],
  ["21", "Shopping", "2", "1"],
  ["22", "Social", "2", "1"],
  ["23", "Sports", "2", "1"],
  ["24", "Tools", "2", "1"],
  ["25", "Travel & Local", "2", "1"],
  ["26", "Video Players & Editors", "2", "1"],
  ["27", "Wear OS", "2", "1"],
  ["28", "Weather", "2", "1"],
  ["29", "Services", "1", "null"],
  ["30", "Education", "2", "29"],
  ["31", "Government", "2", "29"],
  ["32", "Marketing/Advertising", "2", "29"],
  ["33", "Product Development", "2", "29"],
  ["34", "Scientific Research", "2", "29"],
  ["35", "Treatment", "2", "29"],
  ["36", "Analytics", "2", "29"],
  ["37", "Apps' functional", "2", "29"]
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
  TOTAL_TESTING,
  TOTAL_TRAINING,
  interactions,
  permissions,
  collections,
  services,
  categoryGroups,
  categoriesCollection,
  categoriesThirdParty,
  STAGES
};
