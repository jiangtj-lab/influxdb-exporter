import yaml from 'js-yaml';
import defaultEnv from './env';
import { ElMessage } from 'element-plus';

export let env = localStorage.getItem('env') || 'example';

if (!localStorage.getItem('options')) {
  localStorage.setItem('options', JSON.stringify(defaultEnv));
}
export const opts = JSON.parse(localStorage.getItem('options'));

export const getOpts = () => {
  return opts[env];
};

export const switchEnv = name => {
  env = name;
  localStorage.setItem('env', env);
};

export const saveOpts = (name, str) => {
  opts[name] = yaml.load(str);
  env = name;
  localStorage.setItem('env', env);
  localStorage.setItem('options', JSON.stringify(opts));
  return opts[env];
};

export const removeOpts = name => {
  const keys = Object.keys(opts);
  if (keys.length === 1) {
    ElMessage.error('请确保至少存在一个服务器配置！');
    return;
  }
  delete opts[name];
  localStorage.setItem('options', JSON.stringify(opts));
  if (env === name) {
    env = Object.keys(opts)[0];
    localStorage.setItem('env', env);
  }
  return opts[env];
};
