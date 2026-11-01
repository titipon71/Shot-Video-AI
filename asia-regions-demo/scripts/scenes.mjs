// Scene plan for the Asia regions map explainer (9:16).
// Each scene bakes one basemap camera move; overlays are drawn live from the coords.
export const REGIONS = {
  west: { label: "Middle East", color: "#F5A623", countries: ["Turkey", "Syria", "Lebanon", "Israel", "Palestine", "Jordan", "Iraq", "Iran", "Saudi Arabia", "Kuwait", "Qatar", "United Arab Emirates", "Oman", "Yemen", "Cyprus", "Georgia", "Armenia", "Azerbaijan"] },
  south: { label: "South Asia", color: "#5CC93A", countries: ["India", "Pakistan", "Bangladesh", "Nepal", "Bhutan", "Sri Lanka", "Afghanistan"] },
  east: { label: "East Asia", color: "#E8D93A", countries: ["China", "Mongolia", "Japan", "South Korea", "North Korea", "Taiwan"] },
  southeast: { label: "Southeast Asia", color: "#4FC3E8", countries: ["Myanmar", "Thailand", "Laos", "Cambodia", "Vietnam", "Malaysia", "Indonesia", "Philippines", "Brunei", "Timor-Leste"] },
  central: { label: "Central Asia", color: "#E5452B", countries: ["Kazakhstan", "Uzbekistan", "Turkmenistan", "Kyrgyzstan", "Tajikistan"] },
  north: { label: "Northern Asia", color: "#2F5BEA", countries: ["Russia"] },
};

// center/zoom are the held view; from/zstart the camera start (previous scene's view).
export const SCENES = [
  { id: "hook", dur: 5, center: [92, 24], zstart: 2.3, zend: 2.55, hold: 0.28 },
  { id: "west", dur: 5.5, from: [92, 24], center: [45, 22], zstart: 2.55, zend: 3.85, hold: 0.27 },
  { id: "south", dur: 5.5, from: [45, 22], center: [78, 16], zstart: 3.85, zend: 3.9, hold: 0.27 },
  { id: "east", dur: 5.5, from: [78, 16], center: [112, 28], zstart: 3.9, zend: 3.15, hold: 0.27 },
  { id: "southeast", dur: 5.5, from: [112, 28], center: [116, 0], zstart: 3.15, zend: 3.55, hold: 0.27 },
  { id: "central", dur: 5.5, from: [116, 0], center: [66, 37], zstart: 3.55, zend: 3.85, hold: 0.27 },
  { id: "outro", dur: 6.5, from: [66, 37], center: [92, 30], zstart: 3.85, zend: 2.45, hold: 0.28 },
];
