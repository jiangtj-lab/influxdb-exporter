import XLSX from 'xlsx';
import {pick} from 'lodash';

export default function(list, name, column, type = 'xlsx') {
  const renders = [];

  const header = Object.keys(column);
  const title = {};
  header.forEach(key => {
    const val = column[key];
    if (typeof val === 'string') {
      title[key] = val;
    } else {
      title[key] = val.name;
      renders.push({
        key,
        render: val.render
      });
    }
  });

  const jsond = list
    .map(item => pick(item, header))
    .map(item => {
      renders.forEach(({key, render}) => {
        item[key] = render(item[key], item, key);
      });
      return item;
    });

  const wb = XLSX.utils.book_new();
  const ws_name = 'SheetJS';
  jsond.unshift(title);
  const ws = XLSX.utils.json_to_sheet(jsond, {header, skipHeader: true});
  XLSX.utils.book_append_sheet(wb, ws, ws_name);
  return XLSX.writeFile(wb, `${name}.${type}`);
}
