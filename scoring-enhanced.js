// scoring-enhanced.js - Enhanced scoring with menu analysis and taste rubrics
import { CONFIG } from "./config.js";
import { clamp, random } from "./utils.js";

// ===== TASTE RUBRICS =====

// Flavor profiles for ingredients
export const FLAVOR_PROFILES = {
  // Proteins
  chicken: { umami: 3, richness: 2, delicacy: 4, complexity: 2 },
  beef: { umami: 5, richness: 5, delicacy: 2, complexity: 3 },
  pork: { umami: 4, richness: 4, delicacy: 3, complexity: 3 },
  lamb: { umami: 4, richness: 5, delicacy: 2, complexity: 4 },
  duck: { umami: 5, richness: 5, delicacy: 3, complexity: 4 },
  fish: { umami: 2, richness: 1, delicacy: 5, complexity: 2 },
  seafood: { umami: 4, richness: 2, delicacy: 4, complexity: 3 },
  
  // Vegetables
  carrot: { sweetness: 4, earthiness: 3, delicacy: 3, complexity: 2 },
  asparagus: { bitterness: 2, earthiness: 4, delicacy: 4, complexity: 3 },
  mushroom: { umami: 5, earthiness: 5, delicacy: 2, complexity: 4 },
  truffle: { umami: 5, earthiness: 5, delicacy: 1, complexity: 5 },
  spinach: { bitterness: 2, earthiness: 3, delicacy: 4, complexity: 2 },
  tomato: { acidity: 4, sweetness: 3, umami: 3, complexity: 3 },
  
  // Starches
  potato: { earthiness: 3, richness: 3, delicacy: 3, complexity: 2 },
  rice: { delicacy: 4, richness: 2, complexity: 2 },
  pasta: { richness: 3, delicacy: 3, complexity: 2 },
  polenta: { richness: 4, earthiness: 3, complexity: 2 },
  risotto: { richness: 4, creaminess: 5, complexity: 4 },
  gnocchi: { richness: 4, delicacy: 3, complexity: 3 },
  
  // Sauces
  butter: { richness: 5, creaminess: 4, delicacy: 4, complexity: 2 },
  wine: { acidity: 4, complexity: 5, delicacy: 3 },
  cream: { richness: 5, creaminess: 5, delicacy: 3, complexity: 2 },
  tomato_sauce: { acidity: 4, sweetness: 2, umami: 3, complexity: 3 },
  herb: { freshness: 5, complexity: 4, delicacy: 3 },
  reduction: { umami: 4, complexity: 5, richness: 4 }
};

// Flavor compatibility matrix
export const FLAVOR_COMPATIBILITY = {
  // Classic pairings (high synergy)
  excellent: [
    { protein: "fish", veg: "asparagus", sauce: "butter" },
    { protein: "beef", veg: "mushroom", sauce: "wine" },
    { protein: "duck", veg: "truffle", starch: "risotto" },
    { protein: "chicken", starch: "risotto", sauce: "herb" },
    { protein: "lamb", veg: "carrot", sauce: "wine" },
    { protein: "pork", veg: "mushroom", sauce: "cream" },
    { protein: "seafood", veg: "tomato", sauce: "herb" }
  ],
  
  // Good pairings (moderate synergy)
  good: [
    { protein: "chicken", veg: "carrot", sauce: "butter" },
    { protein: "beef", starch: "potato", sauce: "reduction" },
    { protein: "fish", veg: "spinach", sauce: "wine" },
    { protein: "pork", starch: "polenta", sauce: "herb" }
  ],
  
  // Poor pairings (conflicts)
  poor: [
    { protein: "fish", sauce: "tomato_sauce" }, // Too acidic for delicate fish
    { protein: "duck", sauce: "cream" }, // Too rich
    { protein: "seafood", sauce: "cream" }, // Conflicting textures
    { veg: "truffle", sauce: "tomato_sauce" } // Flavor clash
  ]
};

