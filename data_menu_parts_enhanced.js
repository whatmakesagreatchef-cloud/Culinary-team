// data_menu_parts_enhanced.js - Enhanced menu components with flavor profiles and techniques

export const MENU_PARTS = {
  proteins: [
    {
      id: "chicken",
      name: "Chicken (whole-bird discipline)",
      cost: 110,
      prep: 8,
      tech: 2,
      palate: 1,
      cre: 0,
      risk: 1,
      tags: ["classic", "accessible"],
      
      // Enhanced flavor profile
      flavor: {
        umami: 3,
        richness: 2,
        delicacy: 4,
        complexity: 2
      },
      
      // Technique requirements
      techniques: ["even cooking", "moisture retention", "temperature control"],
      min_skill: 45,
      
      // Pairing suggestions
      pairs_well: ["carrot", "mushroom", "asparagus", "potato", "rice", "butter", "herb", "wine"],
      avoid: [],
      
      description: "Versatile protein requiring consistent cooking. Judges value restraint and proper execution."
    },
    
    {
      id: "beef",
      name: "Beef (dry-aged premium)",
      cost: 250,
      prep: 10,
      tech: 3,
      palate: 2,
      cre: 1,
      risk: 2,
      tags: ["classic", "premium"],
      
      flavor: {
        umami: 5,
        richness: 5,
        delicacy: 2,
        complexity: 3
      },
      
      techniques: ["precise searing", "temperature control", "resting", "fat rendering"],
      min_skill: 55,
      
      pairs_well: ["mushroom", "truffle", "potato", "polenta", "wine", "reduction", "butter"],
      avoid: ["tomato_sauce"],
      
      description: "Bold, rich protein demanding precise doneness. Strong umami that needs careful balance."
    },
    
    {
      id: "pork",
      name: "Pork (heritage breed)",
      cost: 160,
      prep: 9,
      tech: 2,
      palate: 2,
      cre: 1,
      risk: 2,
      tags: ["accessible", "rich"],
      
      flavor: {
        umami: 4,
        richness: 4,
        delicacy: 3,
        complexity: 3
      },
      
      techniques: ["temperature control", "fat balance", "moisture retention"],
      min_skill: 50,
      
      pairs_well: ["mushroom", "carrot", "polenta", "gnocchi", "cream", "herb", "reduction"],
      avoid: [],
      
      description: "Well-rounded protein with good fat content. Benefits from complementary earthiness."
    },
    
    {
      id: "lamb",
      name: "Lamb (WA pasture)",
      cost: 180,
      prep: 9,
      tech: 2,
      palate: 2,
      cre: 1,
      risk: 2,
      tags: ["rich", "wa"],
      
      flavor: {
        umami: 4,
        richness: 5,
        delicacy: 2,
        complexity: 4
      },
      
      techniques: ["temperature control", "fat trimming", "seasoning balance"],
      min_skill: 60,
      
      pairs_well: ["carrot", "spinach", "potato", "polenta", "wine", "herb", "reduction"],
      avoid: ["cream"],
      
      description: "Distinctive protein with strong character. Requires confident seasoning and pairing."
    },
    
    {
      id: "duck",
      name: "Duck (render + glaze)",
      cost: 220,
      prep: 10,
      tech: 3,
      palate: 2,
      cre: 1,
      risk: 3,
      tags: ["high-skill", "premium"],
      
      flavor: {
        umami: 5,
        richness: 5,
        delicacy: 3,
        complexity: 4
      },
      
      techniques: ["fat rendering", "skin scoring", "temperature control", "glaze balance"],
      min_skill: 65,
      
      pairs_well: ["truffle", "mushroom", "spinach", "risotto", "gnocchi", "reduction", "wine"],
      avoid: ["cream", "tomato_sauce"],
      
      description: "Technical protein requiring perfect fat rendering. Rich flavor demands lighter accompaniments."
    },
    
    {
      id: "fish",
      name: "Fish (line-caught, sustainable)",
      cost: 200,
      prep: 12,
      tech: 4,
      palate: 3,
      cre: 1,
      risk: 4,
      tags: ["high-skill", "delicate"],
      
      flavor: {
        umami: 2,
        richness: 1,
        delicacy: 5,
        complexity: 2
      },
      
      techniques: ["gentle cooking", "precise timing", "delicate handling", "skin crisping"],
      min_skill: 70,
      
      pairs_well: ["asparagus", "spinach", "carrot", "rice", "potato", "butter", "herb", "wine"],
      avoid: ["tomato_sauce", "cream"],
      
      description: "Delicate protein requiring gentle touch and perfect timing. Overcooking is harshly penalized."
    },
    
    {
      id: "seafood",
      name: "Seafood (Marron/Scallops)",
      cost: 320,
      prep: 10,
      tech: 3,
      palate: 3,
      cre: 2,
      risk: 4,
      tags: ["wa", "hero", "premium"],
      
      flavor: {
        umami: 4,
        richness: 2,
        delicacy: 4,
        complexity: 3,
        sweetness: 2
      },
      
      techniques: ["quick cooking", "texture control", "delicate handling", "natural sweetness"],
      min_skill: 75,
      
      pairs_well: ["asparagus", "truffle", "carrot", "risotto", "gnocchi", "butter", "herb"],
      avoid: ["cream", "tomato_sauce", "heavy sauces"],
      
      description: "Premium, delicate protein. Natural sweetness requires subtle accompaniment. Judges expect perfection."
    }
  ],
  
  vegetables: [
    {
      id: "carrot",
      name: "Carrot (heritage varieties)",
      cost: 40,
      prep: 5,
      tech: 1,
      palate: 1,
      cre: 0,
      risk: 0,
      tags: ["accessible", "sweet"],
      
      flavor: {
        sweetness: 4,
        earthiness: 3,
        delicacy: 3,
        complexity: 2
      },
      
      techniques: ["knife work", "caramelization", "glazing"],
      min_skill: 40,
      
      pairs_well: ["chicken", "lamb", "beef", "fish"],
      avoid: [],
      
      description: "Versatile vegetable with natural sweetness. Good canvas for technique demonstration."
    },
    
    {
      id: "asparagus",
      name: "Asparagus (spring)",
      cost: 70,
      prep: 6,
      tech: 2,
      palate: 2,
      cre: 1,
      risk: 1,
      tags: ["seasonal", "delicate"],
      
      flavor: {
        bitterness: 2,
        earthiness: 4,
        delicacy: 4,
        complexity: 3
      },
      
      techniques: ["precise blanching", "texture retention", "peeling"],
      min_skill: 50,
      
      pairs_well: ["fish", "seafood", "chicken"],
      avoid: ["heavy sauces"],
      
      description: "Elegant vegetable requiring careful cooking. Overcooking destroys delicate texture."
    },
    
    {
      id: "mushroom",
      name: "Mushroom (foraged mix)",
      cost: 100,
      prep: 7,
      tech: 2,
      palate: 2,
      cre: 1,
      risk: 1,
      tags: ["earthy", "umami"],
      
      flavor: {
        umami: 5,
        earthiness: 5,
        delicacy: 2,
        complexity: 4
      },
      
      techniques: ["moisture control", "browning", "cleaning"],
      min_skill: 45,
      
      pairs_well: ["beef", "duck", "pork", "chicken"],
      avoid: ["fish"],
      
      description: "Umami-rich vegetable that enhances savory proteins. Adds depth and earthiness."
    },
    
    {
      id: "truffle",
      name: "Truffle (WA black)",
      cost: 180,
      prep: 8,
      tech: 2,
      palate: 3,
      cre: 2,
      risk: 2,
      tags: ["wa", "hero", "premium"],
      
      flavor: {
        umami: 5,
        earthiness: 5,
        delicacy: 1,
        complexity: 5
      },
      
      techniques: ["shaving", "timing", "heat control"],
      min_skill: 60,
      
      pairs_well: ["duck", "beef", "seafood"],
      avoid: ["fish", "tomato_sauce", "strong sauces"],
      
      description: "Powerful, luxurious ingredient. Can overwhelm if misused. Judges expect restraint."
    },
    
    {
      id: "spinach",
      name: "Spinach (baby leaf)",
      cost: 50,
      prep: 5,
      tech: 1,
      palate: 1,
      cre: 0,
      risk: 1,
      tags: ["accessible", "delicate"],
      
      flavor: {
        bitterness: 2,
        earthiness: 3,
        delicacy: 4,
        complexity: 2
      },
      
      techniques: ["quick cooking", "moisture control", "wilting"],
      min_skill: 40,
      
      pairs_well: ["fish", "lamb", "duck", "chicken"],
      avoid: [],
      
      description: "Delicate green requiring minimal cooking. Good texture contrast element."
    },
    
    {
      id: "tomato",
      name: "Tomato (heirloom)",
      cost: 60,
      prep: 6,
      tech: 1,
      palate: 1,
      cre: 1,
      risk: 1,
      tags: ["seasonal", "acidic"],
      
      flavor: {
        acidity: 4,
        sweetness: 3,
        umami: 3,
        complexity: 3
      },
      
      techniques: ["peeling", "concassé", "seasoning"],
      min_skill: 45,
      
      pairs_well: ["chicken", "pork"],
      avoid: ["fish", "seafood", "duck"],
      
      description: "Bright, acidic vegetable. Can clash with delicate proteins. Balance is key."
    }
  ],
  
  starches: [
    {
      id: "potato",
      name: "Potato (various techniques)",
      cost: 30,
      prep: 6,
      tech: 1,
      palate: 0,
      cre: 0,
      risk: 0,
      tags: ["accessible", "classic"],
      
      flavor: {
        earthiness: 3,
        richness: 3,
        delicacy: 3,
        complexity: 2
      },
      
      techniques: ["knife work", "cooking method", "texture control"],
      min_skill: 40,
      
      pairs_well: ["beef", "lamb", "fish", "chicken"],
      avoid: [],
      
      description: "Versatile starch with multiple preparation methods. Safe choice showing competence."
    },
    
    {
      id: "rice",
      name: "Rice (various cooking methods)",
      cost: 25,
      prep: 7,
      tech: 1,
      palate: 0,
      cre: 0,
      risk: 1,
      tags: ["accessible"],
      
      flavor: {
        delicacy: 4,
        richness: 2,
        complexity: 2
      },
      
      techniques: ["cooking ratio", "timing", "texture"],
      min_skill: 40,
      
      pairs_well: ["fish", "chicken", "seafood"],
      avoid: [],
      
      description: "Clean, neutral starch. Good for letting protein shine. Judges expect perfect texture."
    },
    
    {
      id: "pasta",
      name: "Pasta (fresh)",
      cost: 50,
      prep: 8,
      tech: 2,
      palate: 1,
      cre: 1,
      risk: 1,
      tags: ["classic"],
      
      flavor: {
        richness: 3,
        delicacy: 3,
        complexity: 2
      },
      
      techniques: ["rolling", "shaping", "cooking al dente"],
      min_skill: 50,
      
      pairs_well: ["chicken", "pork", "lamb"],
      avoid: ["fish", "seafood"],
      
      description: "Fresh pasta shows craft. Must be cooked al dente. Avoid with delicate proteins."
    },
    
    {
      id: "polenta",
      name: "Polenta (creamy)",
      cost: 40,
      prep: 9,
      tech: 2,
      palate: 1,
      cre: 1,
      risk: 1,
      tags: ["comfort", "rich"],
      
      flavor: {
        richness: 4,
        earthiness: 3,
        complexity: 2
      },
      
      techniques: ["stirring", "consistency", "enriching"],
      min_skill: 45,
      
      pairs_well: ["beef", "pork", "lamb"],
      avoid: ["fish", "seafood"],
      
      description: "Rich, comforting starch. Good for hearty proteins. Requires constant attention."
    },
    
    {
      id: "risotto",
      name: "Risotto (classic method)",
      cost: 80,
      prep: 12,
      tech: 3,
      palate: 2,
      cre: 1,
      risk: 3,
      tags: ["high-skill", "technical"],
      
      flavor: {
        richness: 4,
        creaminess: 5,
        complexity: 4
      },
      
      techniques: ["constant stirring", "liquid control", "al dente rice", "mantecatura"],
      min_skill: 65,
      
      pairs_well: ["duck", "seafood", "mushroom", "truffle"],
      avoid: [],
      
      description: "Technical starch requiring constant attention. Judges know proper risotto. High risk, high reward."
    },
    
    {
      id: "gnocchi",
      name: "Gnocchi (hand-rolled)",
      cost: 70,
      prep: 10,
      tech: 3,
      palate: 1,
      cre: 2,
      risk: 2,
      tags: ["technical", "craft"],
      
      flavor: {
        richness: 4,
        delicacy: 3,
        complexity: 3
      },
      
      techniques: ["dough handling", "shaping", "texture", "cooking point"],
      min_skill: 60,
      
      pairs_well: ["duck", "pork", "seafood"],
      avoid: [],
      
      description: "Artisanal starch showcasing handwork. Must be pillowy and light. Heavy gnocchi penalized."
    }
  ],
  
  sauces: [
    {
      id: "butter",
      name: "Butter-based (beurre blanc, etc.)",
      cost: 50,
      prep: 5,
      tech: 2,
      palate: 1,
      cre: 0,
      risk: 1,
      tags: ["classic", "rich"],
      
      flavor: {
        richness: 5,
        creaminess: 4,
        delicacy: 4,
        complexity: 2
      },
      
      techniques: ["emulsification", "temperature control", "acid balance"],
      min_skill: 50,
      
      pairs_well: ["fish", "seafood", "chicken", "asparagus"],
      avoid: ["duck"],
      
      description: "Classic French sauce. Elegant with delicate proteins. Can break if mishandled."
    },
    
    {
      id: "wine",
      name: "Wine reduction",
      cost: 80,
      prep: 8,
      tech: 2,
      palate: 2,
      cre: 1,
      risk: 2,
      tags: ["classic", "acidic"],
      
      flavor: {
        acidity: 4,
        complexity: 5,
        delicacy: 3
      },
      
      techniques: ["reduction technique", "balance", "consistency"],
      min_skill: 55,
      
      pairs_well: ["beef", "duck", "lamb", "mushroom"],
      avoid: [],
      
      description: "Sophisticated sauce with depth. Acidity cuts rich proteins. Requires good reduction."
    },
    
    {
      id: "cream",
      name: "Cream-based",
      cost: 60,
      prep: 6,
      tech: 2,
      palate: 1,
      cre: 0,
      risk: 1,
      tags: ["rich", "comfort"],
      
      flavor: {
        richness: 5,
        creaminess: 5,
        delicacy: 3,
        complexity: 2
      },
      
      techniques: ["reduction", "consistency", "balance"],
      min_skill: 45,
      
      pairs_well: ["pork", "chicken", "mushroom"],
      avoid: ["duck", "seafood", "fish"],
      
      description: "Rich, indulgent sauce. Can overwhelm delicate proteins. Needs acid balance."
    },
    
    {
      id: "tomato_sauce",
      name: "Tomato-based",
      cost: 40,
      prep: 7,
      tech: 1,
      palate: 1,
      cre: 0,
      risk: 1,
      tags: ["classic", "acidic"],
      
      flavor: {
        acidity: 4,
        sweetness: 2,
        umami: 3,
        complexity: 3
      },
      
      techniques: ["concassé", "seasoning", "consistency"],
      min_skill: 40,
      
      pairs_well: ["chicken", "pork"],
      avoid: ["fish", "seafood", "duck", "truffle"],
      
      description: "Bright, acidic sauce. Works with robust proteins. Clashes with delicate elements."
    },
    
    {
      id: "herb",
      name: "Herb-based (various)",
      cost: 55,
      prep: 6,
      tech: 2,
      palate: 2,
      cre: 2,
      risk: 1,
      tags: ["fresh", "light"],
      
      flavor: {
        freshness: 5,
        complexity: 4,
        delicacy: 3
      },
      
      techniques: ["herb preparation", "balance", "timing"],
      min_skill: 50,
      
      pairs_well: ["fish", "seafood", "chicken", "lamb"],
      avoid: [],
      
      description: "Fresh, bright sauce. Complements without overpowering. Shows restraint and finesse."
    },
    
    {
      id: "reduction",
      name: "Stock reduction (jus, etc.)",
      cost: 90,
      prep: 10,
      tech: 3,
      palate: 2,
      cre: 1,
      risk: 2,
      tags: ["classic", "technical"],
      
      flavor: {
        umami: 4,
        complexity: 5,
        richness: 4
      },
      
      techniques: ["reduction technique", "clarification", "seasoning"],
      min_skill: 55,
      
      pairs_well: ["beef", "duck", "lamb"],
      avoid: ["fish", "seafood"],
      
      description: "Classic French technique. Concentrated flavor, elegant finish. Judges expect clarity."
    }
  ]
};

// Helper to get parts by category
export const parts = {
  proteins: MENU_PARTS.proteins,
  vegetables: MENU_PARTS.vegetables,
  starches: MENU_PARTS.starches,
  sauces: MENU_PARTS.sauces
};

export default MENU_PARTS;
