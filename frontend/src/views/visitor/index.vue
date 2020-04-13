
<template>
  <div>
    <el-container style="height: 100%; border: 1px solid #eee">
      <el-header>
        <navbar class="navbar"/>
        <div class="transition" />
      </el-header>
      <el-container>
        <el-aside width="220px" />
        <el-main>
          <url />
        </el-main>
      </el-container>
    </el-container>
    <div class="pagenavContainer"><pagenav class="pagenav" /></div>
    <operate class="operate" />
  </div>
</template>>

<script>
import { getUrlPageList } from '@/api/url'
import { getUrlTag } from '@/api/url'
import axios from 'axios'
import url from './url'
import pagenav from './pagenav'
import operate from './operate'
import navbar from './navbar'
import { mapGetters } from 'vuex'
export default {
  components: {
    url, pagenav, operate, navbar
  },
  data() {
    const item = {
      date: '2016-05-02',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1518 弄'
    }
    return {
      tableData: Array(20).fill(item),
      edit: false,
      position: 0,
      loading: true
    }
  },
  computed: {
    ...mapGetters([
      'urlList'
    ]),
  },
  created() {
    this.$store.dispatch('url/getList').then(() => {
      this.loading = false
    }).catch((error) => {
      // const result = error.response.code
      this.$message.error('获取网址信息失败')
    })
    this.$store.dispatch('url/getTag').then(() => {
      this.loading = false
    }).catch((error) => {
      // const result = error.response.code
      this.$message.error('获取网址信息失败')
    })
  }
}
</script>

<style lang="scss" scoped>
$headerHeight: 80px;
  .el-header {
    position:fixed;
    top: 0;
    width: 100%;
    height: $headerHeight !important;
    padding: 0;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-end;
    align-items: center;
    z-index: 100;
    .navbar {
      height: $headerHeight - 20px;
      width: 100%;
      background-color: white;
      border-bottom: 1px solid #d8dce5;
      box-shadow: 0 1px 4px rgba(0,21,41,.08);
      color: #333;
      line-height: $headerHeight - 20px;
    }
    .transition {
      width: 100%;
      height: 20px;
      background-image: linear-gradient(to top, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1))
    }
  }
  .el-main {
    margin-top: $headerHeight;
    background-color: #F5F6F8;
    z-index: 99;
  }
  .el-aside {
    color: #333;
    background-color: #F5F6F8;
    z-index: 99;
  }
  .pagenavContainer {
    position: fixed;
    top: $headerHeight;
    padding-right: 10px;
    left: 40px;
    padding: 20px 20px 10px 0px;
    width: 200px;
    height: calc(100vh - #{$headerHeight} - 20px);
    border-right: 1px solid #d8dce5;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
    z-index: 100;
    .pagenav {
      width: 180px;
      height: calc(100vh - #{$headerHeight} - 20px - 40px);
      overflow: hidden;
      padding-right: 4px;
      &:hover {
        overflow: auto;
      }
      &::-webkit-scrollbar-track
      {
        box-shadow: inset 0 0 1px rgba(0,0,0,0.3);
        border-radius: 10px;
        background-color: #F5F5F5;
      }
      &::-webkit-scrollbar
      {
        width: 8px;
        background-color: #F5F5F5;
      }
      &::-webkit-scrollbar-thumb
      {
        border-radius: 2px;
        // box-shadow: inset 0 0 1px rgba(0,0,0,.3);
        background-color: rgba(96,98,102,0.3);
        &:hover {
          background-color: rgba(96,98,102,0.5);
        }
        &:active {
          background-color: rgba(96,98,102,0.8);
        }
      }
    }
  }
  .operate {
    position: fixed;
    // top: calc((100vh - #{$headerHeight})/2);
    bottom: 200px;
    right: 25px;
    margin-right: 10px;
    width: 20px;
    height: 250px;
    z-index: 100;
  }
</style>
