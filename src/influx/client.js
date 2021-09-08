import {InfluxDB} from '@influxdata/influxdb-client';

// You can generate a Token from the "Tokens Tab" in the UI
import {getOpts} from './opts';

const {url, token, org, bucket} = getOpts();

export const client = new InfluxDB({url, token});

export const postData = point => {
  const writeApi = client.getWriteApi(org, bucket);
  writeApi.useDefaultTags({env: 'test-env'});
  writeApi.writePoint(point);
  writeApi
    .close()
    .then(() => {
      console.log('FINISHED');
    })
    .catch(e => {
      console.error(e);
      console.log('\\nFinished ERROR');
    });
};

export const queryApi = client.getQueryApi(org);
