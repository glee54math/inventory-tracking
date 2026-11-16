# User notes — WholeNumberAndDecimalOperationsLab

These are the user's decisions and override `plan.md` where they differ.

## 2026-11-15 — initial thoughts (after the overlap check)

The user's words:

> 1. Build Unit 1.
> 2. Build Unit 2.
> 3. Build with utilizing Decimals with leading zeroes is okay. As long as the problems result in 1 digit x 1 digit, 2 digit x 1 digit, 3 digit x 1 digit, or multiplication that results in a multiple of 10, then it is okay.
> (ex: 0.7x0.2, 0.05x0.32, 2.73x0.3, 0.74x0.20 are all okay... Something like 0.35x0.32 is NOT okay)
>
> I don't want to build anything for the other units within the Whole Number & Decimal Operations since I need to think more about it.

What this means for the plan (my reading; confirm before building):

| Plan unit | Decision |
|---|---|
| Unit 1: Reading, Writing, and Comparing Decimals to Thousandths | **Build.** |
| Unit 2: Rounding Decimals | **Build.** |
| Unit 3: Multiplying Multi-Digit Whole Numbers | **Build, but with decimals.** The whole-number version already exists in MG9 MultiDigitMultiplicationLab. See the rule below. |
| Unit 4: Dividing by 2-Digit Divisors | **On hold.** The user wants to think more. |
| Unit 5: Adding, Subtracting, Multiplying, and Dividing Decimals | **On hold.** The user wants to think more. |

### Unit 3 multiplication rule
To check a problem, drop the decimal points and the leading zeros, then look at the digits left in each factor. It is allowed if either:
- one factor has a single digit and the other has 1, 2 or 3 digits (1×1, 2×1, 3×1); or
- the problem is a multiplication by a multiple of 10, where one factor is one nonzero digit followed by zeros.

| Example | Digits | Allowed? |
|---|---|---|
| 0.7 × 0.2 | 7 × 2 (1×1) | Yes |
| 0.05 × 0.32 | 5 × 32 (2×1) | Yes |
| 2.73 × 0.3 | 273 × 3 (3×1) | Yes |
| 0.74 × 0.20 | 74 × 20 (multiple of 10) | Yes |
| 0.35 × 0.32 | 35 × 32 (2×2) | **No** |

Leading zeros in factors (0.05) and in products are fine and are part of the skill (placing the decimal point).

## Context
The overlap check (2026-11-14) found:
- Unit 1 extends MG9 DecimalsLab, which only goes to hundredths. Nothing covers thousandths or expanded form.
- Nothing anywhere covers Unit 2 (decimal rounding).
- Unit 3's whole-number content is fully covered by MG9 MultiDigitMultiplicationLab.
- Unit 4 is mostly covered by MG9 TwoDigitDivisionLab, which never has remainders.
- Unit 5 partly overlaps MG11 DecimalOperations. Missing there: decimal × whole, decimal ÷ whole, and picture models.

Reusable pieces include:
- `MG9/DecimalsLab/diagrams/` (`HundredthsGrid`, `DecimalNumberLine`, `PlaceValueChart`; needs a thousandths column)
- `MG9/DecimalsLab/lib/decimals.ts`
- `MG11/MultDivFractionLab/diagrams/PlaceValueColumns.tsx`
- `shared/engine/types.ts` `verticalMultiply`

## 2026-11-15 — update
Units 1–2 were built (MG10, "Decimal Place Value & Rounding"); initial build only, no review rounds yet. The user then put **Unit 3 on hold too**, with Units 4–5: "We will hold off on Units 3, 4, and 5 since I haven't decided exactly what I want to do." The Unit 3 rule above is kept as an idea, not a go-ahead.
