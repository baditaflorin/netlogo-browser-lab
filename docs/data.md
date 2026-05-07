# Data Contract

The static data contract is versioned under `/data/v1/`.

`models.json`:

```json
{
  "schemaVersion": "v1",
  "models": []
}
```

Each model includes stable identifiers, searchable tags, default parameters, runtime support metadata, and a `simulationKind` used by the browser visual runner.

`models.meta.json` includes `generatedAt`, `sourceCommit`, `inputChecksum`, `modelCount`, `artifactVersion`, and `schemaVersion`.

Regenerate artifacts:

```sh
make data
```

The pipeline sorts models deterministically so diffs stay readable.
