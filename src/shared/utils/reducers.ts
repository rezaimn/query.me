import { ISort } from '../models';

export function updateElementInList(list: any[], element: any, idField = 'id') {
  return list.map(c => {
    return (c[idField] === element[idField]) ? Object.assign({}, c, element) : c;
  }).slice();
}

export function updateElementsInList(list: any[], elements: any[], idField = 'id') {
  return list.map(c => {
    const element = elements.find(e => (c[idField] === e[idField]));
    return (element) ? Object.assign({}, c, element) : c;
  }).slice();
}
  
export function removeElementFromList(list: any[], element: any, idField = 'id') {
  const index = list.findIndex(c => (c[idField] === element[idField]));

  if (index >= 0) {
    list.splice(index, 1);
  }
  return list.slice();
}

export function sortElementsInList(list: any[], sort: ISort) {
  return list.sort((e1, e2) => {
    return (sort.direction === 'asc') ?
      e1[sort.name].localeCompare(e2[sort.name]) :
      e2[sort.name].localeCompare(e1[sort.name]);
  });
}
