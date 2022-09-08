export function updateElementInList(list: any[], element: any, idField = 'id') {
  return list.map(c => {
    return (c[idField] === element[idField]) ? { ...c, ...element } : c;
  }).slice();
}
  
export function updateElementsInList(list: any[], elements: any[], idField = 'id') {
  return list.map(c => {
    const element = elements.find(e => (c[idField] === e[idField]));
    return (element) ? { ...c, ...element } : c;
  }).slice();
}
  
export function removeElementFromList(list: any[], element: any, idField = 'id') {
  const index = list.findIndex(e => (e[idField] === element[idField]));
  list.splice(index, 1);
  return list.slice();
}
