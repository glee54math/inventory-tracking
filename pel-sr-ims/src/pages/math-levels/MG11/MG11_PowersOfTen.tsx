import { useEffect } from 'react';
import PlaceValueExplorer from './MG11_PowersOfTen_PlaceValueExplorer';
import RulesPanel from './MG11_PowersOfTen_RulesPanel';
import PracticeCard from './MG11_PowersOfTen_PracticeCard';
import { tw } from './MG11_PowersOfTen_styles';

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600&family=Nunito:wght@400;600;700;800&display=swap';

/** Loads the Fredoka + Nunito web fonts once. Remove if your app already loads them. */
function useFonts() {
  useEffect(() => {
    if (document.querySelector(`link[href="${FONT_HREF}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONT_HREF;
    document.head.appendChild(link);
  }, []);
}

/** Grade 5, Module 1, Topic A: multiplying and dividing by powers of 10. */
function PowersOf10Practice() {
  useFonts();
  return (
    <div className={tw.root}>
      <main className="mx-auto max-w-[720px] px-4 pb-16 pt-7">
        <header>
          <h1 className={`${tw.display} text-[clamp(30px,7vw,44px)] font-semibold leading-[1.15] tracking-[-0.01em]`}>
            Moving digits with powers of 10
          </h1>
          <p className={`mt-2 max-w-[60ch] ${tw.muted}`}>
            When you multiply or divide by 10, 100, or 1,000, the digits don't change. They just slide on the place
            value chart. Try it: tap a button and watch where they go.
          </p>
        </header>
        <PlaceValueExplorer />
        <RulesPanel />
        <PracticeCard />
        <footer className={`mt-10 text-[13px] ${tw.muted}`}>
          Based on Grade 5, Module 1, Topic A: place value and decimal fractions.
        </footer>
      </main>
    </div>
  );
}

// Named export (used by levelSubsections.ts's componentExport, like every other skill
// in this project) alongside the default export. Same reasoning as MG6_BarModel.tsx —
// no separate "Demo" wrapper per MATH_TSX_STYLE_GUIDE.txt convention, since this IS the
// complete self-contained practice page already.
export { PowersOf10Practice };
export default PowersOf10Practice;
