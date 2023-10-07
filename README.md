# HasuraBase (hasura-base-quasar)

Companion starter UI for hasura-base. Includes user auth and profile edit workflows.

## Install the dependencies

```bash
yarn
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
yarn dev
```

### Lint the files
```bash
yarn lint
# or
npm run lint
```

### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).


### CodeGen

This demo app uses URQL and [GraphQL Code Generator](https://the-guild.dev/graphql/codegen).

After creating a new query or muation with graphql() you will need to re-run codegen with:

```
yarn codegen
```
