import type { LevelSkill } from "../../utils/levelSubsections";

/** "MultDivFractionLab" -> "Mult Div Fraction Lab", used whenever a skill has no explicit label. */
const humanize = (skillId: string): string =>
  skillId
    .replace(/([a-z\d])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");

interface SkillPickerProps {
  skills: LevelSkill[];
  onSelect: (skill: LevelSkill) => void;
}

/**
 * Shown whenever a practice mode has more than one skill registered for the
 * level (e.g. MG11 has both PowersOfTen and MultDivFractionLab under
 * "standalone") — without this, PracticeSessionPage would have to silently
 * pick one, leaving the other permanently unreachable from the student side.
 */
export default function SkillPicker({ skills, onSelect }: SkillPickerProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
      <h2 className="text-lg font-bold text-gray-800 mb-2">What do you want to practice?</h2>
      <p className="text-sm text-gray-400 mb-6">Pick one to get started.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {skills.map((skill) => (
          <button
            key={skill.skillId}
            onClick={() => onSelect(skill)}
            className="flex-1 sm:max-w-xs px-6 py-5 rounded-xl border-2 font-semibold transition-all duration-200 border-purple-200 text-purple-700 hover:border-purple-400 hover:bg-purple-50"
          >
            {skill.label ?? humanize(skill.skillId)}
          </button>
        ))}
      </div>
    </div>
  );
}