// Technique requirements for ingredients
export const TECHNIQUE_REQUIREMENTS = {
  // Proteins (by difficulty)
  fish: { 
    min_technique: 70, 
    techniques: ["precise knife work", "gentle cooking", "timing"],
    difficulty: "high"
  },
  seafood: { 
    min_technique: 75, 
    techniques: ["delicate handling", "quick cooking", "texture control"],
    difficulty: "very high"
  },
  duck: { 
    min_technique: 65, 
    techniques: ["fat rendering", "scoring", "temperature control"],
    difficulty: "high"
  },
  beef: { 
    min_technique: 55, 
    techniques: ["temperature control", "resting", "searing"],
    difficulty: "medium"
  },
  lamb: { 
    min_technique: 60, 
    techniques: ["temperature control", "fat trimming", "seasoning"],
    difficulty: "medium-high"
  },
  chicken: { 
    min_technique: 45, 
    techniques: ["even cooking", "moisture retention"],
    difficulty: "medium"
  },
  pork: { 
    min_technique: 50, 
    techniques: ["temperature control", "fat balance"],
    difficulty: "medium"
  },
  
  // Complex preparations
  risotto: { 
    min_technique: 65, 
    techniques: ["constant stirring", "liquid control", "al dente"],
    difficulty: "high"
  },
  gnocchi: { 
    min_technique: 60, 
    techniques: ["dough handling", "shaping", "light texture"],
    difficulty: "medium-high"
  },
  reduction: { 
    min_technique: 55, 
    techniques: ["reduction control", "sauce consistency"],
    difficulty: "medium-high"
  }
};

// ===== MENU ANALYSIS SYSTEM =====

export function analyzeMenu(menu, state) {
  const analysis = {
    overall_score: 0,
    category_scores: {},
    flavor_analysis: {},
    technique_analysis: {},
    presentation_analysis: {},
    feedback: [],
    strengths: [],
    weaknesses: []
  };
  
  // 1. FLAVOR ANALYSIS
  analysis.flavor_analysis = analyzeFlavorProfile(menu, state);
  analysis.category_scores.flavor = analysis.flavor_analysis.score;
  
  // 2. TECHNIQUE ANALYSIS
  analysis.technique_analysis = analyzeTechnique(menu, state);
  analysis.category_scores.technique = analysis.technique_analysis.score;
  
  // 3. PRESENTATION ANALYSIS
  analysis.presentation_analysis = analyzePresentation(menu, state);
  analysis.category_scores.presentation = analysis.presentation_analysis.score;
  
  // 4. EXECUTION ANALYSIS
  const execution = analyzeExecution(menu, state);
  analysis.category_scores.execution = execution.score;
  
  // Calculate overall score (weighted average)
  analysis.overall_score = (
    analysis.category_scores.flavor * 0.30 +
    analysis.category_scores.technique * 0.30 +
    analysis.category_scores.presentation * 0.25 +
    analysis.category_scores.execution * 0.15
  );
  
  // Generate detailed feedback
  analysis.feedback = generateFeedback(analysis, menu, state);
  analysis.strengths = identifyStrengths(analysis);
  analysis.weaknesses = identifyWeaknesses(analysis);
  
  return analysis;
}

// ===== FLAVOR PROFILE ANALYSIS =====

function analyzeFlavorProfile(menu, state) {
  const result = {
    score: 0,
    balance: 0,
    compatibility: 0,
    complexity: 0,
    details: []
  };
  
  // Get flavor profiles for each component
  const proteinFlavor = FLAVOR_PROFILES[menu.protein] || {};
  const vegFlavor = FLAVOR_PROFILES[menu.veg] || {};
  const starchFlavor = FLAVOR_PROFILES[menu.starch] || {};
  const sauceFlavor = FLAVOR_PROFILES[menu.sauce] || {};
  
  // 1. Check compatibility
  const compatibility = checkCompatibility(menu);
  result.compatibility = compatibility.score;
  result.details.push(compatibility.feedback);
  
  // 2. Calculate flavor balance
  const balance = calculateFlavorBalance(proteinFlavor, vegFlavor, starchFlavor, sauceFlavor);
  result.balance = balance.score;
  result.details.push(balance.feedback);
  
  // 3. Assess complexity
  const complexity = assessComplexity(proteinFlavor, vegFlavor, starchFlavor, sauceFlavor);
  result.complexity = complexity.score;
  result.details.push(complexity.feedback);
  
  // 4. Apply chef's palate skill
  const palateBonus = (state.palate / 100) * 15;
  
  // Final flavor score
  result.score = clamp(
    (result.compatibility * 0.4 + result.balance * 0.35 + result.complexity * 0.25) + palateBonus,
    0, 100
  );
  
  return result;
}

