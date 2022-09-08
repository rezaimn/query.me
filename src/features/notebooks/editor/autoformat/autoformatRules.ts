import {
  autoformatArrow,
  autoformatLegal,
  autoformatLegalHtml,
  autoformatMath,
  // autoformatPunctuation,
  autoformatSmartQuotes,
} from '@udecode/plate';
import { autoformatBlocks } from './autoformatBlocks';
import { autoformatLists } from './autoformatLists';
import { autoformatMarks } from './autoformatMarks';
  
export const autoformatRules = [
  ...autoformatBlocks,
  ...autoformatLists,
  ...autoformatMarks,
  ...autoformatSmartQuotes,
  // Removed since it autoformats -- to —
  // ...autoformatPunctuation,
  ...autoformatLegal,
  ...autoformatLegalHtml,
  ...autoformatArrow,
  ...autoformatMath,
];
