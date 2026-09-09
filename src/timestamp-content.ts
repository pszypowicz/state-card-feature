import type { HassEntity } from "home-assistant-js-websocket";
import type { StateContent } from "./types";

// Mirrors the tables that the frontend `state-display` element uses to decide
// whether a content item renders as a timestamp.
const SENSOR_TIMESTAMP_DEVICE_CLASSES = ["timestamp", "uptime"];

const TIMESTAMP_STATE_DOMAINS = new Set([
  "ai_task",
  "button",
  "conversation",
  "datetime",
  "event",
  "image",
  "infrared",
  "input_button",
  "notify",
  "radio_frequency",
  "scene",
  "stt",
  "tag",
  "tts",
  "wake_word",
]);

const TIMESTAMP_CONTENTS = ["last_changed", "last_updated", "last_triggered"];

const TIMESTAMP_DOMAIN_CONTENTS: Record<string, string[]> = {
  calendar: ["start_time", "end_time"],
  input_datetime: ["timestamp"],
  sun: [
    "next_dawn",
    "next_dusk",
    "next_midnight",
    "next_noon",
    "next_rising",
    "next_setting",
  ],
};

export const stateContentHasTimestamp = (
  stateObj: HassEntity | undefined,
  content?: StateContent,
): boolean => {
  if (!stateObj) {
    return false;
  }
  const items =
    content == null ? ["state"] : Array.isArray(content) ? content : [content];
  const domain = stateObj.entity_id.split(".", 1)[0];

  if (items.some((item) => TIMESTAMP_CONTENTS.includes(item))) {
    return true;
  }
  if (items.some((item) => TIMESTAMP_DOMAIN_CONTENTS[domain]?.includes(item))) {
    return true;
  }
  if (!items.includes("state")) {
    return false;
  }
  if (TIMESTAMP_STATE_DOMAINS.has(domain)) {
    return true;
  }
  return (
    domain === "sensor" &&
    SENSOR_TIMESTAMP_DEVICE_CLASSES.includes(
      stateObj.attributes.device_class as string,
    )
  );
};