function checkCompatibility(menu) {
  // Check for excellent pairings
  for (const pairing of FLAVOR_COMPATIBILITY.excellent) {
    let matches = 0;
    if (pairing.protein && menu.protein === pairing.protein) matches++;
    if (pairing.veg && menu.veg === pairing.veg) matches++;
    if (pairing.starch && menu.starch === pairing.starch) matches++;
    if (pairing.sauce && menu.sauce === pairing.sauce) matches++;
    
    if (matches >= 3) {
      return {
        score: 90,
        feedback: "Exceptional pairing! Classic combination that judges love."
      };
    } else if (matches === 2) {
      return {
        score: 75,
        feedback: "Strong pairing. Components complement each other well."
      };
    }
  }
  
  // Check for poor pairings
  for (const pairing of FLAVOR_COMPATIBILITY.poor) {
    let conflicts = 0;
    if (pairing.protein && menu.protein === pairing.protein) conflicts++;
    if (pairing.veg && menu.veg === pairing.veg) conflicts++;
    if (pairing.starch && menu.starch === pairing.starch) conflicts++;
    if (pairing.sauce && menu.sauce === pairing.sauce) conflicts++;
    
    if (conflicts >= 2) {
      return {
        score: 40,
        feedback: "Flavor conflict detected. Components compete rather than complement."
      };
    }
  }
  
  // Default: good but not exceptional
  return {
    score: 65,
    feedback: "Solid pairing. Components work together adequately."
  };
}

function calculateFlavorBalance(protein, veg, starch, sauce) {
  // Combine all flavor attributes
  const combined = {};
  const flavors = [protein, veg, starch, sauce];
  
  flavors.forEach(flavor => {
    Object.keys(flavor).forEach(key => {
      combined[key] = (combined[key] || 0) + flavor[key];
    });
  });
  
  // Check for balance (no single flavor dominates)
  const values = Object.values(combined);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min;
  
  if (range <= 5) {
    return {
      score: 85,
      feedback: "Perfect balance across all flavor profiles."
    };
  } else if (range <= 10) {
    return {
      score: 70,
      feedback: "Good balance with slight emphasis on key flavors."
    };
  } else if (range <= 15) {
    return {
      score: 55,
      feedback: "Acceptable balance but some flavors dominate."
    };
  } else {
    return {
      score: 40,
      feedback: "Imbalanced flavor profile. Some notes overpower others."
    };
  }
}

function assessComplexity(protein, veg, starch, sauce) {
  // Count unique flavor attributes
  const allFlavors = new Set();
  [protein, veg, starch, sauce].forEach(flavor => {
    Object.keys(flavor).forEach(key => allFlavors.add(key));
  });
  
  const uniqueFlavors = allFlavors.size;
  
  if (uniqueFlavors >= 8) {
    return {
      score: 90,
      feedback: "Highly complex flavor profile with multiple dimensions."
    };
  } else if (uniqueFlavors >= 6) {
    return {
      score: 75,
      feedback: "Good complexity with interesting flavor layers."
    };
  } else if (uniqueFlavors >= 4) {
    return {
      score: 60,
      feedback: "Moderate complexity. Could use more flavor depth."
    };
  } else {
    return {
      score: 45,
      feedback: "Simple flavor profile. Lacks complexity and interest."
    };
  }
}

// ===== TECHNIQUE ANALYSIS =====

function analyzeTechnique(menu, state) {
  const result = {
    score: 0,
    skill_match: 0,
    difficulty: 0,
    details: []
  };
  
  // Analyze each component's technique requirements
  const components = [menu.protein, menu.veg, menu.starch, menu.sauce];
  const requirements = [];
  
  components.forEach(component => {
    if (TECHNIQUE_REQUIREMENTS[component]) {
      requirements.push(TECHNIQUE_REQUIREMENTS[component]);
    }
  });
  
  if (requirements.length === 0) {
    result.score = state.technique * 0.7;
    result.details.push("Standard technique requirements.");
    return result;
  }
  
  // Calculate highest technique requirement
  const maxRequired = Math.max(...requirements.map(r => r.min_technique || 0));
  
  // Check if chef's skill meets requirements
  if (state.technique >= maxRequired + 10) {
    result.skill_match = 90;
    result.details.push(`Excellent technique execution. Your ${state.technique} technique easily handles these components.`);
  } else if (state.technique >= maxRequired) {
    result.skill_match = 75;
    result.details.push(`Good technique execution. Your skill level matches requirements.`);
  } else if (state.technique >= maxRequired - 10) {
    result.skill_match = 55;
    result.details.push(`Adequate technique but pushing your limits. Some aspects may be inconsistent.`);
  } else {
    result.skill_match = 35;
    result.details.push(`Technique shortfall detected. These components require skill level ${maxRequired}, you're at ${state.technique}.`);
  }
  
  // Difficulty bonus (harder dishes score better when executed well)
  const avgDifficulty = requirements.length > 0 ? 
    requirements.filter(r => r.difficulty).length / requirements.length : 0;
  
  const difficultyMultiplier = 1 + (avgDifficulty * 0.15);
  
  // Apply cleanliness factor (HACCP compliance)
  const cleanlinessFactor = clamp(state.cleanliness / 100, 0.7, 1.0);
  
  result.score = clamp(
    result.skill_match * difficultyMultiplier * cleanlinessFactor,
    0, 100
  );
  
  // Add technique-specific feedback
  requirements.forEach(req => {
    if (req.techniques) {
      result.details.push(`Key techniques: ${req.techniques.join(", ")}`);
    }
  });
  
  return result;
}

