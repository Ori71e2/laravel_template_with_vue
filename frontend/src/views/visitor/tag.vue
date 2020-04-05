<template>
  <el-dialog title="标签列表" :visible.sync="isTag" width="70%" model-append-to-body class="dialog-custom">
    <div class="main">
      <div class="tag-selected">Tag Selected</div>
      <div class="tag-search">
        <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
          <el-button slot="prepend" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <div class="tag-store">Tag Store</div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isTag = false">取 消</el-button>
      <el-button type="primary" @click="isTag = false">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getUrlTag } from '@/api/url'
export default {
  data() {
    return {
      search: ''
    }
  },
  computed: {
    urlTag: {
      get() {
        return JSON.parse(JSON.stringify(this.$store.state.url.tag))
      },
      set(val) {
        this.$store.dispatch('url/setTag', val)
      }
    },
    isTag: {
      get() {
        return this.$store.state.url.tagPopover
      },
      set(val) {
        this.$store.dispatch('url/setTagPopover', val)
      }
    }
  },
  created() {
    getUrlTag().then(response => {
      this.urlTag = JSON.parse(response.data)
      this.$store.dispatch('url/setTag', this.urlTag)
    })
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    }
  }
}
</script>
<style lang="scss" scoped>
$searchHeight: 50px;
.dialog-custom {
  height: 90%;
}
.main {
  width: 99%!important;
  height: calc(70% - 50px);
  height: 500px;
  margin-bottom: 20px!important;
  margin-left: 10px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
}
.tag-selected {
  width: 100%;
  height: 20%;
  border: solid 1px red;
  overflow: auto;
}
.tag-search {
  width: 100%;
  height: $searchHeight;
  border: solid 1px red;
}
.tag-store {
  width: 100%;
  height: calc(80% - #{$searchHeight});
  border: solid 1px red;
  overflow: auto;
}
</style>
