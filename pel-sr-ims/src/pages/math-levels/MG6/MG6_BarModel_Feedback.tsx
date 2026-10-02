import type { Feedback as FeedbackT } from "./MG6_BarModel_types";

export default function Feedback({ feedback }: { feedback: FeedbackT | null }) {
  return (
    <div
      aria-live="polite"
      className={
        feedback?.good
          ? "mt-2 min-h-[1.6em] font-medium text-green-700 dark:text-green-400"
          : "mt-2 min-h-[1.6em] text-orange-600 dark:text-orange-400"
      }
    >
      {feedback?.message ?? ""}
    </div>
  );
}
