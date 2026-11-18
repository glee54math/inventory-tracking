import type { LevelSkill } from "../../utils/levelSubsections";
import { LAB_BY_ID, unmetNeeds, type LabStatusMap } from "../../utils/labOrder";

/** "MultDivFractionLab" -> "Mult Div Fraction Lab", used whenever a skill has no explicit label. */
const humanize = (skillId: string): string =>
  skillId
    .replace(/([a-z\d])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");

interface SkillPickerProps {
  skills: LevelSkill[];
  onSelect: (skill: LevelSkill) => void;
  /** Lab order (standalone labs only): finished labs, and labs whose needs aren't finished yet. */
  statuses?: LabStatusMap | null;
  /** The lab to suggest ("Next up"). */
  nextUpId?: string | null;
  /** Opens Mr. Lee's PIN panel. */
  onTeacher?: () => void;
}

const labIdOf = (skill: LevelSkill) => ("componentFile" in skill ? skill.componentFile : null);

/**
 * Shown whenever a practice mode has more than one skill registered for the
 * level (e.g. MG11 has both PowersOfTen and MultDivFractionLab under
 * "standalone") — without this, PracticeSessionPage would have to silently
 * pick one, leaving the other permanently unreachable from the student side.
 * For labs it also nudges the order: "Next up", "Finished", "Try … first".
 * Every lab stays tappable.
 */
export default function SkillPicker({ skills, onSelect, statuses, nextUpId, onTeacher }: SkillPickerProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
      <h2 className="text-lg font-bold text-gray-800 mb-2">What do you want to practice?</h2>
      <p className="text-sm text-gray-400 mb-6">Pick one to get started.</p>
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 justify-center">
        {skills.map((skill) => {
          const id = labIdOf(skill);
          const isLab = !!id && !!LAB_BY_ID[id] && !!statuses;
          const finished = isLab && statuses![id!]?.finished;
          const isNext = isLab && !finished && id === nextUpId;
          const unmet = isLab && !finished ? unmetNeeds(id!, statuses!) : [];
          return (
            <button
              key={skill.skillId}
              onClick={() => onSelect(skill)}
              className={`flex-1 sm:max-w-xs px-6 py-5 rounded-xl border-2 font-semibold transition-all duration-200 flex flex-col items-center gap-2 ${
                isNext
                  ? "border-tertiary-500 text-tertiary-700 bg-tertiary-50 hover:border-tertiary-600"
                  : "border-tertiary-200 text-tertiary-700 hover:border-tertiary-400 hover:bg-tertiary-50"
              }`}
            >
              {isNext && <span className="text-xs font-bold uppercase tracking-wide text-white bg-tertiary-600 rounded-full px-3 py-0.5">Next up</span>}
              <span>{skill.label ?? humanize(skill.skillId)}</span>
              {finished && <span className="text-xs font-semibold text-success-700 bg-success-50 rounded-full px-3 py-0.5">✓ Finished</span>}
              {unmet.length > 0 && (
                <span className="text-xs font-medium text-amber-700">
                  Try first: {unmet.map((n) => `${n.label} (${n.level})`).join(", ")}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {onTeacher && (
        <button onClick={onTeacher} className="mt-6 text-xs font-medium text-gray-400 hover:text-gray-600 underline !bg-transparent">
          Teacher
        </button>
      )}
    </div>
  );
}
