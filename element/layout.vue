<template>
  <div class="mmb-container-layout">
    <div class="navigation" :style="`width:${navWidth}px`" v-show="navShow">
      <div class="nav-wrapper" @click.stop="hiddleNav" v-if="wrapper"></div>
      <el-menu
        ref="menu"
        collapse-transition
        default-active="2"
        class="el-menu-nav"
        :collapse="isCollapse"
        @open="handleOpen"
        @close="handleClose"
        @select="handleSelect"
        router
        background-color="#012548"
        text-color="#fff"
        active-text-color="#FFE285"
      >
        <NavItem v-for="child in routers" :key="child.path" :route="child">
        </NavItem>
        <!-- ...... -->
      </el-menu>
    </div>
    <!-- ...... -->
    <div class="container" :style="`margin-left:${containerLeft}px`">
      <div class="header">
        <div class="collapseBut">
          <el-button
            v-if="butShow"
            type="text"
            icon="el-icon-menu"
            @click="navShow = true"
          ></el-button>
          <template v-else>
            <el-button
              v-if="isCollapse"
              type="text"
              icon="el-icon-s-fold"
              @click="spread"
            ></el-button>
            <el-button
              v-else
              type="text"
              icon="el-icon-s-unfold"
              @click="fold"
            ></el-button>
          </template>
        </div>
        <slot name="header" />
      </div>
      <div class="main">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
import NavItem from "./navItem.vue";

export default {
  props: {
    routers: Array,
  },
  components: {
    NavItem,
  },
  data() {
    return {
      navWidth: 0,
      navShow: false,
      containerLeft: 0,
      isCollapse: true,
      wrapper: false,
      butShow: false,
      routers: routers || [
        {
          path: "/aaaa",
          meta: { title: "页面A", icon: "el-icon-setting" },
          children: [
            {
              path: "/aaaa/aaaa1",
              meta: { title: "页面A/aaaa1", icon: "el-icon-location" },
            },
            {
              path: "/aaaa/aaaa2",
              meta: { title: "页面A/aaaa2", icon: "el-icon-setting" },
            },
          ],
        },
        {
          path: "/bbb",
          meta: { title: "页面B", icon: "el-icon-setting" },
          children: [],
        },
      ],
    };
  },
  created() {
    this.setState();
  },
  mounted() {
    this.$refs.menu.mixColor = () => {
      return `#103A63`;
    };
  },
  methods: {
    spread() {
      this.isCollapse = false;
      this.containerLeft = 220;
      this.navWidth = 220;
    },
    fold() {
      this.isCollapse = true;
      this.containerLeft = 64;
      this.navWidth = 64;
    },
    setState() {
      this.sizeSmall();
      this.sizeMiddle();
      this.sizeBig();
    },
    sizeSmall() {
      if (window.innerWidth >= 800) return;
      this.containerLeft = 0;
      this.navWidth = 220;
      this.navShow = false;
      this.isCollapse = false;
      this.wrapper = true;
      this.butShow = true;
    },
    sizeMiddle() {
      if (window.innerWidth < 800) return;
      if (window.innerWidth >= 1200) return;
      this.containerLeft = 64;
      this.navWidth = 64;
      this.navShow = true;
      this.isCollapse = true;
      this.wrapper = false;
      this.butShow = false;
    },
    sizeBig() {
      if (window.innerWidth < 1200) return;
      this.containerLeft = 220;
      this.navWidth = 220;
      this.navShow = true;
      this.isCollapse = false;
      this.wrapper = false;
      this.butShow = false;
    },
    hiddleNav() {
      this.navShow = false;
    },

    /// //////
    handleSelect(index, indexPath, vm) {
      if (vm && this.butShow) this.hiddleNav();
    },

    handleOpen() {},
    handleClose() {},
  },
};
</script>
<style lang="scss">
.mmb-container-layout {
  display: flex;
  position: relative;
  .collapseBut {
    margin-left: 20px;
    i {
      font-size: 30px;
    }
  }
  .navigation {
    transition: 0.3s;
    background: #012548;
    height: 100vh;
    position: fixed;
    z-index: 999999;

    .el-menu-nav {
      transition: 0.3s;
      height: 100vh;
      overflow: auto;
      border-color: transparent;
    }
    .nav-wrapper {
      position: absolute;
      left: 0;
      top: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.5);
    }
  }
  .container {
    transition: 0.3s;
    flex: 1;
    height: 100vh;
    .header {
      height: 60px;
      background: rgb(248, 244, 244);
      display: flex;
      justify-content: space-between;
      align-items: center;
      align-content: center;
    }
    .main {
      height: calc(100vh - 60px);
      // background: linear-gradient(to right, red, yellow);
      overflow: auto;
    }
  }
}
</style>
