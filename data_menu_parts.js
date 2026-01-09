export const MENU_PARTS = {
  "proteins": [
    {
      "id": "chicken",
      "name": "Chicken (whole-bird discipline)",
      "cost": 110,
      "prep": 8,
      "tech": 2,
      "palate": 1,
      "cre": 0,
      "risk": 1,
      "tags": [
        "classic",
        "accessible"
      ]
    },
    {
      "id": "lamb",
      "name": "Lamb (WA pasture)",
      "cost": 180,
      "prep": 9,
      "tech": 2,
      "palate": 2,
      "cre": 1,
      "risk": 2,
      "tags": [
        "rich",
        "wa"
      ]
    },
    {
      "id": "duck",
      "name": "Duck (render + glaze)",
      "cost": 220,
      "prep": 10,
      "tech": 3,
      "palate": 2,
      "cre": 1,
      "risk": 3,
      "tags": [
        "high-skill"
      ]
    },
    {
      "id": "marron",
      "name": "Marron (WA hero)",
      "cost": 320,
      "prep": 10,
      "tech": 3,
      "palate": 3,
      "cre": 1,
      "risk": 3,
      "tags": [
        "wa",
        "seafood"
      ]
    },
    {
      "id": "octopus",
      "name": "Octopus (texture mastery)",
      "cost": 240,
      "prep": 11,
      "tech": 4,
      "palate": 2,
      "cre": 1,
      "risk": 4,
      "tags": [
        "seafood",
        "high-skill"
      ]
    },
    {
      "id": "kangaroo",
      "name": "Kangaroo (lean + precise)",
      "cost": 210,
      "prep": 9,
      "tech": 3,
      "palate": 2,
      "cre": 1,
      "risk": 3,
      "tags": [
        "australia",
        "lean"
      ]
    },
    {
      "id": "pork",
      "name": "Pork (structure + sauce)",
      "cost": 170,
      "prep": 9,
      "tech": 2,
      "palate": 2,
      "cre": 0,
      "risk": 2,
      "tags": [
        "classic",
        "rich"
      ]
    },
    {
      "id": "fish",
      "name": "White Fish (precision)",
      "cost": 200,
      "prep": 9,
      "tech": 3,
      "palate": 2,
      "cre": 0,
      "risk": 2,
      "tags": [
        "seafood",
        "clean"
      ]
    }
  ],
  "techniques": [
    {
      "id": "roast",
      "name": "Roast + Rest",
      "cost": 0,
      "prep": 5,
      "tech": 2,
      "palate": 1,
      "cre": 0,
      "risk": 1,
      "tags": [
        "classic"
      ]
    },
    {
      "id": "sousvide",
      "name": "Sous-vide + Sear",
      "cost": 60,
      "prep": 6,
      "tech": 3,
      "palate": 1,
      "cre": 0,
      "risk": 2,
      "tags": [
        "modern",
        "precision"
      ]
    },
    {
      "id": "braise",
      "name": "Braise + Glaze",
      "cost": 20,
      "prep": 7,
      "tech": 2,
      "palate": 2,
      "cre": 0,
      "risk": 1,
      "tags": [
        "depth"
      ]
    },
    {
      "id": "fry",
      "name": "Crisp Fry (timing)",
      "cost": 30,
      "prep": 7,
      "tech": 2,
      "palate": 1,
      "cre": 1,
      "risk": 3,
      "tags": [
        "timing"
      ]
    },
    {
      "id": "char",
      "name": "Char + Smoke Hint",
      "cost": 25,
      "prep": 6,
      "tech": 2,
      "palate": 2,
      "cre": 1,
      "risk": 2,
      "tags": [
        "smoke"
      ]
    },
    {
      "id": "ferment",
      "name": "Ferment / Koji Edge",
      "cost": 45,
      "prep": 9,
      "tech": 3,
      "palate": 2,
      "cre": 2,
      "risk": 4,
      "tags": [
        "advanced",
        "risky"
      ]
    },
    {
      "id": "confit",
      "name": "Confit (time + texture)",
      "cost": 35,
      "prep": 8,
      "tech": 3,
      "palate": 2,
      "cre": 0,
      "risk": 2,
      "tags": [
        "classic",
        "texture"
      ]
    }
  ],
  "sauces": [
    {
      "id": "jus",
      "name": "Reduced Jus",
      "cost": 35,
      "prep": 6,
      "tech": 3,
      "palate": 2,
      "cre": 0,
      "risk": 2,
      "tags": [
        "classic"
      ]
    },
    {
      "id": "beurreblanc",
      "name": "Beurre Blanc",
      "cost": 40,
      "prep": 6,
      "tech": 3,
      "palate": 2,
      "cre": 0,
      "risk": 3,
      "tags": [
        "emulsion"
      ]
    },
    {
      "id": "buttermilk",
      "name": "Buttermilk + Corn Dressing",
      "cost": 25,
      "prep": 5,
      "tech": 1,
      "palate": 2,
      "cre": 1,
      "risk": 1,
      "tags": [
        "fresh"
      ]
    },
    {
      "id": "mole",
      "name": "Mole-style Complexity",
      "cost": 55,
      "prep": 9,
      "tech": 2,
      "palate": 3,
      "cre": 2,
      "risk": 4,
      "tags": [
        "bold",
        "complex"
      ]
    },
    {
      "id": "namjim",
      "name": "Nam Jim Balance",
      "cost": 20,
      "prep": 5,
      "tech": 1,
      "palate": 3,
      "cre": 1,
      "risk": 2,
      "tags": [
        "bright"
      ]
    },
    {
      "id": "dashi",
      "name": "Dashi Umami Base",
      "cost": 25,
      "prep": 5,
      "tech": 2,
      "palate": 3,
      "cre": 0,
      "risk": 1,
      "tags": [
        "umami"
      ]
    },
    {
      "id": "verde",
      "name": "Salsa Verde (herb + acid)",
      "cost": 18,
      "prep": 4,
      "tech": 1,
      "palate": 2,
      "cre": 1,
      "risk": 1,
      "tags": [
        "fresh"
      ]
    }
  ],
  "garnish": [
    {
      "id": "knife_cuts",
      "name": "Precision vegetable cuts",
      "cost": 12,
      "prep": 6,
      "tech": 2,
      "palate": 0,
      "cre": 0,
      "risk": 2,
      "tags": [
        "precision"
      ]
    },
    {
      "id": "herb_oil",
      "name": "Herb oil finish",
      "cost": 10,
      "prep": 3,
      "tech": 1,
      "palate": 1,
      "cre": 1,
      "risk": 1,
      "tags": [
        "finish"
      ]
    },
    {
      "id": "pickles",
      "name": "Quick pickles (acid control)",
      "cost": 12,
      "prep": 4,
      "tech": 1,
      "palate": 2,
      "cre": 1,
      "risk": 1,
      "tags": [
        "balance"
      ]
    },
    {
      "id": "tuille",
      "name": "Crisp tuile / lace",
      "cost": 18,
      "prep": 6,
      "tech": 2,
      "palate": 0,
      "cre": 2,
      "risk": 3,
      "tags": [
        "wow"
      ]
    },
    {
      "id": "powder",
      "name": "Dehydrated powder",
      "cost": 14,
      "prep": 6,
      "tech": 2,
      "palate": 1,
      "cre": 1,
      "risk": 2,
      "tags": [
        "modern"
      ]
    },
    {
      "id": "charveg",
      "name": "Charred vegetables",
      "cost": 14,
      "prep": 5,
      "tech": 2,
      "palate": 1,
      "cre": 0,
      "risk": 1,
      "tags": [
        "smoke"
      ]
    }
  ],
  "dessert": [
    {
      "id": "citrus",
      "name": "Citrus + texture",
      "cost": 55,
      "prep": 7,
      "tech": 2,
      "palate": 2,
      "cre": 1,
      "risk": 2,
      "tags": [
        "fresh"
      ]
    },
    {
      "id": "choc",
      "name": "Chocolate + salt",
      "cost": 65,
      "prep": 8,
      "tech": 2,
      "palate": 2,
      "cre": 1,
      "risk": 2,
      "tags": [
        "classic"
      ]
    },
    {
      "id": "native",
      "name": "Native ingredient feature",
      "cost": 75,
      "prep": 9,
      "tech": 2,
      "palate": 2,
      "cre": 3,
      "risk": 3,
      "tags": [
        "story"
      ]
    },
    {
      "id": "tea",
      "name": "Tea / spice dessert",
      "cost": 60,
      "prep": 8,
      "tech": 2,
      "palate": 2,
      "cre": 2,
      "risk": 2,
      "tags": [
        "aroma"
      ]
    }
  ]
};
