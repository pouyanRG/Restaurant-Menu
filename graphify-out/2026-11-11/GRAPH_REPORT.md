# Graph Report - food-app  (2026-11-11)

## Corpus Check
- 32 files · ~6,006 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .example 1, (none) 1, .css 1)

## Summary
- 146 nodes · 258 edges · 11 communities (9 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `972809a7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Runtime Dependencies
- Menu Discovery and Chat
- Package Release Workflow
- Header and Search Controls
- Food Detail Pages
- Product Cards and Navigation
- Chat API and Rate Limiting
- Root Layout and Fonts
- Module Alias Configuration
- Next.js Configuration
- Vercel Deployment Region

## God Nodes (most connected - your core abstractions)
1. `ChevronRight()` - 11 edges
2. `HomePage()` - 10 edges
3. `ChatSection()` - 9 edges
4. `react` - 8 edges
5. `HeartIcon()` - 7 edges
6. `next` - 7 edges
7. `FoodDetails()` - 6 edges
8. `ProductCard()` - 6 edges
9. `HeaderBar()` - 5 edges
10. `AppLayout()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `HomePage()` --calls--> `ChatSection()`  [EXTRACTED]
  app/page.js → components/ChatSection.js
- `ChatSection()` --calls--> `useKeyboardInset()`  [EXTRACTED]
  components/ChatSection.js → lib/useKeyboardInset.js
- `HomePage()` --calls--> `HeaderBar()`  [EXTRACTED]
  app/page.js → components/HeaderBar.js
- `HomePage()` --calls--> `NotificationPanel()`  [EXTRACTED]
  app/page.js → components/NotificationPanel.js
- `HomePage()` --calls--> `SearchSection()`  [EXTRACTED]
  app/page.js → components/SearchSection.js

## Import Cycles
- None detected.

## Communities (11 total, 2 thin omitted)

### Community 0 - "Runtime Dependencies"
Cohesion: 0.10
Nodes (25): dependencies, next@^16.3.8, react@18.3.1, react-dom@18.3.1, @upstash/ratelimit@^2.2.0, @upstash/redis@^1.39.0, devDependencies, eslint@^10.12.0 (+17 more)

### Community 1 - "Menu Discovery and Chat"
Cohesion: 0.29
Nodes (9): ChatSection(), handleSubmit(), send(), findMentioned(), MiniCard(), QUICK, PlusIcon(), SendIcon() (+1 more)

### Community 2 - "Package Release Workflow"
Cohesion: 0.12
Nodes (19): runs-on, steps, NODE_AUTH_TOKEN, jobs, build, publish-npm, name, on (+11 more)

### Community 3 - "Header and Search Controls"
Cohesion: 0.21
Nodes (12): FilterModalTrigger(), HeaderBar(), base, BellIcon(), ChevronRight(), FilterIcon(), PinIcon(), SearchIcon() (+4 more)

### Community 4 - "Food Detail Pages"
Cohesion: 0.16
Nodes (15): FoodPage(), generateMetadata(), HomePage(), AppLayout(), CategoryHorizontalScroller(), FoodDetails(), LiquidGlassDefs(), MAP (+7 more)

### Community 5 - "Product Cards and Navigation"
Cohesion: 0.26
Nodes (9): CurvedBottomNavigation(), Item(), DiscountBadge(), HeartIcon(), HomeIcon(), MessageIcon(), ProductCard(), ProductGrid() (+1 more)

### Community 6 - "Chat API and Rate Limiting"
Cohesion: 0.21
Nodes (11): buildGenerationConfig(), callGemini(), isAllowedOrigin(), json(), maxDuration, menuText, MODELS, POST() (+3 more)

### Community 7 - "Root Layout and Fonts"
Cohesion: 0.29
Nodes (4): metadata, roboto, vazir, viewport

### Community 8 - "Module Alias Configuration"
Cohesion: 0.50
Nodes (3): compilerOptions, baseUrl, paths

## Knowledge Gaps
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `Runtime Dependencies` to `Menu Discovery and Chat`, `Food Detail Pages`, `Product Cards and Navigation`, `Root Layout and Fonts`?**
  _High betweenness centrality (0.154) - this node is a cross-community bridge._
- **Should `Runtime Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.09686609686609686 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Food Detail Pages` to `Runtime Dependencies`, `Menu Discovery and Chat`, `Header and Search Controls`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Should `Package Release Workflow` be split into smaller, more focused modules?**
  _Cohesion score 0.11578947368421053 - nodes in this community are weakly interconnected._
- **Why does `products` connect `Food Detail Pages` to `Menu Discovery and Chat`, `Chat API and Rate Limiting`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._