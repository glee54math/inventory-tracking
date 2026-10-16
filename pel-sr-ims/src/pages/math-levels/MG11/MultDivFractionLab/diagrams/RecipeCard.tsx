import { palette } from "../../../shared/lib/palette";
import { Frac } from "../../../shared/engine/controls";

export interface RecipeIngredient {
  name: string;
  /** Singular form, e.g. "cup" — pluralized here when the amount is more than 1. */
  unit: string;
  whole?: number;
  n?: number;
  d?: number;
  /** True for the one ingredient the question asks about. */
  highlight?: boolean;
}

export interface RecipeCardProps {
  title: string;
  ingredients: RecipeIngredient[];
}

/** An amount in "regular" fraction style — "9", "3/4", or "9 2/3". */
function Amount({ whole, n, d }: Pick<RecipeIngredient, "whole" | "n" | "d">) {
  return (
    <>
      {whole !== undefined && <>{whole} </>}
      {n !== undefined && d !== undefined && <Frac n={n} d={d} />}
    </>
  );
}

/**
 * An ingredient list styled like a real recipe card — the "Practice" visual
 * for word problems about scaling a recipe up or down. The queried ingredient
 * (`highlight`) gets a tinted background so a 3rd/4th grader can find it at a
 * glance among several similar-looking rows, the same role `highlightShare`
 * plays on FractionBar.
 */
export function RecipeCard({ title, ingredients }: RecipeCardProps) {
  return (
    <div style={{ maxWidth: 300 }} role="img" aria-label={`${title} recipe, with a list of ingredients and amounts`}>
      <h4 style={{ margin: "0 0 12px", fontSize: 22, fontWeight: 700, color: palette.a }}>{title}</h4>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.05em", color: palette.muted, marginBottom: 6 }}>INGREDIENTS</div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {ingredients.map((ing, i) => {
          const amount = (ing.whole ?? 0) + (ing.n !== undefined && ing.d !== undefined ? ing.n / ing.d : 0);
          const unit = amount > 1 ? `${ing.unit}s` : ing.unit;
          return (
            <li
              key={i}
              style={{
                padding: "9px 8px",
                borderRadius: 6,
                borderBottom: `1px solid ${palette.line}`,
                background: ing.highlight ? palette.aSoft : "transparent",
                fontWeight: ing.highlight ? 700 : 400,
                color: ing.highlight ? palette.a : palette.ink,
              }}
            >
              <Amount whole={ing.whole} n={ing.n} d={ing.d} /> {unit} {ing.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
