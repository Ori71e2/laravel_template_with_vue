
<template>
  <div>
    <el-container style="height: 100%; border: 1px solid #eee">
      <el-header>
        <div>
          <el-dropdown>
            <i class="el-icon-setting" style="margin-right: 10px" />
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>查看</el-dropdown-item>
              <el-dropdown-item>新增</el-dropdown-item>
              <el-dropdown-item>删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div style="width: 40px; margin: 0px 10px"><span>王小虎</span></div>
        </div>
        <div class="transiton" />
      </el-header>
      <el-container>
        <el-aside width="200px" />
        <el-main>
          <url />
        </el-main>
      </el-container>
    </el-container>
    <pagenav class="pagenav" />
    <operate class="operate" />
  </div>
</template>>

<script>
import { getUrlPageList } from '@/api/url'
import axios from 'axios'
import url from './url'
import pagenav from './pagenav'
import operate from './operate'
import { mapGetters } from 'vuex'
export default {
  components: {
    url, pagenav, operate
  },
  data() {
    const item = {
      date: '2016-05-02',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1518 弄'
    }
    return {
      tableData: Array(20).fill(item),
      urlPageList: [],
      edit: false,
      position: 0
    }
  },
  computed: {
    ...mapGetters([
      'urlList'
    ]),
  },
  created() {
    getUrlPageList().then(response => {
      this.urlPageList = JSON.parse(response.data)
      this.$store.dispatch('url/setList', this.urlPageList)
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
    div:first-child {
      height: $headerHeight - 20px;
      width: 100%;
      background-color: #B3C0D1;
      color: #333;
      line-height: $headerHeight - 20px;
      text-align: right;
      font-size: 12px;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: flex-end;
      align-items: center;
    }
    .transiton {
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
  .pagenav {
    position: fixed;
    top: $headerHeight;
    left: 20px;
    width: 200px;
    height: calc(100vh - #{$headerHeight} - 20px);
    border: solid 1px red;
    z-index: 100;
  }
  .operate {
    position: fixed;
    // top: calc((100vh - #{$headerHeight})/2);
    bottom: 400px;
    right: 25px;
    margin-right: 10px;
    width: 20px;
    height: 100px;
    z-index: 100;
  }
</style>
