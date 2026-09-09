import type { HassEntity } from "home-assistant-js-websocket";
import { css, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type {
  HomeAssistant,
  LovelaceCardFeatureContext,
  StateCardFeatureConfig,
} from "./types";

export const FEATURE_TYPE = "state-card-feature";

export const supportsStateCardFeature = (
  hass: HomeAssistant,
  context: LovelaceCardFeatureContext,
): boolean => !!context.entity_id && context.entity_id in hass.states;

@customElement(FEATURE_TYPE)
export class StateCardFeature extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @property({ attribute: false }) public context?: LovelaceCardFeatureContext;

  // The feature host sets this for compatibility with older custom features.
  // The entity state is read from `hass` first, so this is only a fallback.
  @property({ attribute: false }) public stateObj?: HassEntity;

  @state() private _config?: StateCardFeatureConfig;

  static getStubConfig(): StateCardFeatureConfig {
    return { type: `custom:${FEATURE_TYPE}` };
  }

  static getConfigElement(): HTMLElement {
    return document.createElement("state-card-feature-editor");
  }

  public setConfig(config: StateCardFeatureConfig): void {
    if (!config) {
      throw new Error("Invalid configuration");
    }
    this._config = config;
  }

  private get _stateObj(): HassEntity | undefined {
    const entityId = this.context?.entity_id;
    if (entityId && this.hass) {
      return this.hass.states[entityId];
    }
    return this.stateObj;
  }

  protected render() {
    const stateObj = this._stateObj;
    if (!this._config || !this.hass || !stateObj) {
      return nothing;
    }

    return html`
      <state-display
        .hass=${this.hass}
        .stateObj=${stateObj}
        .content=${this._config.state_content}
      ></state-display>
    `;
  }

  static styles = css`
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: var(--feature-height);
      padding: 0 var(--ha-space-2);
      box-sizing: border-box;
      color: var(--primary-text-color);
      font-size: var(--ha-font-size-l);
      font-weight: var(--ha-font-weight-medium);
      line-height: var(--ha-line-height-condensed);
      text-align: center;
      overflow: hidden;
      pointer-events: none !important;
    }
    state-display {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "state-card-feature": StateCardFeature;
  }
}
