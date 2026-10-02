import { Pow } from './MG11_PowersOfTen_MoveSentence';
import { tw } from './MG11_PowersOfTen_styles';

const ruleBase = 'rounded-l-md rounded-r-[14px] border-l-[6px] bg-white px-3.5 py-3 dark:bg-[#1B2338]';
const ruleTitle = `${tw.display} mb-1 text-[19px] font-semibold leading-[1.15]`;

export default function RulesPanel() {
  return (
    <section className="mt-[34px]" aria-labelledby="p10-rules-title">
      <h2 id="p10-rules-title" className={tw.h2}>The rules</h2>
      <div className="mt-3 grid gap-2.5 text-base min-[600px]:grid-cols-2">
        <div className={`${ruleBase} border-[#F5B700] dark:border-[#F5C53A]`}>
          <h3 className={ruleTitle}>Multiply: move left</h3>
          <p>× 10 moves every digit 1 place left. × 100 moves 2 places. × 1,000 moves 3. The number gets bigger.</p>
        </div>
        <div className={`${ruleBase} border-[#2F5BD3] dark:border-[#7C9BFF]`}>
          <h3 className={ruleTitle}>Divide: move right</h3>
          <p>÷ 10 moves every digit 1 place right. ÷ 100 moves 2. ÷ 1,000 moves 3. The number gets smaller.</p>
        </div>
        <div className={`${ruleBase} border-[#0B7F74] dark:border-[#45C9B6]`}>
          <h3 className={ruleTitle}>Exponents count the tens</h3>
          <p>
            <Pow n={3} /> = 10 × 10 × 10 = 1,000. The little 3 means "three 10s multiplied." It's also the number
            of zeros, and the number of places to move.
          </p>
        </div>
        <div className={`${ruleBase} border-[#C93B33] dark:border-[#FF8078]`}>
          <h3 className={ruleTitle}>Metric units</h3>
          <ul className="mt-1 list-disc pl-[18px]">
            <li>1 m = 100 cm = <Pow n={2} /> cm</li>
            <li>1 m = 1,000 mm = <Pow n={3} /> mm</li>
            <li>1 km = 1,000 m, 1 L = 1,000 mL, 1 kg = 1,000 g</li>
          </ul>
          <p className="mt-1">Big unit to small unit: multiply. Small to big: divide.</p>
        </div>
      </div>
    </section>
  );
}
