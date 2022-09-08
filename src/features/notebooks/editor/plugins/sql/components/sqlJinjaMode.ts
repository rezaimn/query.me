/*
 * Custom mode, a mix between SQL Mode and Jinja
 *
 * @TODO - investigate if this is how it should be done
 */
//
import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-sql';

import { INotebook } from "../../../../../../shared/models";
import { getAllBlocksByType } from "../../../../utils";

const { ace }: any = window;
const SqlMode: any = ace.require('ace/mode/sql').Mode;
const SqlHighlightRules: any = ace.require('ace/mode/sql_highlight_rules').SqlHighlightRules;

const TAGS = {
  '{{': '}}',
  '{%': '%}',
  '{#': '#}',
};

class SqlJinjaHighlightRules extends SqlHighlightRules {
  constructor() {
    super();

    this.addStartRule();

    this.embedRules(SqlHighlightRules, 'jinja-', this.jinjaRules());
    this.normalizeRules();
  }

  addStartRule() {
    const startRule = {
      token: 'entity.other.attribute-name', // @TODO maybe change this
      regex: '(?:{{|{%|{#)(?![#%}])[-=]?\\s*',
      push: 'jinja-start' // go to jinja start
    };

    for (let key in this.$rules) {
      this.$rules[key].unshift(startRule);
    }
  }

  jinjaRules() {
    const endRegex = "\\s*(?:}}|%}|#})";

    return [
      {
        token: "entity.other.attribute-name",
        regex: endRegex,
        next: "pop" // goes back to start rules
      }
    ];
  }
}

export class SqlJinjaMode extends SqlMode {
  $id = 'sql-jinja-mode';

  constructor() {
    super();

    this.addBehaviour();
    this.HighlightRules = SqlJinjaHighlightRules;

    this.createModeDelegates({
      'sql-': SqlHighlightRules
    });
  }

  addBehaviour() {
    const jinjaDoubleBracesInsert = (
      state: any,
      action: any,
      editor: any,
      session: any,
      text: any
    ) => {
      let cursor = editor.getCursorPosition();
      let line = session.doc.getLine(cursor.row);

      const oppositeTag: any = TAGS;

      let leftCharTwo: string = "";
      if (cursor.column >= 2) {
        leftCharTwo = line.substring(cursor.column - 2, cursor.column);

        if (text === ' ' && Object.keys(oppositeTag).includes(leftCharTwo)) {
          /*
            Check if the autocompletion was already done. If so, don't
            autcomplete again
           */
          if (line.length >= cursor.column + 1) {
            const rightCharTwo = line.substring(cursor.column, cursor.column + 2);
            if (rightCharTwo === oppositeTag[leftCharTwo]) {
              return null;
            }
          }
          return {
              text: '  ' + oppositeTag[leftCharTwo], // replace ' ' with text
              selection: [1, 1]
          };
        }
      }
    };

    const jinjaDoubleBracesDelete = (
      state: any,
      action: any,
      editor: any,
      session: any,
      range: any
    ) => {
      // @TODO - to be added
    };

    this.$behaviour.add('jinja_double_braces', 'insertion', jinjaDoubleBracesInsert);

    this.$behaviour.add('jinja_double_braces', 'deletion', jinjaDoubleBracesDelete);
  }
}

export const createJinjaAutocomplete = (notebook: INotebook | null) => {
  /*
   * adds a global autocomplete for each Ace Editor with the available params / sql blocks
   * - this only needs to be added once for one of the Ace Editors (1st one)
   */
  if (!notebook) {
    return;
  }
  const COMPLETER_TYPE = 'blocks_as_params';
  const mapToMetadata = (type: string) => (block: any) => (
    { caption: block.name, value: block.name, meta: type }
  );
  const findCompleter = (c: any) => c.type === COMPLETER_TYPE;

  const filterName = (b: any) => !!b.name; // only count blocks if name is set
  const sqlBlocks= getAllBlocksByType(notebook, 'sql').filter(filterName);
  const paramBlocks = getAllBlocksByType(notebook, 'parameter').filter(filterName);

  if (sqlBlocks.length) {
    const firstBlock = sqlBlocks[0];

    try {
      // feels a bit hacky
      const { ace }: any = window;
      const aceEditor = ace.edit('code_editor_' + firstBlock.content_json.id);

      const completers = aceEditor.completers;
      const found = completers.find(findCompleter);

      const metadata = sqlBlocks
        .map(mapToMetadata('sql_block'))
        .concat(paramBlocks.map(mapToMetadata('param_block')))

      if (found) {
        const { sqlCount, paramsCount } = found;

        if (sqlCount !== sqlBlocks.length || paramsCount !== paramBlocks.length) {
          /*
           * only update completer with new metadata if:
           * - sqlCount or paramsCount changed (new one was added or deleted)
           */
          const foundIndex = completers.findIndex(findCompleter);

          completers[foundIndex].getCompletions = createJinjaCompleter(metadata);
          completers[foundIndex].sqlCount = sqlBlocks.length;
          completers[foundIndex].paramsCount = paramBlocks.length;

        }
        return; // halt execution and prevent adding the same completer twice
      }

      completers.push({
        getCompletions: createJinjaCompleter(metadata),
        type: COMPLETER_TYPE,
        sqlCount: sqlBlocks.length,
        paramsCount: paramBlocks.length
      });
    } catch (e) {
      // ignore
    }
  }
}

export interface ICompleterMetadata {
  caption: string,
  value: string,
  meta: string,
  score?: number,
}

const createJinjaCompleter = (metadata: ICompleterMetadata[]) => {
  return function getCompletions(
    editor: any,
    session: any,
    pos: any,
    prefix: string,
    callback: (error: null, wordList: object[]) => void) {
      if (!Number.isNaN(parseInt(prefix, 10)) || pos.column <= 3) {
        return;
      }
      const line = session.doc.getLine(pos.row);

      const openTags = Object.keys(TAGS);
      const closingTags = Object.values(TAGS);

      /*
       * this regex matches Jinja params like e.g. {{ prefix }}
       * prefix is the string we are searching for
       */
      const regex = `(?:${openTags.join('|')})\\s*${prefix}\\s*(?:${closingTags.join('|')})`;
      if (line.match(regex)) {
        callback(null, metadata);
      }
  }
}
