<template>
  <div class="navbar">
    <div class="right-menu">
      <!-- <search id="header-search" class="right-menu-item" /> -->
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <div  class="user-avatar"><img :src="'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'+'?imageView2/1/w/80/h/80'"></div>
          <div><i class="el-icon-caret-bottom" /></div>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/visitor/login">
            <el-dropdown-item>登录</el-dropdown-item>
          </router-link>
          <router-link to="/visitor/register">
            <el-dropdown-item>注册</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">注销</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="post">Post</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog :visible="dialogVisible" width="30%" :append-to-body="true" :show-close="false">
      <router-view />
      <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Search from '@/components/HeaderSearch'

export default {
  // components: {
  //   Search
  // },
  data() {
    return {
      // dialogVisible: false
    }
  },
  computed: {
    dialogVisible: {
      get() {
        // return true
        return this.$store.state.user.dialogVisible
      },
      set(val) {
        this.$store.dispatch('user/setDialogVisible', val)
      }
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    handleClose() {
      this.dialogVisible = false
      this.$router.go(-1)
    },
    post() {
      this.$store.dispatch('user/getInfo')
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 100%;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .right-menu {
    float: right;
    height: 100%;
    line-height: 100%;

    .avatar-container {
      margin-right: 30px;
      .avatar-wrapper {
        margin-top: 5px;
        width: 80px;
        height: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: center;
        .user-avatar {
          cursor: pointer;
          img {
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          margin-top: 25px;
          margin-left: 5px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
