export const EVENTS = [
  {
    "id": "late_delivery",
    "name": "Late Delivery",
    "desc": "Mise slips. You scramble.",
    "delta": {
      "prep": -4,
      "cleanliness": -2,
      "morale": -2
    }
  },
  {
    "id": "mentor_dropin",
    "name": "Mentor Drop-in",
    "desc": "A mentor spots a workflow fix.",
    "delta": {
      "technique": 3,
      "risk": -2,
      "morale": 2
    }
  },
  {
    "id": "equipment_fail",
    "name": "Equipment Failure",
    "desc": "Something breaks mid-prep. Adapt fast.",
    "delta": {
      "prep": -6,
      "fatigue": 3,
      "composure": -2
    }
  },
  {
    "id": "flavour_breakthrough",
    "name": "Flavour Breakthrough",
    "desc": "A sauce clicks. Balance improves.",
    "delta": {
      "palate": 5,
      "creativity": 2,
      "risk": 1
    }
  },
  {
    "id": "service_push",
    "name": "Extra Service Shift",
    "desc": "You cover a busy service. Tough but valuable.",
    "delta": {
      "prep": 4,
      "fatigue": 5,
      "rep": 2,
      "morale": -1
    }
  },
  {
    "id": "clean_audit",
    "name": "Surprise Clean Audit",
    "desc": "Your standards are tested in public.",
    "delta": {
      "cleanliness": 4,
      "rep": 3,
      "risk": -2
    }
  },
  {
    "id": "sponsor_feedback",
    "name": "Sponsor Feedback",
    "desc": "Sponsors ask for an update — deliverables matter now.",
    "delta": {
      "rep": 2,
      "risk": 1
    }
  }
];