// ===== PRESENTATION ANALYSIS =====

function analyzePresentation(menu, state) {
  const result = {
    score: 0,
    visual_appeal: 0,
    plating: 0,
    details: []
  };
  
  // Base presentation score from creativity stat
  const creativityBase = state.creativity * 0.7;
  
  // Wow factor from menu (already calculated in menu system)
  const menuCalc = calculateMenuProperties(menu);
  const wowBonus = menuCalc.wow * 2; // Convert to 0-20 scale
  
  // Color and texture variety
  const variety = assessVisualVariety(menu);
  result.visual_appeal = variety.score;
  result.details.push(variety.feedback);
  
  // Plating complexity
  const plating = assessPlatingComplexity(menu, state);
  result.plating = plating.score;
  result.details.push(plating.feedback);
  
  // Final score
  result.score = clamp(
    creativityBase + wowBonus + (variety.score * 0.2) + (plating.score * 0.2),
    0, 100
  );
  
  return result;
}

function assessVisualVariety(menu) {
  // Check for color and texture variety
  const colors = new Set();
  const textures = new Set();
  
  // Simplified color/texture mapping
  const colorMap = {
    chicken: "white", beef: "brown", pork: "pink", lamb: "red", 
    duck: "brown", fish: "white", seafood: "white",
    carrot: "orange", asparagus: "green", mushroom: "brown",
    truffle: "black", spinach: "green", tomato: "red",
    potato: "white", rice: "white", pasta: "yellow",
    polenta: "yellow", risotto: "white", gnocchi: "white"
  };
  
  [menu.protein, menu.veg, menu.starch].forEach(component => {
    if (colorMap[component]) colors.add(colorMap[component]);
  });
  
  if (colors.size >= 3) {
    return { score: 85, feedback: "Excellent visual variety with contrasting colors." };
  } else if (colors.size === 2) {
    return { score: 65, feedback: "Good color contrast on the plate." };
  } else {
    return { score: 45, feedback: "Limited color variety. Plate appears monochromatic." };
  }
}

function assessPlatingComplexity(menu, state) {
  // More complex ingredients = more plating skill required
  const menuCalc = calculateMenuProperties(menu);
  const requiredPrep = menuCalc.prep;
  
  if (state.prep >= requiredPrep + 10) {
    return { score: 90, feedback: "Exceptional plating organization and execution." };
  } else if (state.prep >= requiredPrep) {
    return { score: 75, feedback: "Well-organized plating with good flow." };
  } else if (state.prep >= requiredPrep - 10) {
    return { score: 55, feedback: "Adequate plating but shows signs of rushing." };
  } else {
    return { score: 35, feedback: "Plating appears rushed or disorganized." };
  }
}

// ===== EXECUTION ANALYSIS =====

function analyzeExecution(menu, state) {
  const result = {
    score: 0,
    details: []
  };
  
  // Fatigue impact
  let fatigueMultiplier = 1.0;
  if (state.fatigue >= 80) {
    fatigueMultiplier = 0.6;
    result.details.push("Critical fatigue affected execution quality.");
  } else if (state.fatigue >= 60) {
    fatigueMultiplier = 0.8;
    result.details.push("Fatigue visible in some aspects of execution.");
  } else if (state.fatigue <= 20) {
    fatigueMultiplier = 1.1;
    result.details.push("Excellent energy and focus throughout.");
  }
  
  // Risk management
  const menuCalc = calculateMenuProperties(menu);
  let riskMultiplier = 1.0;
  
  if (menuCalc.risk > 30) {
    riskMultiplier = 0.7;
    result.details.push("High risk menu led to execution errors.");
  } else if (menuCalc.risk > 25) {
    riskMultiplier = 0.85;
    result.details.push("Some risk-related inconsistencies noted.");
  } else if (menuCalc.risk < 15) {
    result.details.push("Safe execution with consistent results.");
  }
  
  // Base execution from technique
  const baseExecution = state.technique * 0.8;
  
  result.score = clamp(
    baseExecution * fatigueMultiplier * riskMultiplier,
    0, 100
  );
  
  return result;
}

