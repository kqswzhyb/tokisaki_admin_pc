<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <img v-if="!avatar" src="@/assets/images/default_user.jpg" class="user-avatar" @click="$store.commit('app/openDrawer',true)">
      <img v-else :src="avatar" class="user-avatar">
    </div>
    <el-drawer
      :visible.sync="$store.state.app.drawer"
      direction="rtl"
      size="15%"
    >
      <div class="avatar-bg flex-start">
        <img v-if="!avatar" src="@/assets/images/default_user.jpg" class="drawer-avatar">
        <img v-else :src="avatar" class="drawer-avatar">
        <span class="name">{{ username|| '未登录' }}</span>
      </div>
      <ul class="right-drawer">
        <li v-for="item in configs" :key="item.path" class="drawer-cell" @click="$router.push(item.path);$store.commit('app/openDrawer',false)"><svg-icon :icon-class="item.icon" :style="{color:$route.path===item.path?'rgb(64, 158, 255)':'#000'}" /> <span :style="{marginLeft:'20px',color:$route.path===item.path?'rgb(64, 158, 255)':'#000'}">{{ item.text }}</span></li>
        <li class="drawer-cell" @click="logout"><svg-icon icon-class="logout" /> <span style="margin-left:20px;">退出登录</span></li>
      </ul>
    </el-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import SvgIcon from '../../components/SvgIcon/index'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    SvgIcon
  },
  data() {
    return {
      configs: [
        {
          path: '/user/messages',
          icon: 'message',
          text: '我的消息'
        },
        {
          path: '/tasks?active=true',
          icon: 'task',
          text: '我的任务'
        },
        {
          path: '/user/scores',
          icon: 'star',
          text: '积分明细'
        },
        {
          path: '/user/personal',
          icon: 'personalcenter',
          text: '个人中心'
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'info'
    ]),
    username() {
      return this.$store.state.user.info.username
    },
    avatar() {
      return this.$store.state.user.info.avatar
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$store.commit('app/openDrawer', false)
      this.$router.push(`/login?redirect=dashboard`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    margin:5px 20px 0 0;
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
.user-avatar {
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 10px;
}
.right-drawer {
  margin:0;
  padding:0;
  list-style: none;
  .drawer-cell {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
    padding: 20px;
    cursor: pointer;
    border-bottom:1px solid #ccc;
  }
}
.avatar-bg {
  padding:20px 10px;
  .drawer-avatar {
    margin-right:15px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
  .name {
    font-size:18px;
    font-weight: 500;
    color:#e66457;
  }
}

</style>
