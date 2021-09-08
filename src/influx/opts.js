import yaml from 'js-yaml';
import defaultEnv from './env';

export let env = localStorage.getItem('env') || 'example';

export const opts = JSON.parse(localStorage.getItem('options') || '{}');

export const getOpts = () => {
  return opts[env] || defaultEnv;
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
  delete opts[name];
  localStorage.setItem('options', JSON.stringify(opts));
  if (env === name) {
    const keys = Object.keys(opts);
    if (keys.length > 0) {
      env = keys[0];
      localStorage.setItem('env', env);
    }
  }
  return opts[env];
};