// ===== HELPER: Calculate menu properties (from original system) =====

function calculateMenuProperties(menu) {
  // Simplified version - you'll want to import from your actual menu system
  // This is just for the scoring system to work standalone
  return {
    cost: 300,
    prep: 30,
    tech: 50,
    palate: 50,
    wow: 50,
    risk: 20
  };
}

// ===== FEEDBACK GENERATION =====

function generateFeedback(analysis, menu, state) {
  const feedback = [];
  
  // Overall impression
  if (analysis.overall_score >= 85) {
    feedback.push("🌟 Outstanding performance! This dish showcases mastery across all categories.");
  } else if (analysis.overall_score >= 75) {
    feedback.push("👏 Excellent work! A well-executed dish with strong fundamentals.");
  } else if (analysis.overall_score >= 65) {
    feedback.push("✓ Good performance. Solid execution with room for refinement.");
  } else if (analysis.overall_score >= 50) {
    feedback.push("⚠ Acceptable but with notable weaknesses that need addressing.");
  } else {
    feedback.push("❌ Significant issues across multiple categories require attention.");
  }
  
  // Category-specific feedback
  Object.entries(analysis.category_scores).forEach(([category, score]) => {
    if (score >= 80) {
      feedback.push(`✨ ${category.toUpperCase()}: Exceptional`);
    } else if (score < 60) {
      feedback.push(`⚠ ${category.toUpperCase()}: Needs improvement`);
    }
  });
  
  // Add detailed feedback from sub-analyses
  if (analysis.flavor_analysis.details) {
    feedback.push(...analysis.flavor_analysis.details);
  }
  if (analysis.technique_analysis.details) {
    feedback.push(...analysis.technique_analysis.details);
  }
  if (analysis.presentation_analysis.details) {
    feedback.push(...analysis.presentation_analysis.details);
  }
  
  return feedback;
}

function identifyStrengths(analysis) {
  const strengths = [];
  
  Object.entries(analysis.category_scores).forEach(([category, score]) => {
    if (score >= 80) {
      strengths.push(category);
    }
  });
  
  return strengths;
}

function identifyWeaknesses(analysis) {
  const weaknesses = [];
  
  Object.entries(analysis.category_scores).forEach(([category, score]) => {
    if (score < 60) {
      weaknesses.push(category);
    }
  });
  
  return weaknesses;
}

// ===== MAIN COMPETITION SCORING (replaces old system) =====

export function calculateCompetitionScore(state, approach = "standard", hasTestCooked = false, hasScouted = false) {
  const menu = state.menu || { protein: "chicken", veg: "carrot", starch: "potato", sauce: "butter" };
  
  // Get detailed menu analysis
  const analysis = analyzeMenu(menu, state);
  
  // Apply approach modifier
  let approachMultiplier = 1.0;
  let varianceRange = 10;
  
  if (approach === "safe") {
    approachMultiplier = 0.90;
    varianceRange = 5;
  } else if (approach === "bold") {
    approachMultiplier = 1.15;
    varianceRange = 15;
  }
  
  // Reduce variance if tested/scouted
  if (hasTestCooked) varianceRange *= 0.7;
  if (hasScouted) varianceRange *= 0.8;
  
  // Add variance (simulates judges, conditions, etc.)
  const variance = random(-varianceRange, varianceRange);
  
  // Final score
  const finalScore = clamp(
    (analysis.overall_score * approachMultiplier) + variance,
    0, 100
  );
  
  return {
    score: Math.round(finalScore),
    analysis: analysis,
    breakdown: {
      flavor: Math.round(analysis.category_scores.flavor),
      technique: Math.round(analysis.category_scores.technique),
      presentation: Math.round(analysis.category_scores.presentation),
      execution: Math.round(analysis.category_scores.execution)
    },
    approach: approach,
    variance: Math.round(variance),
    feedback: analysis.feedback,
    strengths: analysis.strengths,
    weaknesses: analysis.weaknesses
  };
}

export default {
  analyzeMenu,
  calculateCompetitionScore,
  FLAVOR_PROFILES,
  FLAVOR_COMPATIBILITY,
  TECHNIQUE_REQUIREMENTS
};
