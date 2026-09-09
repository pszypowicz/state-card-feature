import type { HassEntity } from "home-assistant-js-websocket";

export type StateContent = string | string[];

export const TIMESTAMP_RENDERING_FORMATS = [
  "relative",
  "total",
  "date",
  "time",
  "datetime",
] as const;

export type TimestampRenderingFormat =
  | (typeof TIMESTAMP_RENDERING_FORMATS)[number]
  | {
      type: (typeof TIMESTAMP_RENDERING_FORMATS)[number];
      style?: "short" | "long";
    };

export interface StateCardFeatureConfig {
  type: string;
  state_content?: StateContent;
  time_format?: TimestampRenderingFormat;
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
