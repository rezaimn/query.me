import React from 'react';

export function highlightText(text: string, query: string) {
  let lastIndex = 0;
  const words = query
    .split(/\s+/)
    .filter(word => word.length > 0)
    .map(escapeRegExpChars);
  if (words.length === 0) {
    return [text];
  }
  const regexp = new RegExp(words.join("|"), "gi");
  const tokens: React.ReactNode[] = [];
  while (true) {
    const match = regexp.exec(text);
    if (!match) {
      break;
    }
    const length = match[0].length;
    const before = text.slice(lastIndex, regexp.lastIndex - length);
    const after = text.slice(lastIndex + regexp.lastIndex);
    // we need to add a space before / after the word because of the strong font
    let spaceBefore = "";
    let spaceAfter = "";
    if (before.length > 0) {
      spaceBefore = (before[before.length - 1] == " ") ? "\u00A0" : "";
      tokens.push(before);
    }
    if (after.length > 0) {
      spaceAfter = (after[0] == " ") ? "\u00A0" : "";
    }

    lastIndex = regexp.lastIndex;
    tokens.push(<strong key={lastIndex}>{spaceBefore}{match[0]}{spaceAfter}</strong>);
  }
  const rest = text.slice(lastIndex);
  if (rest.length > 0) {
    tokens.push(rest);
  }
  return tokens;
}
  
export function escapeRegExpChars(text: string) {
  return text.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

export function capitalizeWord(word: string) {
  if (!word) {
    return word;
  }
  word = word.toLowerCase();
  return word.charAt(0).toUpperCase() + word.slice(1);
}
