// levelFileHelpers.ts
// Shared logic for the admin-facing level file browser (AllLevelsPage + LevelFilesPage).

// A file is a "supporting file" of a multi-file skill (see MATH_TSX_STYLE_GUIDE.txt
// section 11 — e.g. MG6_BarModel_Diagram.tsx supports MG6_BarModel.tsx) if its name is
// prefixed by another file in the same folder plus an underscore. The level id itself
// doesn't count as that "other file" — every skill is already prefixed by its level
// (MG6_TwoDigitVisualAddition, MG6_BarModel, ...), so without excluding it every skill
// would wrongly look like a supporting file of the bare shell. Supporting files take
// required props from their parent and crash or render blank when mounted alone with
// none, so they're excluded from admin browsing rather than shown as dead-end buttons.
export function isSupportingFile(fileName: string, levelId: string, allFiles: string[]): boolean {
  return allFiles.some(
    (other) => other !== fileName && other !== levelId && fileName.startsWith(`${other}_`)
  );
}

// Previewable (non-supporting) file names for one level, from an import.meta.glob result
// and its key prefix (e.g. "./math-levels/").
export function previewableFilesForLevel(
  modules: Record<string, unknown>,
  prefix: string,
  levelId: string
): string[] {
  const pattern = new RegExp(`^${prefix}${levelId}/([^/]+)\\.tsx$`);
  const allFiles = Object.keys(modules)
    .map((path) => path.match(pattern)?.[1])
    .filter((name): name is string => !!name);
  return allFiles.filter((name) => !isSupportingFile(name, levelId, allFiles));
}

// Count of previewable files per level, across every level in one glob result.
export function countPreviewableFilesByLevel(
  modules: Record<string, unknown>,
  prefix: string
): Record<string, number> {
  const byLevel: Record<string, string[]> = {};
  const groupPattern = new RegExp(`^${prefix}([^/]+)/([^/]+)\\.tsx$`);
  for (const path of Object.keys(modules)) {
    const m = path.match(groupPattern);
    if (!m) continue;
    const [, level, name] = m;
    (byLevel[level] ??= []).push(name);
  }

  const counts: Record<string, number> = {};
  for (const [level, files] of Object.entries(byLevel)) {
    counts[level] = files.filter((name) => !isSupportingFile(name, level, files)).length;
  }
  return counts;
}
