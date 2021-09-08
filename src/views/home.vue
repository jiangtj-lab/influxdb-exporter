<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-row>
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>表</span>
            </div>
          </template>
          <el-form :inline="true">
            <el-form-item label="measurement">
              <el-select v-model="measurement" placeholder="请选择">
                <el-option v-for="item in measurements" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="日期">
              <el-date-picker
                v-model="selectDaterange"
                type="daterange"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :shortcuts="shortcuts"
              />
            </el-form-item>
          </el-form>
        </el-card>
      </el-row>
      <el-row>
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>过滤条件</span>
            </div>
          </template>
          <el-form :inline="true" v-for="(item, index) in filters" :key="item">
            <el-form-item label="tag">
              <el-select v-model="item.tag" placeholder="请选择" clearable @change="changeFilterTag(item, index)">
                <el-option v-for="t in tagsForSelect" :key="t" :label="t" :value="t" />
              </el-select>
            </el-form-item>
            <el-form-item label="val">
              <el-input v-model="item.val" placeholder="请输入内容" />
            </el-form-item>
          </el-form>
        </el-card>
      </el-row>
      <el-row>
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>查询内容</span>
            </div>
          </template>
          <el-checkbox-group v-model="queryFieldsClick">
            <el-checkbox v-for="f in queryFields" :key="f" :label="f" />
          </el-checkbox-group>
        </el-card>
      </el-row>
    </el-col>
    <el-col :span="12">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>Flux 预览</span>
            <el-button-group>
              <el-button type="primary" icon="el-icon-search" @click="queryData()">前100条</el-button>
              <el-button type="primary" @click="exportCSV()">导出</el-button>
            </el-button-group>
          </div>
        </template>
        <pre><code>{{ flux }}</code></pre>
      </el-card>
    </el-col>
  </el-row>
  <el-row>
    <el-card class="box-card">
      <el-table class="main-table-center" :data="tableData" border stripe>
        <el-table-column v-for="f in queryFieldsClick" :key="f" :label="f" :prop="f" min-width="100px" />
      </el-table>
    </el-card>
  </el-row>
</template>

<script>
import * as schema from '../influx/schema';
import {queryApi} from '../influx/client';
import {getOpts} from '../influx/opts';
import {default7Day, shortcuts} from '../utils/datetime';
import dayjs from 'dayjs';
import excel from '../utils/excel';

export default {
  name: 'HomePage',
  data() {
    return {
      measurements: [],
      tags: [],
      fields: [],
      filters: [{tag: null, val: null}],
      checkFields: [],
      measurement: null,
      selectDaterange: default7Day,
      shortcuts: shortcuts,
      tableData: [],
      queryFields: [],
      queryFieldsClick: []
    };
  },
  computed: {
    tagsForSelect() {
      if (this.tags.length === 0) {
        return [];
      }
      return this.tags.filter(item => !['_start', '_stop', '_measurement'].includes(item));
    },
    flux() {
      if (!this.measurement) {
        return '';
      }
      let flux = `from(bucket:"${getOpts().bucket}")`;

      const t1 = dayjs(this.selectDaterange[0]).format('YYYY-MM-DD');
      const t2 = dayjs(this.selectDaterange[1]).add(1, 'day').format('YYYY-MM-DD');
      flux += `\n  |> range(start: time(v: "${t1}"), stop: time(v: "${t2}"))`;

      flux += `\n  |> filter(fn:(r) => r._measurement == "${this.measurement}")`;

      for (const f of this.filters) {
        if (f.tag && f.val) {
          flux += `\n  |> filter(fn:(r) => r.${f.tag} == "${f.val}")`;
        }
      }

      const keys = this.tags.filter(item => !['_start', '_stop', '_field'].includes(item));
      keys.unshift('_time');
      flux += `\n  |> pivot(rowKey:[${keys.map(item => `"${item}"`).join(',')}], columnKey: ["_field"], valueColumn: "_value")`;

      flux += `\n  |> keep(columns: [${this.queryFieldsClick.map(item => `"${item}"`).join(',')}])`;
      return flux;
    }
  },
  watch: {
    measurement: function(val) {
      if (!val) {
        this.tags = [];
        this.fields = [];
        return;
      }
      schema.tags(val).then(data => {
        this.tags = data;
        return schema.fields(val);
      }).then(data => {
        this.fields = data;
        this.queryFields = ['_time'].concat(this.tags.filter(item => !['_start', '_stop', '_field'].includes(item))).concat(this.fields);
        this.queryFieldsClick = [...this.queryFields];
      });
    }
  },
  mounted() {
    schema.measurements().then(data => {
      this.measurements = data;
    });
  },
  methods: {
    queryData() {
      if (!this.measurement) {
        return;
      }
      const queryL = this.flux + '\n  |> limit(n:100)\n  |> group()';
      queryApi.collectRows(queryL).then(data => {
        console.log(data);
        this.tableData = data;
      });
    },
    changeFilterTag(item, index) {
      if (!item.tag) {
        if (index + 1 === this.filters.length) {
          return;
        }
        this.filters.splice(index, 1);
        return;
      }
      if (index + 1 === this.filters.length) {
        this.filters.push({tag: null, val: null});
      }
    },
    exportCSV() {
      if (!this.measurement) {
        return;
      }
      const queryL = this.flux + '\n  |> group()';
      const column = {};
      this.queryFieldsClick.forEach(item => {
        column[item] = item;
      });
      queryApi.collectRows(queryL).then(data => {
        excel(data, 'InfluxDB数据' + new Date().getTime(), column);
      });
    }
  }
};
</script>

<style lang="scss">
.box-card {
  width: 100%;
  margin-bottom: 5px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
