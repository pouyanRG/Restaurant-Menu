## graphify

For any question about this repo's architecture, structure, components, or how to add/modify/find
code, your first action should be `graphify query "<question>"` when `graphify-out/graph.json`
exists. Use `graphify path "<A>" "<B>"` for relationship questions and `graphify explain "<concept>"`
for focused-concept questions. These return a scoped subgraph, usually much smaller than the full
report or raw grep output.

On Windows, if `graphify` is not on PATH, invoke the existing executable with
`& "$HOME\.local\bin\graphify.exe" query "<question>"`, or restart VS Code after updating PATH.

Triggers: architecture questions, code location or modification, component changes, and questions that depend on how files or classes relate.

If `graphify-out/wiki/index.md` exists, use it for broad navigation. Read `graphify-out/GRAPH_REPORT.md`
only for broad architecture review or when query/path/explain do not surface enough context. Only read
source files when (a) modifying/debugging specific code, (b) the graph lacks the needed detail, or
(c) the graph is missing or stale.

Type `/graphify` in Copilot Chat to build or update the graph.

## Graphify-first change workflow

Before proposing or making a change to existing application code:

1. If `graphify-out/graph.json` exists, query it first for the affected component, API route, utility, and data module. Expand query terms using the graph's actual node vocabulary. Use `graphify path` for relationships and `graphify explain` for a focused node.
2. List the potentially affected components, API routes, utilities, data modules, and relevant package/configuration dependencies.
3. Read the actual source files to verify graph relationships and understand the implementation before proposing a patch.
4. Treat the graph as incomplete evidence: check source code for runtime behavior, HTTP/fetch calls, dynamic imports, and other dependencies that static extraction might miss. Never infer that a dependency does not exist just because the graph has no edge.
5. Do not modify application source code until the user has approved the specific change. A request to explain, investigate, or configure workflow is not approval to edit application code.

After an approved, meaningful source-code change, run `graphify update .` from the repository root using the existing Graphify installation. Then run `graphify cluster-only .` to regenerate the graph's community labels, `GRAPH_REPORT.md`, and `graph.html` from the updated graph. Confirm the graph, report, and visualization are all current. Do not reinstall Graphify or create another Python environment.

On Windows, if `graphify` is not available on PATH, use the existing executable:
`& "$HOME\.local\bin\graphify.exe" update .`
Then use the same executable for `cluster-only .`.
