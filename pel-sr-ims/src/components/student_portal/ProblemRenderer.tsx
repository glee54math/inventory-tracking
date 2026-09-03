import { useEffect, useMemo, useState } from "react";
import type { ComponentType } from "react";
import type { LevelSkill } from "../../utils/levelSubsections";
import { getProblemsForLevel, incrementUsage } from "../../utils/problemBankService";
import type { ProblemDoc } from "../../utils/problemTypes";
import { WordProblem } from "../../pages/math-levels/WordProblems";

interface ProblemRendererProps {
  level: string;
  skill: LevelSkill;
}

// Generates a fallback pair of numbers for the free client-side template generator
// (used whenever problemBank has no cached problem yet for this skill).
function generateFallbackNums(
  operation: "add" | "sub" | "mult" | "div",
  range: { min: number; max: number }
): number[] {
  const rand = () => Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  if (operation === "sub") {
    let a = rand();
    let b = rand();
    if (b > a) [a, b] = [b, a];
    return [a, b];
  }
  if (operation === "div") {
    const divisor = Math.max(2, Math.min(12, range.max));
    const quotient = rand();
    return [divisor * quotient, divisor];
  }
  return [rand(), rand()];
}

export default function ProblemRenderer({ level, skill }: ProblemRendererProps) {
  const [showFeedback, setShowFeedback] = useState(false);

  if (skill.type === "visual") {
    return <VisualProblem skill={skill} showFeedback={showFeedback} setShowFeedback={setShowFeedback} />;
  }
  return (
    <WordProblemPractice
      level={level}
      skill={skill}
      showFeedback={showFeedback}
      setShowFeedback={setShowFeedback}
    />
  );
}

// ============================================================================
// VISUAL MODE — pure client-side, no Firestore
// ============================================================================

function VisualProblem({
  skill,
  showFeedback,
  setShowFeedback,
}: {
  skill: Extract<LevelSkill, { type: "visual" }>;
  showFeedback: boolean;
  setShowFeedback: (v: boolean) => void;
}) {
  const [Component, setComponent] = useState<ComponentType<Record<string, unknown>> | null>(null);
  const [params, setParams] = useState<Record<string, unknown>>(() => skill.generateParams());
  // Bumped on "New Problem" and used as the component's `key`. Every visual component
  // manages its filled-in inputs via its own internal useState (see
  // MATH_TSX_STYLE_GUIDE.txt section 3) — just changing `params` re-renders the SAME
  // instance with new props but leaves old typed-in answers sitting in state. A key
  // change forces React to unmount/remount, which is the only thing that resets them.
  const [problemKey, setProblemKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setComponent(null);
    import(`../../pages/math-levels/${skill.componentFile}.tsx`).then((mod) => {
      if (!cancelled) setComponent(() => mod[skill.componentExport]);
    });
    return () => {
      cancelled = true;
    };
  }, [skill.componentFile, skill.componentExport]);

  const newProblem = () => {
    setParams(skill.generateParams());
    setProblemKey((k) => k + 1);
    setShowFeedback(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-center gap-3 mb-4">
        <button
          onClick={() => setShowFeedback(!showFeedback)}
          className="px-5 py-2 !bg-green-500 text-white rounded-lg font-medium hover:!bg-green-600 transition-colors"
        >
          {showFeedback ? "Hide" : "Check"} Answer
        </button>
        <button
          onClick={newProblem}
          className="px-5 py-2 !bg-blue-500 text-white rounded-lg font-medium hover:!bg-blue-600 transition-colors"
        >
          New Problem
        </button>
      </div>
      {Component ? (
        <Component key={problemKey} {...params} showFeedback={showFeedback} size="md" />
      ) : (
        <p className="text-center text-gray-400 py-12">Loading...</p>
      )}
    </div>
  );
}

// ============================================================================
// WORD PROBLEM MODE — reads problemBank, falls back to the free template
// generator on a cache miss (see WORD_PROBLEM_TOPICS.txt for how a level
// gets word-problem practice configured at all).
// ============================================================================

function WordProblemPractice({
  level,
  skill,
  showFeedback,
  setShowFeedback,
}: {
  level: string;
  skill: Extract<LevelSkill, { type: "wordProblem" }>;
  showFeedback: boolean;
  setShowFeedback: (v: boolean) => void;
}) {
  const [cached, setCached] = useState<ProblemDoc[] | null>(null);
  const [problemKey, setProblemKey] = useState(0); // bump to force WordProblem to re-roll on a cache miss

  useEffect(() => {
    let cancelled = false;
    getProblemsForLevel(level, { skillId: skill.skillId }).then((docs) => {
      if (!cancelled) setCached(docs);
    });
    return () => {
      cancelled = true;
    };
  }, [level, skill.skillId]);

  // problemKey isn't read below — it's included purely to force a re-pick when
  // "New Problem" is clicked (same pattern as WordProblems.tsx's own useMemo).
  const chosenDoc = useMemo(() => {
    if (!cached || cached.length === 0) return null;
    const doc = cached[Math.floor(Math.random() * cached.length)];
    incrementUsage(doc.id).catch(() => {}); // best-effort, never blocks rendering
    return doc;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cached, problemKey]);

  const fallbackNums = useMemo(
    () => generateFallbackNums(skill.operation, skill.numberRange),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [skill.operation, skill.numberRange, problemKey]
  );

  const newProblem = () => {
    setProblemKey((k) => k + 1);
    setShowFeedback(false);
  };

  if (cached === null) {
    return <p className="text-center text-gray-400 py-12">Loading...</p>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-end mb-2">
        <button
          onClick={newProblem}
          className="px-5 py-2 !bg-blue-500 text-white rounded-lg font-medium hover:!bg-blue-600 transition-colors"
        >
          New Problem
        </button>
      </div>
      {chosenDoc ? (
        <WordProblem
          key={`cached-${problemKey}`}
          operation={skill.operation}
          nums={chosenDoc.nums}
          override={{
            text: chosenDoc.text,
            segments: chosenDoc.segments,
            answer: chosenDoc.answer,
            personName: chosenDoc.personName,
            unitSingular: chosenDoc.unitSingular,
            unitPlural: chosenDoc.unitPlural,
            keyword: chosenDoc.keyword,
          }}
          showFeedback={showFeedback}
          showHelp
          showCheckButton
          onCheckAnswer={() => setShowFeedback(!showFeedback)}
        />
      ) : (
        <WordProblem
          key={`fallback-${problemKey}`}
          operation={skill.operation}
          nums={fallbackNums}
          showFeedback={showFeedback}
          showHelp
          showCheckButton
          onCheckAnswer={() => setShowFeedback(!showFeedback)}
        />
      )}
    </div>
  );
}
