import { useEffect, useRef, useState } from 'react';
import {
  MAX_PLACE, PLACE_NAMES, PLACE_SHORT, POW, fits, parseNum, placeholders, shift, toStr, type Digit,
} from './MG11_PowersOfTen_numberModel';
import { MoveSentence } from './MG11_PowersOfTen_MoveSentence';
import { tw } from './MG11_PowersOfTen_styles';

type Tile = Digit & { id: number };
type LastMove = { equation: string; n: number; mult: boolean };

const PRESETS = ['3.452', '345', '2.5', '0.72', '48.06', '320'];
const OPS = [1, 2, 3, -1, -2, -3];
const COLUMNS = Array.from({ length: 10 }, (_, i) => MAX_PLACE - i); // 6 .. -3
const leftPct = (place: number) => `${(MAX_PLACE - place) * 10}%`;
const SLIDE_MS = 700;

const tileBase =
  'absolute top-2 ml-[3px] flex h-[46px] w-[calc(10%-6px)] items-center justify-center rounded-[9px] ' +
  'text-[26px] font-semibold [font-family:Fredoka,Nunito,system-ui,sans-serif]';
const tileDigit =
  'bg-[#F5B700] text-[#2E2200] shadow-[0_3px_0_rgba(0,0,0,0.18)] dark:bg-[#F5C53A] dark:text-[#231A00] ' +
  'transition-[left] duration-700 [transition-timing-function:cubic-bezier(.5,0,.2,1)] motion-reduce:transition-none';
const tilePlaceholder =
  'border-2 border-dashed border-[#56618A] bg-transparent text-[#56618A] dark:border-[#A3AECB] dark:text-[#A3AECB] ' +
  'transition-opacity duration-300 motion-reduce:transition-none';
const opBase =
  'min-h-12 rounded-xl px-1.5 py-3 text-lg font-extrabold cursor-pointer disabled:cursor-not-allowed disabled:opacity-[.35] ' +
  'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#2F5BD3] dark:focus-visible:outline-[#7C9BFF]';
const opMul = 'border-0 bg-[#2F5BD3] text-white dark:bg-[#7C9BFF] dark:text-[#0E1426]';
const opDiv =
  'border-[1.5px] border-[#C9D5EA] bg-[#F4F7FC] text-[#1B2440] dark:border-[#34405E] dark:bg-[#222C45] dark:text-[#E8EDF8]';

