# State card feature

A custom card feature for Home Assistant dashboards. It shows the entity state, or any other state content item, in the feature area of a card.

With `features_position: inline` the value sits on the right side of a tile, next to the name. This turns a tile into a read-only indicator for a select, an input_datetime, or a sensor. In the bottom position the feature works as a large value display.

This is a standalone build of [home-assistant/frontend#54051](https://github.com/home-assistant/frontend/pull/54051). When that pull request ships in a Home Assistant release, the built-in `state` feature replaces this resource. See [Migration](#migration).

![Tiles with the state feature, light theme](https://raw.githubusercontent.com/pszypowicz/state-card-feature/main/docs/dashboard-light.png)

![Tiles with the state feature, dark theme](https://raw.githubusercontent.com/pszypowicz/state-card-feature/main/docs/dashboard-dark.png)

The first tile uses the inline position. The two middle tiles use the bottom position, and the CO2 tile adds `last_changed` to the state content. The last tile combines the inline state with a toggle feature below it.

## Installation

### HACS

1. Open HACS and click the three dots in the top right corner.
2. Select **Custom repositories**.
3. Add `https://github.com/pszypowicz/state-card-feature` with the type **Dashboard**.
4. Install **State card feature**.
5. Reload the browser.

HACS adds the resource for you when your dashboards are in storage mode. If you manage resources in YAML, add the resource by hand as shown below.

### Manual

1. Download `state-card-feature.js` from the [latest release](https://github.com/pszypowicz/state-card-feature/releases/latest).
2. Copy the file to `config/www/state-card-feature.js`.
3. Add a dashboard resource with the URL `/local/state-card-feature.js` and the type **JavaScript module**. The resources page is at **Settings > Dashboards > three dots > Resources** and needs advanced mode.

In YAML mode, add the resource to your configuration instead:

```yaml
lovelace:
  resources:
    - url: /local/state-card-feature.js
      type: module
```

## Usage

Add the feature to a tile card. The feature has one option, `state_content`. It accepts the same values as the tile card state content: `state`, `name`, `last_changed`, `last_updated`, or any attribute name. It can be a single value or a list.

| Option          | Type           | Default | Description                                    |
| --------------- | -------------- | ------- | ---------------------------------------------- |
| `type`          | string         |         | Required. Must be `custom:state-card-feature`. |
| `state_content` | string or list | `state` | The state content items to show, in order.     |

Inline indicator for a select entity:

```yaml
type: tile
entity: input_select.home_mode
hide_state: true
features_position: inline
features:
  - type: custom:state-card-feature
```

Large value display with the time of the last change:

```yaml
type: tile
entity: sensor.co2
hide_state: true
features:
  - type: custom:state-card-feature
    state_content:
      - state
      - last_changed
```

Inline state with a toggle below it. With the inline position, the first feature sits next to the name and the remaining features stack below the tile:

```yaml
type: tile
entity: light.bed_light
hide_state: true
features_position: inline
features:
  - type: custom:state-card-feature
  - type: toggle
```

### Visual editor

The feature is available in the card editor. Expand **Features**, click **Add feature**, and select **State**. Click the pencil icon on the feature row to pick the state content.

![Feature editor with the state content picker](https://raw.githubusercontent.com/pszypowicz/state-card-feature/main/docs/editor.png)

## Migration

When the built-in `state` feature is part of your Home Assistant version, do the following:

1. In each card, change `type: custom:state-card-feature` to `type: state`.
2. Remove this resource from HACS or from your resource list.

The `state_content` option keeps the same name and values.

## Development

```bash
npm install
npm run build   # writes dist/state-card-feature.js
npm run watch   # rebuilds on change
npm run lint    # type check and formatting
```

The feature reuses the `state-display` element from the Home Assistant frontend, so the text is formatted the same way as the state under the tile name.

## License

MIT
