<template>
  <el-row>
    <el-button type="primary" @click="showDialog">添加InfluxDB服务器</el-button>
  </el-row>

  <el-row style="margin-top: 10px;">
    <el-card class="setting-card" v-for="item in arrs" :key="item.key" @click="switchEnv(item.key)">
      <template #header>
        <div class="card-header">
          <el-radio v-model="radio" :label="item.key">{{ item.key }}</el-radio>
          <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="removeOpts($event, item.key)" />
        </div>
      </template>
      <el-descriptions :column="1">
        <el-descriptions-item label="url">{{ item.val.url }}</el-descriptions-item>
        <el-descriptions-item label="org">{{ item.val.org }}</el-descriptions-item>
        <el-descriptions-item label="bucket">{{ item.val.bucket }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </el-row>

  <el-dialog title="InfluxDB服务器" v-model="dialog.isShow">
    <el-form :model="dialog.form">
      <el-form-item label="名称">
        <el-input v-model="dialog.form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="参数">
        <el-input type="textarea" :rows="5" v-model="dialog.form.str" />
      </el-form-item>
    </el-form>
    <div>
      <span>参数例子</span>
      <pre><code>url: http://localhost:8086
token: token
org: org
bucket: bucket</code></pre>
    </div>
    <div>
      数据均保存在客户端，请放心食用
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialog.isShow = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import {env, opts, switchEnv, saveOpts, removeOpts} from '../influx/opts';
import yaml from 'js-yaml';
import { ElMessage } from 'element-plus';

export default {
  name: '设置',
  data() {
    return {
      arrs: [],
      radio: '',
      opts,
      dialog: {
        form: {},
        isShow: false
      }
    };
  },
  created() {
    this.updateArr();
  },
  methods: {
    switchEnv(name) {
      switchEnv(name);
      this.updateArr();
    },
    removeOpts($event, name) {
      removeOpts(name);
      $event.stopPropagation();
      this.updateArr();
    },
    updateArr() {
      this.arrs = Object.keys(opts).map(key => {
        const val = opts[key];
        return {
          key, val
        };
      });
      this.radio = env;
    },
    showDialog() {
      this.dialog.isShow = true;
      this.dialog.form = {};
    },
    add() {
      let flag = false;
      if (!this.dialog.form.name) {
        ElMessage.error('请输入配置名称！');
        flag = true;
      }
      const config = yaml.load(this.dialog.form.str);
      ['url', 'token', 'org', 'bucket'].forEach(key => {
        if (!config[key]) {
          ElMessage.error(`参数 ${key} 不存在！`);
          flag = true;
        }
      });
      if (flag) {
        return;
      }
      this.dialog.isShow = false;
      saveOpts(this.dialog.form.name, this.dialog.form.str);
      this.updateArr();
    }
  }
};
</script>

<style lang="scss">
.setting-card {
  margin-right: 10px;
  cursor: pointer;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
