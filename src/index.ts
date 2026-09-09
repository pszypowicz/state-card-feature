import "./state-card-feature";
import "./state-card-feature-editor";
import { FEATURE_TYPE, supportsStateCardFeature } from "./state-card-feature";
import type { HomeAssistant } from "./types";

declare const __VERSION__: string;

// The registry entry has no translation hook, so the name reads the word
// "State" from the core translations of the running frontend.
const NAME_KEY = "ui.components.state-content-picker.state";

const localizedName = (): string => {
  const root = document.querySelector("home-assistant") as
    (HTMLElement & { hass?: HomeAssistant }) | null;
  return root?.hass?.localize(NAME_KEY) || "State";
};

window.customCardFeatures = window.customCardFeatures || [];
window.customCardFeatures.push({
  type: FEATURE_TYPE,
  get name() {
    return localizedName();
  },
  isSupported: supportsStateCardFeature,
  configurable: true,
});

console.info(
  `%c STATE-CARD-FEATURE %c ${__VERSION__} `,
  "color: white; background: #03a9f4; font-weight: 700;",
  "color: #03a9f4; background: white; font-weight: 700;",
);
