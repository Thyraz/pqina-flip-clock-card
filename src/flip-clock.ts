//
// flip-clock.ts by Tobias Wiedenmann https://github.com/Thyraz
//
// Home Assistant cumstom dashboard card for the PQINA "Flip" clock
//
// LINK TO ORIGINAL 'PQINA flip' REPOSITORY: https://github.com/pqina/flip
//
// Also thanks to Elmar Hinz for his HA development tutorials:
// https://github.com/home-assistant-tutorials/01.development-environment
//

import { html, LitElement } from "lit";
import { state } from "lit/decorators/state";
import { styles } from "./flip-clock.styles";
import { HomeAssistant, LovelaceCardConfig, ActionConfig } from "custom-card-helpers";

import Tick from '@pqina/flip';

// HA config object
interface Config extends LovelaceCardConfig {
  showSeconds: boolean;
  twentyFourHourFormat: boolean;
  hideBackground: boolean;
  styles: Styles;
  entity: string
  tap_action: ActionConfig;
}

interface HassEvent extends Event {
  detail
}

// Available CSS options for the card
type Styles = {
  width: string;
  height: string;
  font: string;
  fontSize: string;
  textColor: string;
  textOffsetHorizontal: string;
  textOffsetVertical: string;
  frontFlapColor: string;
  frontFlapGradientOpacity: string;
  frontFlapShadowOpacity: string;
  rearFlapColor: string;
  rearFlapVerticalOffset: string;
}

// Value object for updating the flip-clock
type ClockValue = {
  hours: number;
  minutes: number;
  seconds: number;
}

// The Flip-Clock custom element
export class PqinaFlipClock extends LitElement {
  @state() private config: Config;

  // private properties
  private _hass: HomeAssistant;
  private _tick;
  private _timer;

  // required by HA
  setConfig(config: Config) {
    this.config = config;
    // call set hass() to immediately adjust to a changed entity
    // while editing the entity in the card editor
    if (this._hass) {
      this.hass = this._hass;
    }

    if (!this._tick) {
      this.setup();
    }
  }

  // required by HA
  set hass(hass: HomeAssistant) {
    this._hass = hass;
  }

  // Load styles using LitElement
  static styles = styles;

  // Add tap listener
  constructor() {
    super();
    this.addEventListener('click', (e) => this.handleTapAction(this.config));
  }

  // Create and configure the PQINA flip clock
  setup() {
    // Setup 'flip' subviews
    const units = ["hours", "minutes"];
    if (this.config.showSeconds == true) {
      units.push("seconds")
    }
    const views = units.map((unit) => { return { view: 'flip', transform: 'pad(00)', key: unit } })

    // Create the main flip-clock object
    this._tick = Tick.DOM.create({
      credits: false,
      view: {
        children: [{
          root: 'div',
          layout: 'horizontal fill',
          children: views
        }]
      },
      didInit: (tick) => {
        // Add timer to update the clock each second
        this._timer=Tick.helper.interval(
          () => {
            tick.value = this.getClockValue();
          }
        );
      }
    });
  }

  // Lit callback where we (re)start the timer when the clock is shown (again)
  connectedCallback() {
    super.connectedCallback();
    this._timer?.reset();
  }

  // Lit callback where we stop the timer when the clock is removed
  disconnectedCallback() {
    super.disconnectedCallback();
    this._timer?.stop();
  }

  // Lit callback for the HTML template
  render() {
    return html`
      <ha-card>
        <div class="card-content">
          <div class="clock"></div>
        </div>
      </ha-card>
    `;
  }

  // Lit callback when the HTML template was loaded / updated
  updated() {
    // HTML template re-created? Add clock to new parent
    const parent = this._tick.root.parentNode;
    if (parent) {
      parent.removeChild(this._tick.root);
    }
    this.shadowRoot.querySelector('.clock').appendChild(this._tick.root);

    this.updateCssVars();
  }

  // Apply the CSS vars according the config options set by the user
  updateCssVars() {
    const card: HTMLElement = this.shadowRoot.querySelector('ha-card');
    card.style.setProperty('--ha-card-border-color', this.config.hideBackground ? 'transparent' : '');
    card.style.setProperty('--ha-card-background', this.config.hideBackground ? 'transparent' : '');

    // Set default height based on the showSeconds setting
    card.style.setProperty('--height', this.config.showSeconds ? '30cqw' : '45cqw');
    card.style.setProperty('--font-size', this.config.showSeconds ? '20cqw' : '30cqw');

    const cardContent: HTMLElement = this.shadowRoot.querySelector('.card-content');

    if (this.config.styles) {
      Object.entries(this.config.styles).forEach(([key, value]) => {
        const kebapCaseKey = key.replace(/([a-zA-Z])(?=[A-Z])/g,'$1-').toLowerCase()
        cardContent.style.setProperty(`--${kebapCaseKey}`, value || "");
      });
    }
  }

  // Called each second by the flip-clock timer to update the shwon values
  getClockValue() : ClockValue {
    const date = Tick.helper.date();

    const hours = this.config.twentyFourHourFormat ? date.getHours() : date.getHours() % 12 || 12;
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const value: ClockValue = { hours, minutes, seconds };
    return value;
  }

  // Call user configured tap action
  private handleTapAction(config: Config) {
    if (config.tap_action) {
      const actionConfig = {
        entity: config.entity,
        tap_action: config.tap_action
      };

      const event: HassEvent = new Event("hass-action", {
        bubbles: true,
        composed: true
      }) as HassEvent;

      event.detail = {
        config: actionConfig,
        action: "tap",
      };

      this.dispatchEvent(event);
    }
  }
}
