export interface IItemListLine {
  _id: string;
  label: string;
  group: string;
  logo?: string;
  typeIcon: string;
  typeColor: string;
}

export interface IItemListGroupedLines {
  [key: string]: Array<IItemListLine>;
}

export function sortByGroupLabel(l1: IItemListLine, l2: IItemListLine): number {
  const result = l1.group && l1.group.localeCompare(l2.group);
  if (result === 0) {
    return (l1.label && l1.label.localeCompare(l2.label)) || 0;
  }
  return result || 0;
}

export function filterLines(lines: Array<IItemListLine>, q?: string): Array<IItemListLine> {
  const searchFilter = !!q && new RegExp(q);
  return lines.filter(line => !searchFilter || searchFilter.test(line.label) || searchFilter.test(line.group));
}

export function groupLineByGroup(lines: Array<IItemListLine>): IItemListGroupedLines {
  return lines.sort(sortByGroupLabel).reduce(
    (acc: IItemListGroupedLines, line: IItemListLine) =>
      Object.assign(acc, {
        [line.group]: (acc[line.group] || []).concat(line),
      }),
    {},
  );
}
