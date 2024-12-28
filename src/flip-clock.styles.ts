//
// flip-clock.sytles.ts by Tobias Wiedenmann https://github.com/Thyraz
//
// Combines CSS from PQINA Flip with custom default styles for the dashboard card
// CSS files are loaded with "bundle-text" as strings, so we can use the original and unchanged CSS file from PQINA.
// Imported using LITs "unsafeCSS"
//
// Home Assistant cumstom dashboard card for the PQINA "Flip" clock
//
// LINK TO ORIGINAL 'PQINA flip' REPOSITORY: https://github.com/pqina/flip
//
// Also thanks to Elmar Hinz for his HA development tutorials:
// https://github.com/home-assistant-tutorials/01.development-environment
//

import { css, unsafeCSS } from "lit";
// @ts-ignore: Will be loaded as string from parcel bundler
import flipStyles from "bundle-text:../node_modules/@pqina/flip/dist/flip.min.css";
// @ts-ignore: Will be loaded as string from parcel bundler
import customStyles from "bundle-text:./flip-clock.css";

export const styles = css`
  ${unsafeCSS(flipStyles + '\n' + customStyles)}
`;