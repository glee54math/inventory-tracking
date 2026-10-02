import { PLACE_NAMES, PLACE_SHORT, placeholders, type Digit } from './MG11_PowersOfTen_numberModel';
import { tw } from './MG11_PowersOfTen_styles';

export type ChartRow = { label: string; tiles: Digit[] };

const cellBase =
  'relative h-[38px] min-w-[34px] border border-[#C9D5EA] px-1.5 py-1 text-center text-xl font-semibold ' +
  '[font-family:Fredoka,Nunito,system-ui,sans-serif] dark:border-[#34405E]';
const cellDigit = 'bg-[#F5B700] text-[#2E2200] dark:bg-[#F5C53A] dark:text-[#231A00]';
const cellPlaceholder = 'text-[#56618A] dark:text-[#A3AECB]';
// The decimal point: a dot on the right edge of the ones column.
const decimalDot =
  "after:absolute after:-right-1 after:bottom-[5px] after:z-[1] after:h-[7px] after:w-[7px] after:rounded-full " +
  "after:bg-[#C93B33] after:content-[''] dark:after:bg-[#FF8078]";
const headCell =
  'min-w-[34px] border border-[#C9D5EA] px-1.5 py-1 text-center text-xs font-extrabold ' +
  'text-[#56618A] dark:border-[#34405E] dark:text-[#A3AECB]';
const rowHead =
  'border border-[#C9D5EA] py-1 pl-1.5 pr-2 text-left text-xs font-semibold ' +
  'text-[#56618A] dark:border-[#34405E] dark:text-[#A3AECB]';

/** Compact static place value chart used in answer explanations. */
export default function PlaceValueChart({ rows }: { rows: ChartRow[] }) {
  const all = rows.flatMap((r) => [...r.tiles, ...placeholders(r.tiles)]);
  const hi = Math.max(0, ...all.map((t) => t.place));
  const lo = Math.min(-1, ...all.map((t) => t.place));
  const cols: number[] = [];
  for (let p = hi; p >= lo; p--) cols.push(p);

  return (
    <>
      <div className="mt-2.5 overflow-x-auto">
        <table className="border-collapse rounded-lg bg-white text-sm dark:bg-[#1B2338]">
          <thead>
            <tr>
              <th className={headCell} />
              {cols.map((p) => (
                <th key={p} title={PLACE_NAMES[p]} className={headCell}>{PLACE_SHORT[p]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const byPlace = new Map(row.tiles.map((t) => [t.place, t.d]));
              const ph = new Set(placeholders(row.tiles).map((t) => t.place));
              return (
                <tr key={row.label}>
                  <th scope="row" className={rowHead}>{row.label}</th>
                  {cols.map((p) => {
                    const isDigit = byPlace.has(p);
                    const isPh = ph.has(p);
                    const cls = [
                      cellBase,
                      isDigit ? cellDigit : isPh ? cellPlaceholder : '',
                      p === 0 ? decimalDot : '',
                    ].join(' ');
                    return (
                      <td key={p} className={cls}>
                        {isDigit ? byPlace.get(p) : isPh ? 0 : ''}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className={tw.key}>
        O ones, t tenths, h hundredths, th thousandths. Dashed zeros are placeholders.
      </div>
    </>
  );
}
