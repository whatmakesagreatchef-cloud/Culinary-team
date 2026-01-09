export const COUNTRIES = [
  {
    "id": "AU-WA",
    "name": "Australia (WA)",
    "tagline": "Ocean to red dirt. Provenance + standards.",
    "tone": "grounded, proud, practical",
    "rival": "France",
    "perks": {
      "budget": 900,
      "rep": 4,
      "consistencyBoost": 0.1
    },
    "rivalCountryId": "FR",
    "story": [
      {
        "week": 1,
        "title": "The Launch",
        "body": "Big distances, tight budgets, huge pride. Your first win is standards — not hype.",
        "choices": [
          {
            "label": "Standards First bootcamp",
            "desc": "Non‑negotiables: hygiene, timing, knife cuts.",
            "effects": {
              "cleanliness": 6,
              "technique": 3,
              "fatigue": 5
            },
            "flags": {
              "standards": true
            }
          },
          {
            "label": "Story-first menu pitch",
            "desc": "Lean into WA identity early. Higher upside, higher risk.",
            "effects": {
              "creativity": 6,
              "rep": 2,
              "risk": 4,
              "budget": -140
            },
            "flags": {
              "storyFirst": true
            }
          }
        ]
      },
      {
        "week": 2,
        "title": "The Menu Lab",
        "body": "Clean and simple… or chase wow. Either way, the menu is your weapon.",
        "choices": [
          {
            "label": "Simplify components",
            "desc": "Protect consistency.",
            "effects": {
              "consistency": 4,
              "risk": -3
            },
            "flags": {
              "simpleMenu": true
            }
          },
          {
            "label": "Add a hero element",
            "desc": "One signature technique, executed perfectly.",
            "effects": {
              "creativity": 3,
              "technique": 2,
              "risk": 3
            },
            "flags": {
              "heroElement": true
            }
          }
        ]
      },
      {
        "week": 4,
        "title": "Sponsor Phone Calls",
        "body": "Sponsors want proof. Your story must match your pass.",
        "choices": [
          {
            "label": "Launch a campaign",
            "desc": "Gain budget + obligations. Overpromising hurts later.",
            "effects": {
              "budget": 180,
              "sponsorInterest": 1,
              "risk": 2
            },
            "flags": {
              "campaign": true
            }
          },
          {
            "label": "Build proof first",
            "desc": "Slow burn, stronger credibility.",
            "effects": {
              "rep": 4,
              "risk": -2
            },
            "flags": {
              "proofFirst": true
            }
          }
        ]
      },
      {
        "week": 7,
        "title": "Fatigue Wall",
        "body": "The grind is real. Protect the team or push hard.",
        "choices": [
          {
            "label": "Recovery week",
            "desc": "Protect consistency.",
            "effects": {
              "fatigue": -10,
              "morale": 4,
              "risk": -2
            },
            "flags": {
              "recovered": true
            }
          },
          {
            "label": "Push through",
            "desc": "Gain prep, risk burnout.",
            "effects": {
              "prep": 6,
              "fatigue": 6,
              "morale": -3
            },
            "flags": {
              "pushed": true
            }
          }
        ]
      },
      {
        "week": 9,
        "title": "Rival Pressure",
        "body": "Your rival borrows your flavours. Judges now expect your identity.",
        "choices": [
          {
            "label": "Double down on WA story",
            "desc": "Provenance + narrative.",
            "effects": {
              "rep": 3,
              "creativity": 3,
              "risk": 3
            },
            "flags": {
              "waStory": true
            }
          },
          {
            "label": "Sharpen execution",
            "desc": "Less variance, fewer components.",
            "effects": {
              "consistency": 4,
              "risk": -4,
              "creativity": -1
            },
            "flags": {
              "execute": true
            }
          }
        ]
      },
      {
        "week": 12,
        "title": "The Final",
        "body": "You're representing more than yourself now. Clean wins.",
        "choices": [
          {
            "label": "Play safe and perfect",
            "desc": "Lower variance, lower upside.",
            "effects": {
              "risk": -4,
              "consistency": 3
            },
            "flags": {
              "safeFinal": true
            }
          },
          {
            "label": "Push the hero element",
            "desc": "Higher upside, higher fail chance.",
            "effects": {
              "risk": 5,
              "creativity": 2,
              "technique": 1
            },
            "flags": {
              "heroFinal": true
            }
          }
        ]
      }
    ]
  },
  {
    "id": "JP",
    "name": "Japan",
    "tagline": "Precision culture. Calm is power.",
    "tone": "minimal, exacting, calm",
    "rival": "USA",
    "perks": {
      "consistency": 12,
      "composure": 6,
      "repGain": 0.2
    },
    "rivalCountryId": "US",
    "story": [
      {
        "week": 1,
        "title": "Restraint",
        "body": "Fewer elements. Higher execution. The pass is silent, and that's your advantage.",
        "choices": [
          {
            "label": "Zero waste workflow",
            "desc": "Clean systems unlock calm consistency.",
            "effects": {
              "cleanliness": 4,
              "rep": 3,
              "consistency": 2
            },
            "flags": {
              "zeroWaste": true
            }
          },
          {
            "label": "Micro-timing drills",
            "desc": "Timing wins finals.",
            "effects": {
              "prep": 6,
              "technique": 3,
              "fatigue": 4
            },
            "flags": {
              "microTiming": true
            }
          }
        ]
      },
      {
        "week": 3,
        "title": "Knife Week Looms",
        "body": "A knife-focused qualifier appears. Cuts must be flawless.",
        "choices": [
          {
            "label": "Train knife accuracy",
            "desc": "Technique + consistency rise.",
            "effects": {
              "technique": 3,
              "consistency": 3
            },
            "flags": {
              "knifeAccuracy": true
            }
          },
          {
            "label": "Train speed",
            "desc": "Prep rises but risk creeps in.",
            "effects": {
              "prep": 6,
              "risk": 3
            },
            "flags": {
              "speed": true
            }
          }
        ]
      },
      {
        "week": 6,
        "title": "Signature Discipline",
        "body": "You're expected to be perfect. Be calmer than the room.",
        "choices": [
          {
            "label": "Reduce components",
            "desc": "Variance down.",
            "effects": {
              "risk": -4,
              "consistency": 3
            },
            "flags": {
              "reduce": true
            }
          },
          {
            "label": "High-skill garnish",
            "desc": "Upside with risk.",
            "effects": {
              "technique": 3,
              "risk": 3
            },
            "flags": {
              "garnish": true
            }
          }
        ]
      },
      {
        "week": 12,
        "title": "The Finish",
        "body": "Judges reward calm mastery.",
        "choices": [
          {
            "label": "Surgical execution",
            "desc": "Variance very low.",
            "effects": {
              "risk": -4,
              "consistency": 3
            },
            "flags": {
              "surgical": true
            }
          },
          {
            "label": "Bold contrast",
            "desc": "Payoff high.",
            "effects": {
              "palate": 2,
              "creativity": 2,
              "risk": 5
            },
            "flags": {
              "bold": true
            }
          }
        ]
      }
    ]
  },
  {
    "id": "FR",
    "name": "France",
    "tagline": "Technique expected. Organisation wins.",
    "tone": "disciplined, classical, high pressure",
    "rival": "Japan",
    "perks": {
      "technique": 10,
      "sponsorInterest": 1,
      "failureRiskMod": -0.1
    },
    "rivalCountryId": "JP",
    "story": [
      {
        "week": 1,
        "title": "Legacy",
        "body": "Everyone assumes you're good. Prove you're better than tradition.",
        "choices": [
          {
            "label": "Lock classic early",
            "desc": "Consistency up, creativity down.",
            "effects": {
              "consistency": 4,
              "creativity": -2,
              "risk": -2
            },
            "flags": {
              "classic": true
            }
          },
          {
            "label": "Controlled modernise",
            "desc": "Creativity up, risk up.",
            "effects": {
              "creativity": 4,
              "risk": 3
            },
            "flags": {
              "modern": true
            }
          }
        ]
      },
      {
        "week": 4,
        "title": "The Sponsor Circuit",
        "body": "Sponsors want polish. Deliverables become expectations.",
        "choices": [
          {
            "label": "Gold-tier pitch",
            "desc": "Big money, big obligation.",
            "effects": {
              "budget": 260,
              "sponsorInterest": 1,
              "risk": 2
            },
            "flags": {
              "goldPitch": true
            }
          },
          {
            "label": "Stay lean",
            "desc": "More control, slower growth.",
            "effects": {
              "rep": 3,
              "risk": -1
            },
            "flags": {
              "lean": true
            }
          }
        ]
      },
      {
        "week": 12,
        "title": "The Standard",
        "body": "Final is judged like a textbook, tasted like a restaurant.",
        "choices": [
          {
            "label": "Textbook execution",
            "desc": "Variance low.",
            "effects": {
              "risk": -4,
              "consistency": 3
            },
            "flags": {
              "textbook": true
            }
          },
          {
            "label": "Controlled innovation",
            "desc": "Upside with risk.",
            "effects": {
              "palate": 2,
              "creativity": 2,
              "risk": 4
            },
            "flags": {
              "innov": true
            }
          }
        ]
      }
    ]
  },
  {
    "id": "IT",
    "name": "Italy",
    "tagline": "Simplicity, depth, timing. Perfect the basics.",
    "tone": "warm, structured, flavour-driven",
    "perks": {
      "palate": 10,
      "morale": 6
    },
    "rival": "Thailand",
    "rivalCountryId": "TH",
    "story": [
      {
        "week": 1,
        "title": "The Nonna Rule",
        "body": "If it's not delicious, nothing else matters. But finals punish mess.",
        "choices": [
          {
            "label": "Taste calibration",
            "desc": "Palate up, risk slightly up.",
            "effects": {
              "palate": 4,
              "risk": 1
            },
            "flags": {
              "tasteCal": true
            }
          },
          {
            "label": "Pass organisation",
            "desc": "Cleanliness + consistency.",
            "effects": {
              "cleanliness": 3,
              "consistency": 3
            },
            "flags": {
              "org": true
            }
          }
        ]
      },
      {
        "week": 6,
        "title": "The Sauce Moment",
        "body": "A sauce can win you a comp — or break the plate if it splits.",
        "choices": [
          {
            "label": "Emulsion mastery",
            "desc": "Technique + palate.",
            "effects": {
              "technique": 3,
              "palate": 2,
              "risk": 1
            },
            "flags": {
              "emulsion": true
            }
          },
          {
            "label": "Keep it rustic",
            "desc": "Risk down.",
            "effects": {
              "risk": -3,
              "morale": 2
            },
            "flags": {
              "rustic": true
            }
          }
        ]
      },
      {
        "week": 12,
        "title": "Final Plate",
        "body": "Make it simple. Make it perfect.",
        "choices": [
          {
            "label": "Minimal, perfect",
            "desc": "Variance down.",
            "effects": {
              "risk": -4,
              "consistency": 3
            },
            "flags": {
              "minimal": true
            }
          },
          {
            "label": "One bold accent",
            "desc": "Upside.",
            "effects": {
              "creativity": 2,
              "risk": 3
            },
            "flags": {
              "accent": true
            }
          }
        ]
      }
    ]
  },
  {
    "id": "US",
    "name": "USA",
    "tagline": "Big swings, big speed, big pressure.",
    "tone": "ambitious, fast, competitive",
    "perks": {
      "prep": 10,
      "creativity": 8
    },
    "rival": "Japan",
    "rivalCountryId": "JP",
    "story": [
      {
        "week": 1,
        "title": "Go Big",
        "body": "You're here to win loud. But timing is your enemy.",
        "choices": [
          {
            "label": "Speed systems",
            "desc": "Prep up, risk up.",
            "effects": {
              "prep": 6,
              "risk": 3
            },
            "flags": {
              "speedSystems": true
            }
          },
          {
            "label": "Structure first",
            "desc": "Consistency up.",
            "effects": {
              "consistency": 4,
              "risk": -1
            },
            "flags": {
              "structure": true
            }
          }
        ]
      },
      {
        "week": 9,
        "title": "Rival Calm",
        "body": "Japan looks effortless. You need discipline to match them.",
        "choices": [
          {
            "label": "Bench discipline",
            "desc": "Cleanliness up.",
            "effects": {
              "cleanliness": 4,
              "risk": -2
            },
            "flags": {
              "bench": true
            }
          },
          {
            "label": "Push flavour bomb",
            "desc": "Palate up, risk up.",
            "effects": {
              "palate": 3,
              "risk": 3
            },
            "flags": {
              "bomb": true
            }
          }
        ]
      },
      {
        "week": 12,
        "title": "Final Swing",
        "body": "This is your moment.",
        "choices": [
          {
            "label": "Safe win attempt",
            "desc": "Variance down.",
            "effects": {
              "risk": -3,
              "consistency": 2
            },
            "flags": {
              "safe": true
            }
          },
          {
            "label": "All-in",
            "desc": "High upside.",
            "effects": {
              "creativity": 3,
              "risk": 5
            },
            "flags": {
              "allin": true
            }
          }
        ]
      }
    ]
  },
  {
    "id": "TH",
    "name": "Thailand",
    "tagline": "Balance, aroma, heat. Clean chaos.",
    "tone": "vibrant, precise, aromatic",
    "perks": {
      "palate": 8,
      "creativity": 8
    },
    "rival": "Italy",
    "rivalCountryId": "IT",
    "story": [
      {
        "week": 1,
        "title": "Balance First",
        "body": "Sweet/sour/salt/heat must land together.",
        "choices": [
          {
            "label": "Acid drills",
            "desc": "Palate up, risk down.",
            "effects": {
              "palate": 3,
              "risk": -2
            },
            "flags": {
              "acid": true
            }
          },
          {
            "label": "Aroma focus",
            "desc": "Creativity up.",
            "effects": {
              "creativity": 3,
              "risk": 1
            },
            "flags": {
              "aroma": true
            }
          }
        ]
      },
      {
        "week": 6,
        "title": "Heat Control",
        "body": "Judges love Thai flavour — but only if it's controlled.",
        "choices": [
          {
            "label": "Controlled heat",
            "desc": "Risk down.",
            "effects": {
              "risk": -3,
              "palate": 2
            },
            "flags": {
              "control": true
            }
          },
          {
            "label": "Chase wow",
            "desc": "Upside, risk.",
            "effects": {
              "creativity": 3,
              "risk": 3
            },
            "flags": {
              "wow": true
            }
          }
        ]
      },
      {
        "week": 12,
        "title": "Final Harmony",
        "body": "Make it sing, not shout.",
        "choices": [
          {
            "label": "Harmony",
            "desc": "Variance down.",
            "effects": {
              "risk": -3,
              "consistency": 2
            },
            "flags": {
              "harmony": true
            }
          },
          {
            "label": "Fire finale",
            "desc": "High upside.",
            "effects": {
              "palate": 2,
              "risk": 4
            },
            "flags": {
              "fire": true
            }
          }
        ]
      }
    ]
  }
];
