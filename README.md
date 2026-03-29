# Camunda Script Editor

A code editor plugin for [Camunda Modeler](https://github.com/camunda/camunda-modeler) targeting **Camunda 7**.

Replaces the default script text areas in the properties panel with full CodeMirror 6 editors featuring syntax highlighting, linting, and optional LSP-powered autocomplete.

## Features

- **JavaScript editor** — ESLint linting, LSP autocomplete, go-to-definition (Ctrl+Click), rename (F2)
- **Groovy editor** — syntax highlighting
- **Replaced panel groups** — Script Tasks, Input/Output Parameters, Task/Execution Listeners, Conditional Flows
- **Implementation types** — Java class, expression, delegate expression, DMN, external task, connector
- **Timer events** — date, duration, cycle configuration

## Language Server (optional)

For JavaScript autocomplete, run the LSP server:

```shell
docker run -d -p 3000:3000 docker.io/knobik/docker-camunda-language-server
```

Without it the editor still works — you just won't get autocomplete or go-to-definition. See [knobik/docker-camunda-language-server](https://github.com/knobik/docker-camunda-language-server) for details.

## Installation

1. Clone or download this repository into your Camunda Modeler plugins directory:
   ```
   ~/.config/camunda-modeler/plugins/camunda-modeler-script-editor-plugin
   ```

2. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```

3. Restart Camunda Modeler.

## Development

```bash
npm install
npm run dev   # rebuild on changes
```
