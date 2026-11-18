# CFU "Look here" pointer rollout (MG1–MG9)

## The rule (user-approved, piloted in MG10 WholeNumberAndDecimalOperationsLab)
- In a unit's Check for Understanding, when a question **part** is wrong for the **2nd** time, the part gets a pointer to the Explore spot that teaches it.
- "Go there" / "Look here!" scrolls to that spot. It gets an orange outline, a "Look here" badge, and its key sentence in bold on yellow.
- Each part counts its own wrong Checks. Two wrong parts → two pointers, two lit spots. Pressing Check again with the same answers is not a new try.
- A highlight stays until its part is right. "Go there" in another question clears the old spots.
- **Never give the answer away.** Point to the teaching, not the answer. Explore's default numbers must not be the CFU's numbers (change the default if they are).
- If Explore has nothing that teaches a part, add **one short teaching line** there, in plain words for the lab's audience. No grade references; stack every fraction.
- Labs that don't opt in are unchanged.

## Shared pieces
| File | What |
|---|---|
| `shared/lib/lookHere.ts` | `lookHereSpot(id)` marks an Explore element; `data-look-here-key` marks its key sentence. `lookHere(id, keep, { arrow })`, `clearLookHere(id)`. `useLookHereRequest(fn)` lets an Explore switch modes/tabs when a CFU asks for a spot that only one mode shows. |
| `shared/components/CfuPointers.tsx` | `useCfuPointers(parts, { done, rightNow?, early? })` → `{ pointers, goThere, record }`; `<StuckBox {...ptr} early? />` renders the pointers. `ExploreTarget = { target, label, say? }`. |
| `shared/components/CfuQuestion.tsx` | `DropdownQuestion` uses the hook: pass `exploreTarget` on the question, or per blank with `part`. |

## Adopting it in a hand-built CFU
```tsx
import { StuckBox, useCfuPointers } from "../../../shared/components/CfuPointers";
import { lookHereSpot } from "../../../shared/lib/lookHere";

const LOOK = { start: { target: "cob-keep", label: "Explore: keep the number you have", say: "Look here. Start at the number you have." } };

// in the question component
const ptr = useCfuPointers(
  [{ key: "start", part: "Start", to: LOOK.start }, { key: "many", part: "How many", to: LOOK.many }],
  { done: checked && ok, early: true, rightNow: (p) => checked && partOk(p.key) } // rightNow: only if boxes re-grade live after a Check
);
const check = () => { ptr.record((p) => partOk(p.key), `${start}|${many}`); setChecked(true); };
// <button onClick={check}>Check Answer</button>
// <StuckBox {...ptr} early />

// in Explore
<p {...lookHereSpot("cob-keep")}><span data-look-here-key>Notice you never had to start over…</span></p>
useLookHereRequest((id) => { if (id === "cob-back") setMode("back"); }); // only if the spot is in another mode
```
One idea taught in one place = one part, even if it has several boxes (e.g. a number bond + its two sentences).

## Early-grade variant (`early`) — MK labs and MG1–MG4
- Instead of "Stuck? Look here first: …", a big orange button: eye icon, **"Look here!"**, up-arrow (part name only if there are 2+ buttons). One button per Explore spot.
- Tap → says the part's `say` line with the lab's read-aloud voice (`sayText`, only inside `<TtsProvider>`), scrolls, lights the spot, and shows a big bouncing arrow over it (no motion with reduced-motion).
- `say` is a few words, starting "Look here." — e.g. "Look here. Start at the bigger number." It points to the idea, never says the answer.
- Reading labs (MG5+) leave `early` off and get the MG10 text line.

## Status

> The main per-lab tracker is now `../LAB_STATUS.md`. Pointers are added as part of each lab's review workflow; this table only keeps the CFU details.

| Lab | CFU units | CFU style | Status |
|---|---|---|---|
| MG1_AdditionAndSubtractionWithin20Lab | 6 | KCheck (rebuilt 2026-11-17) | **done** (early; via review, `../MG1_AdditionAndSubtractionWithin20Lab/`) |
| MG2_PlaceValueTo120Lab | 5 | KCheck (rebuilt 2026-11-17) | **done** (early; via review, `../MG2_PlaceValueTo120Lab/`) |
| MG3_MeasurementTimeAndDataLab | 4 | hand-built | todo (early) |
| MG4_ShapesAndFractionsIntroLab | 3 | hand-built | todo (early) |
| MG5_EvenOddAndArraysLab | 4 | hand-built | todo |
| MG5_ExtendingAdditionAndSubtractionLab | 5 | hand-built | todo |
| MG5_MeasurementMoneyAndDataLab | 6 | hand-built | todo |
| MG5_PlaceValueTo1000Lab | 4 | hand-built | todo |
| MG5_ShapesAndEqualSharesLab | 3 | hand-built | todo |
| MG6_AreaAndPerimeterLab | 5 | hand-built | todo |
| MG6_FractionsFoundationsLab | 5 | hand-built | todo |
| MG6_PlaceValueAndFluencyTo1000Lab | 4 | hand-built | todo |
| MG7_DivisionAndWordProblemsLab | 4 | hand-built | todo |
| MG7_MultiplicationFoundationsLab | 5 | hand-built | todo |
| MG7_QuadrilateralsAndPartitioningLab | 3 | hand-built | todo |
| MG7_TimeMeasurementAndDataLab | 6 | hand-built | todo |
| MG8_AnglesAndProtractorLab | 3 | hand-built | todo |
| MG8_FactorsMultiplesAndPatternsLab | 4 | hand-built | todo |
| MG8_LinesAnglesAndShapeClassificationLab | 5 | hand-built | todo |
| MG8_MultiplicativeComparisonAndWordProblemsLab | 4 | hand-built | todo |
| MG8_OneDigitDivisionLab | 0 | none (1 free-play Explore, no CFU) | n/a |
| MG9_DecimalsLab | 3 | hand-built | todo |
| MG9_FractionOperationsLab | 5 | lab-local `units/cfu.tsx` DropdownQuestion | todo (move to shared DropdownQuestion or add the hook to cfu.tsx) |
| MG9_IntroToFractionsLab | 4 | shared DropdownQuestion | todo (add `exploreTarget`s) |
| MG9_MeasurementConversionAndWordProblemsLab | 3 | hand-built | todo |
| MG9_MultiDigitMultiplicationLab | 0 | none (1 free-play Explore, no CFU) | n/a |
| MG9_TwoDigitDivisionLab | 0 | none (1 free-play Explore, no CFU) | n/a |

"CFU units" = unit files whose Explore takes `onIntroDone` (the CFU gate). MG10 WholeNumberAndDecimalOperationsLab is the original pilot (done).
