# Data model

**Status:** v1 draft · **Code:** [`Models.swift`](../../packages/OmnieKit/Sources/OmnieKit/Store/Models.swift)

## 1. Storage
- **SwiftData**, synced through the **iCloud private database** (CloudKit). No Omnie server, no accounts.
- CloudKit rules apply to every model: all properties have defaults or are optional, all relationships are optional, no unique constraints. Large blobs (`CanvasDocument.snapshot`, `Asset.data`) use external storage.
- **API keys are never stored here.** They live in the Keychain (`kSecAttrSynchronizable` for iCloud Keychain), optionally behind Face ID.
- Provider choices and settings (which model per task, spend caps, verification level) live in a small `Settings` JSON in `NSUbiquitousKeyValueStore`, so they sync without a model migration.

## 2. Entities

```
Notebook ─1:1─ CanvasDocument          (scene snapshot JSON)
   │
   └─1:n─ Problem ─1:n─ Asset          (photos, PDFs, splat worlds)
             ├─1:n─ SolutionStep       (hint ladder rungs)
             ├─1:n─ Attempt            (student tries, "Check my work")
             └─1:n─ StoredVerdict      (Verdict JSON + status)

SkillMastery                           (per skill, BKT estimate)
```

| Entity | Key fields | Notes |
|---|---|---|
| `Notebook` | title, subject | One canvas per notebook |
| `CanvasDocument` | engine, engineVersion, snapshot | `SceneSnapshot` as JSON; `engine` lets us migrate engines later |
| `Problem` | text, latex, domain, skillIds | Text is what the student confirmed after OCR |
| `SolutionStep` | index, rung, text, revealedAt | `revealedAt == nil` means not yet unlocked |
| `Attempt` | answerText, correct, firstWrongStep, hintsUsed | Drives hint unlocking and mastery updates |
| `StoredVerdict` | status, json | Whole `Verdict` as JSON so the schema can evolve without migrations; `status` copied out for filtering |
| `SkillMastery` | skillId, pKnown, opportunities | Bayesian Knowledge Tracing; skill IDs come from subject packs |
| `Asset` | kind, mimeType, data, origin | Served to the canvas as `omnie://asset/<id>` |

## 3. Export
"Export my data" writes a `.zip` with one folder per notebook (`canvas.excalidraw`, `problems.json`, verdicts, assets) plus `mastery.json`. A `.omnie` share file is the same for a single notebook.

## 4. Open for Phase 1
- Whether `SkillMastery` should be keyed per subject pack version.
- Retention: should old `StoredVerdict`s be pruned after a re-verification?
