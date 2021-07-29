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
  ["3", "phone", "2", "1"],
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
  ["2", "sport", "2", "1"],
  ["3", "relax", "2", "1"],
  ["4", "daily life", "2", "1"],
  ["5", "friends", "3", "2,3,4"],
  ["6", "family", "3", "2,3,4"],
  ["7", "colleagues", "3", "2,3"],
  ["8", "indoor", "1", "null"],
  ["9", "at home", "2", "8"],
  ["10", "at work", "2", "8"],
  ["11", "treatment at home", "2", "8"],
  ["12", "at hospital", "2", "8"],
  ["13", "family", "3", "9,10,11,12"],
  ["14", "friends", "3", "9,11,12"],
  ["15", "colleagues", "3", "10"],
  ["16", "doctors", "3", "11,12"],
  ["17", "nurses", "3", "11,12"]
];
const services = [
  ["1", "Application", "1", "null"],
  ["2", "Augmented Reality", "2", "1"],
  ["3", "Auto & Vehicles", "2", "1"],
  ["4", "Beauty", "2", "1"],
  ["5", "Books & Reference", "2", "1"],
  ["6", "Business", "2", "1"],
  ["7", "Comics", "2", "1"],
  ["8", "Communication", "2", "1"],
  ["9", "Dating", "2", "1"],
  ["10", "Daydream", "2", "1"],
  ["11", "Education", "2", "1"],
  ["12", "Entertainment", "2", "1"],
  ["13", "Events", "2", "1"],
  ["14", "Finance", "2", "1"],
  ["15", "Food & Drink", "2", "1"],
  ["16", "Health & Fitness", "2", "1"],
  ["17", "House & Home", "2", "1"],
  ["18", "Libraries & Demo", "2", "1"],
  ["19", "Lifestyle", "2", "1"],
  ["20", "Maps & Navigation", "2", "1"],
  ["21", "Medical", "2", "1"],
  ["22", "Music & Audio", "2", "1"],
  ["23", "News & Magazines", "2", "1"],
  ["24", "Parenting", "2", "1"],
  ["25", "Personalization", "2", "1"],
  ["26", "Photography", "2", "1"],
  ["27", "Productivity", "2", "1"],
  ["28", "Shopping", "2", "1"],
  ["29", "Social", "2", "1"],
  ["30", "Sports", "2", "1"],
  ["31", "Tools", "2", "1"],
  ["32", "Travel & Local", "2", "1"],
  ["33", "Video Players & Editors", "2", "1"],
  ["34", "Wear OS", "2", "1"],
  ["35", "Weather", "2", "1"],
  ["36", "Services", "1", "null"],
  ["37", "Education", "2", "37"],
  ["37", "Government", "2", "37"],
  ["38", "Marketing/Advertising", "2", "37"],
  ["39", "Product Development", "2", "37"],
  ["40", "Scientific Research", "2", "37"],
  ["41", "Treatment", "2", "37"],
  ["42", "Analytics", "2", "37"]
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
