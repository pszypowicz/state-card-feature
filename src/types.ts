import type { HassEntity } from "home-assistant-js-websocket";

export type StateContent = string | string[];

export interface StateCardFeatureConfig {
  type: string;
  state_content?: StateContent;
}

export interface LovelaceCardFeatureContext {
  entity_id?: string;
  area_id?: string;
}

/** The part of the Home Assistant `hass` object that this resource reads. */
export interface HomeAssistant {
  states: Record<string, HassEntity>;
  localize: (key: string) => string;
}

export interface CustomCardFeatureEntry {
  type: string;
  name?: string;
  isSupported?: (
    hass: HomeAssistant,
    context: LovelaceCardFeatureContext,
  ) => boolean;
  configurable?: boolean;
}

declare global {
  interface Window {
    customCardFeatures?: CustomCardFeatureEntry[];
  }
}
