import dayjs from 'dayjs';

export const default7Day = [dayjs().subtract(6, 'd'), dayjs().subtract(0, 'd')];

export const shortcuts = [{
  text: '昨天',
  value: () => {
    return [dayjs().subtract(1, 'd'), dayjs().subtract(1, 'd')];
  }
}, {
  text: '最近一周',
  value: () => {
    return [dayjs().subtract(6, 'd'), dayjs().subtract(0, 'd')];
  }
}, {
  text: '最近30天',
  value: () => {
    return [dayjs().subtract(29, 'd'), dayjs().subtract(0, 'd')];
  }
}];

export const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59)
];
