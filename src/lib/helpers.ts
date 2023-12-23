export function pluralOrNot(num: number, word: string) {
  return num != 1 ? `${word}s` : word;
}
