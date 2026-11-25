import { SplitGroup } from "../diagrams";
import type { ChoiceStep, TestQuestion, VisualHelp } from "../../../shared/engine/types";

// Practice and Test helpers shared by this lab's units. Kept apart from the
// unit files so a *Test.tsx never has to import from its unit.

/**
 * True after a wrong try or on Show me, for this step. Use it for any picture
 * that reveals the asked-for part. The shared `pointing()` is also true for a
 * hint with no try, and a hint before a try should only speak.
 */
export const afterTry = (help: VisualHelp | undefined, step: number): boolean => !!help && help.step === step && (help.wrong > 0 || help.showMe);

/** True after a wrong try or on Show me, on whichever step is active. */
const afterAnyTry = (help: VisualHelp | undefined): boolean => !!help && afterTry(help, help.step);

/** Put-together picture. A wrong try rings the new group; Show me on `step` numbers the dots. */
export const joinPicture = (a: number, b: number, step: number, help: VisualHelp | undefined, showDivider = true) => {
  const counting = !!help?.showMe && help.step === step;
  return <SplitGroup key={counting ? "show" : "ask"} total={a + b} partA={a} toneA="a" toneB="b" showDivider={showDivider} ringB={afterAnyTry(help) && !counting} countAlong={counting ? { items: a + b } : undefined} />;
};

/** Take-away picture. One color at first. A wrong try acts it out: the part leaving fades and is ringed. */
export const takePicture = (total: number, b: number, step: number, done: number, help: VisualHelp | undefined) => {
  const stuck = afterAnyTry(help);
  const faded = done > step || stuck;
  const counting = !!help?.showMe && help.step === step;
  return (
    <SplitGroup
      key={counting ? "show" : "ask"}
      total={total}
      partA={faded ? total - b : total}
      toneA="a"
      toneB="b"
      showDivider={false}
      goneB={faded}
      ringB={stuck && !counting}
      countAlong={counting ? { items: total - b } : undefined}
    />
  );
};

/** Name buttons in the color of their row, as the CFU draws them. */
export const colorNames = (step: ChoiceStep, firstName: string): ChoiceStep => ({
  ...step,
  display: step.choices.map((name) => (
    <span key={name} className="atn-name" style={{ color: `var(--q${name === firstName ? "a" : "b"})`, fontWeight: 800 }}>
      {name}
    </span>
  )),
});

const promptKey = (q: TestQuestion) => String(q.step.prompt);

/**
 * Wraps a Test's question list so no prompt appears twice in one sitting: a
 * generator redraws when its prompt was already used. UnitTestView calls the
 * list in order for each sitting, so the first generator starts a new one.
 * `sameIdea` can name a question's idea (or return null), so two different
 * prompts about the same thing are redrawn too.
 */
export const noRepeats = (list: (() => TestQuestion[])[], sameIdea?: (q: TestQuestion, make: () => TestQuestion[]) => string | null): (() => TestQuestion[])[] => {
  const used = new Set<string>();
  return list.map((make, index) => () => {
    if (index === 0) used.clear();
    const keys = (q: TestQuestion) => {
      const idea = sameIdea?.(q, make);
      return idea ? [promptKey(q), `idea:${idea}`] : [promptKey(q)];
    };
    let drawn = make();
    for (let tries = 0; tries < 500 && drawn.some((q) => keys(q).some((key) => used.has(key))); tries++) drawn = make();
    drawn.forEach((q) => keys(q).forEach((key) => used.add(key)));
    return drawn;
  });
};
