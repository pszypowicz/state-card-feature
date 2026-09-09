import "./state-card-feature";
import "./state-card-feature-editor";
import { FEATURE_TYPE, supportsStateCardFeature } from "./state-card-feature";

declare const __VERSION__: string;

window.customCardFeatures = window.customCardFeatures || [];
window.customCardFeatures.push({
  type: FEATURE_TYPE,
  name: "State",
  isSupported: supportsStateCardFeature,
  configurable: true,
});

console.info(
  `%c STATE-CARD-FEATURE %c ${__VERSION__} `,
  "color: white; background: #03a9f4; font-weight: 700;",
  "color: #03a9f4; background: white; font-weight: 700;",
);
