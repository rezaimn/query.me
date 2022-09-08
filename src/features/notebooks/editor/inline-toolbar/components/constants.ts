export interface IBlockTypesModel {
  type: string;
  icon?: any;
  text?: string;
  aria?: string;
  labelElementText?: string;
  data_cy?: string;
  onClickText?: string;
}

export const blockTypes: IBlockTypesModel[] = [
  {
    type: 'menu-item',
    icon: 'code',
    text: 'SQL',
    aria: 'SQL',
    labelElementText: '--',
    onClickText: 'sql',
  },
  {
    type: 'menu-item',
    icon: 'code-block',
    text: 'Parameter',
    aria: 'Parameter',
    labelElementText: '???',
    onClickText: 'parameter',
  },
  {
    type: 'menu-item',
    icon: 'timeline-area-chart',
    text: 'Chart',
    aria: 'Chart',
    labelElementText: '&&&',
    onClickText: 'plotly',
  },
  {
    type: 'menu-item',
    icon: 'font',
    text: 'Text',
    aria: 'Text',
    labelElementText: '⏎',
    onClickText: '',
  },
  {
    type: 'menu-item',
    icon: 'header-one',
    text: 'Header 1',
    aria: 'Header 1',
    labelElementText: '#',
    onClickText: 'h1',
  },
  {
    type: 'menu-item',
    icon: 'header-two',
    text: 'Header 2',
    aria: 'Header 2',
    labelElementText: '##',
    onClickText: 'h2',
  },
  {
    type: 'menu-item',
    icon: 'properties',
    text: 'Bulleted List',
    aria: 'Bulleted List',
    data_cy: 'listButton',
    labelElementText: '-',
    onClickText: 'ul',
  },
  {
    type: 'menu-item',
    icon: 'numbered-list',
    text: 'Ordered List',
    aria: 'Ordered List',
    data_cy: 'orderedListButton',
    labelElementText: '1.',
    onClickText: 'ol',
  },
  {
    type: 'menu-item',
    icon: 'form',
    text: 'Todo List',
    aria: 'Todo List',
    data_cy: 'todoButton',
    labelElementText: '[]',
    onClickText: 'action_item',
  },
  {
    text: '',
    type: 'menu-divider',
  },
  {
    type: 'menu-item',
    icon: 'minus',
    text: 'Divider',
    aria: 'Divider',
    labelElementText: '',
    onClickText: 'hr',
  },
  {
    type: 'menu-item',
    icon: 'citation',
    text: 'Blockquote',
    aria: 'Blockquote',
    labelElementText: '>',
    onClickText: 'blockquote',
  },
  {
    type: 'menu-item',
    icon: 'code',
    text: 'Code block',
    aria: 'Code block',
    labelElementText: '```',
    onClickText: 'code_block',
  },
  {
    type: 'spatial-menu-item',
    icon: 'media',
    text: 'Image',
    labelElementText: '',
    onClickText: '',
  },
  {
    type: 'spatial-menu-item',
    icon: 'video',
    text: 'Embedded media',
    labelElementText: '',
    onClickText: '',
  },
];
