//
// index.ts by Tobias Wiedenmann https://github.com/Thyraz
//
// Loads the custom element and registers the card in Home Assistant
//
// Home Assistant cumstom dashboard card for the PQINA "Flip" clock
//
// LINK TO ORIGINAL 'PQINA flip' REPOSITORY: https://github.com/pqina/flip
//
// Also thanks to Elmar Hinz for his HA development tutorials:
// https://github.com/home-assistant-tutorials/01.development-environment
//

import { PqinaFlipClock } from "./flip-clock";

declare global {
  interface Window {
    customCards: Array<Object>;
  }
}

customElements.define("pqina-flip-clock-card", PqinaFlipClock);

// Register with HA
window.customCards = window.customCards || [];
window.customCards.push({
  type: "pqina-flip-clock-card",
  name: "PQINA flip clock card",
  description: "A flip clock for your dashboard using the PQINA flip component.\n  Github repository: https://github.com/Thyraz\n  Link to original component by PQINA: https://github.com/pqina/flip/",
});
