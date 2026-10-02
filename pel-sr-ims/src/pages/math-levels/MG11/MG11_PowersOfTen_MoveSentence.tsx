import { POW, plural } from './MG11_PowersOfTen_numberModel';

export const Pow = ({ n }: { n: number }) => (
  <>10<sup>{n}</sup></>
);

/** "× 100, so every digit slides 2 places to the left. The answer is 100 times as large." */
export function MoveSentence({ n, mult, useExp = false }: { n: number; mult: boolean; useExp?: boolean }) {
  return (
    <>
      {mult ? '×' : '÷'} {useExp ? <><Pow n={n} /> = {POW[n]}</> : POW[n]}, so every digit slides{' '}
      <b>{n} {plural(n)} to the {mult ? 'left' : 'right'}</b>. The answer is{' '}
      {mult ? `${POW[n]} times as large` : `1/${POW[n]} as large`}.
    </>
  );
}
