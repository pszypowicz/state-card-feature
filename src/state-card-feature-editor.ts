import { html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { fireEvent } from "./fire-event";
import type {
  HomeAssistant,
  LovelaceCardFeatureContext,
  StateCardFeatureConfig,
} from "./types";

const STATE_CONTENT_LABEL_KEY =
  "ui.panel.lovelace.editor.card.tile.state_content";

interface SchemaItem {
  name: "state_content";
  selector: {
    ui_state_content: {
      entity_id?: string;
      allow_context: boolean;
    };
  };
}

@customElement("state-card-feature-editor")
export class StateCardFeatureEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @property({ attribute: false }) public context?: LovelaceCardFeatureContext;

  @state() private _config?: StateCardFeatureConfig;

  public setConfig(config: StateCardFeatureConfig): void {
    this._config = config;
  }

  private _schema(entityId?: string): SchemaItem[] {
    return [
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
  }

  protected render() {
    if (!this.hass || !this._config) {
      return nothing;
    }

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this._schema(this.context?.entity_id)}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  private _valueChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    fireEvent(this, "config-changed", { config: ev.detail.value });
  }

  private _computeLabel = (schema: SchemaItem): string => {
    const label = this.hass?.localize(STATE_CONTENT_LABEL_KEY);
    return (
      label || (schema.name === "state_content" ? "State content" : schema.name)
    );
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "state-card-feature-editor": StateCardFeatureEditor;
  }
}
