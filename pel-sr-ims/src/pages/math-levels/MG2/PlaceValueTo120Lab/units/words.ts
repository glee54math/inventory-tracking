// Small word helpers shared by the unit files AND their Test files. This file
// imports nothing from any unit or test, so it can't create the unit <-> Test
// import cycle the builder warns about.

/** "1 ten" / "3 tens" (review E1-07: never "1 tens"). */
export const tensW = (n: number) => `${n} ten${n === 1 ? "" : "s"}`;
/** "1 one" / "4 ones" (never "1 ones"). */
export const onesW = (n: number) => `${n} one${n === 1 ? "" : "s"}`;
/** "1 stick" / "11 sticks". */
export const sticksW = (n: number) => `${n} stick${n === 1 ? "" : "s"}`;
/** "1 cube" / "4 cubes". */
export const cubesW = (n: number) => `${n} cube${n === 1 ? "" : "s"}`;

/** "Show me" pacing: about 1 second per item said, after a short lead-in. */
export const holdFor = (items: number) => 1000 + Math.max(1, items) * 1000;

/** "10, 20, 30" — the numbers said counting `n` sticks by tens. */
export const countTens = (n: number) => Array.from({ length: n }, (_, i) => (i + 1) * 10).join(", ");
/** "1, 2, 3" — the numbers said counting `n` cubes. */
export const countOnes = (n: number) => Array.from({ length: n }, (_, i) => i + 1).join(", ");