/** Interactive chart: digits slide left/right when you multiply or divide by 10, 100, 1,000. */
export default function PlaceValueExplorer() {
  const nextId = useRef(0);
  const makeTiles = (s: string): Tile[] =>
    (parseNum(s) ?? []).map((t) => ({ ...t, id: nextId.current++ }));

  const [tiles, setTiles] = useState<Tile[]>(() => makeTiles('3.452'));
  const [activePreset, setActivePreset] = useState<string | null>('3.452');
  const [lastMove, setLastMove] = useState<LastMove | null>(null);
  const [placeholdersShown, setPlaceholdersShown] = useState(true);
  const [ownValue, setOwnValue] = useState('');
  const [ownError, setOwnError] = useState('');

  // After a slide, placeholder zeros fade in once the digits have arrived.
  useEffect(() => {
    if (placeholdersShown) return;
    const id = window.setTimeout(() => setPlaceholdersShown(true), SLIDE_MS - 20);
    return () => window.clearTimeout(id);
  }, [placeholdersShown]);

  const load = (s: string, preset: string | null) => {
    setTiles(makeTiles(s));
    setActivePreset(preset);
    setLastMove(null);
    setPlaceholdersShown(true);
  };

  const apply = (n: number) => {
    const next = shift(tiles, n);
    if (!fits(next)) return;
    const k = Math.abs(n);
    const mult = n > 0;
    setLastMove({ equation: `${toStr(tiles)} ${mult ? '×' : '÷'} ${POW[k]} = ${toStr(next)}`, n: k, mult });
    setTiles(next);
    setPlaceholdersShown(false);
  };

  const submitOwn = () => {
    const t = parseNum(ownValue.trim());
    if (t === null) return setOwnError('Use only digits and one decimal point, like 6.08.');
    if (!t.length) return setOwnError('Zero never moves! Try a number bigger than 0.');
    if (!fits(t)) return setOwnError('That won’t fit. Use numbers between 0.001 and 9,999,999.');
    if (t.length > 6) return setOwnError('Try a number with 6 digits or fewer.');
    setOwnError('');
    load(toStr(t, false), null);
  };

  return (
    <section className={`${tw.panel} mt-5`} aria-labelledby="p10-ex-title">
      <h2 id="p10-ex-title" className={`${tw.display} text-[21px] font-semibold leading-[1.15]`}>
        Place value chart
      </h2>

      <div className="mt-3.5" aria-hidden="true">
        <div className="grid grid-cols-10 text-center text-xs font-extrabold">
          {COLUMNS.map((p) => (
            <div
              key={p}
              className={`border-b-[1.5px] border-[#C9D5EA] py-1 dark:border-[#34405E] ${
                p >= 0 ? 'text-[#1B2440] dark:text-[#E8EDF8]' : 'text-[#56618A] dark:text-[#A3AECB]'
              }`}
            >
              <span className="sm:hidden">{PLACE_SHORT[p]}</span>
              <span className="hidden text-[11px] leading-tight sm:inline">{PLACE_NAMES[p]}</span>
            </div>
          ))}
        </div>
        <div
          className={
            'relative h-[62px] border-b-[1.5px] border-r border-[#C9D5EA] dark:border-[#34405E] bg-[length:10%_100%] ' +
            'bg-[image:linear-gradient(to_right,#C9D5EA_1px,transparent_1px)] ' +
            'dark:bg-[image:linear-gradient(to_right,#34405E_1px,transparent_1px)]'
          }
        >
          <div
            className="absolute bottom-[3px] left-[70%] z-[2] h-[11px] w-[11px] -translate-x-1/2 rounded-full bg-[#C93B33] dark:bg-[#FF8078]"
            title="decimal point"
          />
          {tiles.map((t) => (
            <div key={t.id} className={`${tileBase} ${tileDigit}`} style={{ left: leftPct(t.place) }}>
              {t.d}
            </div>
          ))}
          {placeholders(tiles).map((p) => (
            <div
              key={`ph-${p.place}`}
              className={`${tileBase} ${tilePlaceholder} ${placeholdersShown ? 'opacity-100' : 'opacity-0'}`}
              style={{ left: leftPct(p.place) }}
            >
              0
            </div>
          ))}
        </div>
      </div>
      <p className={tw.key}>The red dot is the decimal point. It stays put. The digits move.</p>

      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2.5">
        <span className={`text-sm ${tw.muted}`}>Number on the chart</span>
        <span className={`${tw.display} text-[32px] font-semibold`}>{toStr(tiles)}</span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {OPS.map((n) => (
          <button
            key={n}
            type="button"
            className={`${opBase} ${n > 0 ? opMul : opDiv}`}
            disabled={!fits(shift(tiles, n))}
            onClick={() => apply(n)}
          >
            {n > 0 ? '×' : '÷'} {POW[Math.abs(n)]}
          </button>
        ))}
      </div>

      <div className={`mt-3 min-h-[3.2em] rounded-xl px-3.5 py-2.5 ${tw.soft}`} aria-live="polite">
        {lastMove ? (
          <>
            <div className={`${tw.display} text-[21px] font-semibold`}>{lastMove.equation}</div>
            <MoveSentence n={lastMove.n} mult={lastMove.mult} />
          </>
        ) : (
          'Pick × or ÷ to see the digits move.'
        )}
      </div>

      <div className={`mt-3.5 flex flex-wrap items-center gap-1.5 text-sm ${tw.muted}`}>
        <span>Start with:</span>
        {PRESETS.map((v) => (
          <button
            key={v}
            type="button"
            className={`${tw.chip} ${activePreset === v ? tw.chipOn : tw.chipOff}`}
            aria-pressed={activePreset === v}
            onClick={() => { setOwnError(''); load(v, v); }}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="mt-2.5 flex gap-2">
        <input
          className={`${tw.input} flex-1`}
          inputMode="decimal"
          autoComplete="off"
          placeholder="Type a number"
          aria-label="Type your own number"
          value={ownValue}
          onChange={(e) => setOwnValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') submitOwn(); }}
        />
        <button type="button" className={`${tw.btn} ${tw.btnQuiet}`} onClick={submitOwn}>
          Put on chart
        </button>
      </div>
      <div className="mt-1 min-h-[1.4em] text-sm text-[#C93B33] dark:text-[#FF8078]" aria-live="polite">
        {ownError}
      </div>
    </section>
  );
}
