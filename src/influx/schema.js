import {queryApi} from './client';
import {getOpts} from './opts';

export const measurements = () => {
  const {bucket} = getOpts();
  return queryApi
    .collectRows(`
import "influxdata/influxdb/schema"
schema.measurements(bucket: "${bucket}")
    `)
    .then(data => {
      return data.map(item => item._value);
    });
};

export const fields = meas => {
  const {bucket} = getOpts();
  return queryApi
    .collectRows(`
import "influxdata/influxdb/schema"
schema.measurementFieldKeys(
  bucket: "${bucket}",
  measurement: "${meas}",
  start: -30d
)
    `)
    .then(data => {
      return data.map(item => item._value);
    });
};

export const tags = meas => {
  const {bucket} = getOpts();
  return queryApi
    .collectRows(`
import "influxdata/influxdb/schema"
schema.measurementTagKeys(
  bucket: "${bucket}",
  measurement: "${meas}"
)
    `)
    .then(data => {
      return data.map(item => item._value);
    });
};
