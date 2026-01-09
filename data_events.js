// Flat modular events data (simple framework)
export const EVENTS = [
  { id:"late_delivery", name:"Late Delivery", desc:"Mise slips. You scramble.",
    delta:{ prep:-4, cleanliness:-2, morale:-2 } },
  { id:"mentor_dropin", name:"Mentor Drop-in", desc:"Quick coaching unlocks a cleaner workflow.",
    delta:{ technique:4, risk:-2, morale:+2 } },
  { id:"equipment_fail", name:"Equipment Failure", desc:"Something breaks mid-prep. You adapt or panic.",
    delta:{ prep:-6, fatigue:+3, composure:-2 } },
  { id:"flavour_breakthrough", name:"Flavour Breakthrough", desc:"A sauce clicks. Balance improves.",
    delta:{ palate:+5, creativity:+2, risk:+1 } },
];
