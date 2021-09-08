<template>
  <div id="app">
    <el-container class="app-container">
      <el-aside width="auto">
        <el-menu
          class="main-menu-aside"
          :default-active="$route.name"
          :collapse="isCollapse"
          unique-opened
          router
          @select="handleSelect">
          <template v-for="menu in menus" :key="menu.index">
            <el-menu-item :index="menu.index" :route="{ name: menu.index }">
              <el-icon><component :is="menu.icon" /></el-icon>
              <template #title>{{ menu.name }}</template>
            </el-menu-item>
          </template>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { Edit } from '@element-plus/icons';
import { menus } from './router';
const isProd = process.env.NODE_ENV === 'production';


export default {
  name: 'App',
  components: {
    Edit
  },
  data() {
    return {
      isCollapse: true,
      menus,
      isProd
    };
  },
  methods: {
    switchCollapse() {
      this.isCollapse = !this.isCollapse;
    }
  }
};
</script>

<style lang='scss'>
.app-container {
  overflow: hidden;
  height: 100%;
}

.main-menu-aside {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

.main-menu-aside:not(.el-menu--collapse) {
  width: 200px;
}

.el-aside {
  background-color: #fff;
  color: #333;
}

</style>
