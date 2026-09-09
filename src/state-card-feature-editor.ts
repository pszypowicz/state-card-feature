import { html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { fireEvent } from "./fire-event";
import { stateContentHasTimestamp } from "./timestamp-content";
import type {
  HomeAssistant,
  LovelaceCardFeatureContext,
  StateCardFeatureConfig,
} from "./types";

const LABEL_KEYS: Record<string, string> = {
  state_content: "ui.panel.lovelace.editor.card.tile.state_content",
  time_format: "ui.panel.lovelace.editor.card.generic.time_format",
};

const FALLBACK_LABELS: Record<string, string> = {
  state_content: "State content",
  time_format: "Time format",
};

type SchemaItem =
  | {
      name: "state_content";
      selector: {
        ui_state_content: {
          entity_id?: string;
          allow_context: boolean;
        };
      };
    }
  | {
      name: "time_format";
      selector: { ui_time_format: Record<string, never> };
    };

@customElement("state-card-feature-editor")
export class StateCardFeatureEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @property({ attribute: false }) public context?: LovelaceCardFeatureContext;

  @state() private _config?: StateCardFeatureConfig;

  public setConfig(config: StateCardFeatureConfig): void {
    this._config = config;
  }

  private _schema(entityId?: string, showTimeFormat = false): SchemaItem[] {
    const schema: SchemaItem[] = [
      {
        name: "state_content",
        selector: {
          ui_state_content: {
            entity_id: entityId,
            allow_context: true,
          },
        },
      },
    ];
    if (showTimeFormat) {
      schema.push({
        name: "time_format",
        selector: { ui_time_format: {} },
      });
    }
    return schema;
  }

  protected render() {
    if (!this.hass || !this._config) {
      return nothing;
    }

    const entityId = this.context?.entity_id;
    const stateObj = entityId ? this.hass.states[entityId] : undefined;
    const showTimeFormat = stateContentHasTimestamp(
      stateObj,
      this._config.state_content,
    );

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this._schema(entityId, showTimeFormat)}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  private _valueChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    fireEvent(this, "config-changed", { config: ev.detail.value });
  }

  private _computeLabel = (schema: SchemaItem): string =>
    this.hass?.localize(LABEL_KEYS[schema.name]) ||
    FALLBACK_LABELS[schema.name] ||
    schema.name;
}

declare global {
  interface HTMLElementTagNameMap {
    "state-card-feature-editor": StateCardFeatureEditor;
  }
}
