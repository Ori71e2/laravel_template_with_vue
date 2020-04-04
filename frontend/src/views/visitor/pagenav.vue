
<template>
  <div class="url-page-nav">
    <draggable v-model="urlList" v-bind="dragOptions" :move="onMove" element="div" @start="dragStart" @end="dragEnd">
      <transition v-for="(page, pageIndex) in urlList" :key="pageIndex" name="fade">
        <div class="url-page-title">
          <a v-if="!edit">
            <span @click="handleScroll(pageIndex)">{{ page.title }}</span>
          </a>
          <a v-else>
            <span @click="handleScroll(pageIndex)" @dblclick="handleEdit(pageIndex)">{{ page.title }}</span>
          </a>
        </div>
      </transition>
    </draggable>
    <el-dialog title="修改" :visible.sync="dialogVisible" width="30%" :before-close="handleClose" :append-to-body="true" style="z-index: 199!important">
      <span>这是一段信息</span>
      <el-input v-model="item.title" placeholder="请输入内容">
        <template slot="prepend">Title</template>
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>>

<script>
import draggable from 'vuedraggable'
export default {
  components: {
    draggable
  },
  props: {
    'list': {
      type: Array,
      default: function() { return [] }
    },
    'drag': {
      type: Object,
      default: function() { return {} }
    },
    'edit': {
      type: Boolean,
      default: false
    },
    'position': {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      item: {
        pageIndex: -1,
        title: ''
      },
      dialogVisible: false
    }
  },
  computed: {
    urlList: {
      get() {
        return JSON.parse(JSON.stringify(this.list))
      },
      set(val) {
        this.$emit('update:list', JSON.parse(JSON.stringify(val)))
      }
    },
    pageIndex: {
      get() {
        return this.position
      },
      set(val) {
        this.$emit('update:position', val)
      }
    },
    divDrag: {
      get() {
        return this.drag
      },
      set(val) {
        this.$emit('update:drag', val)
      }
    },
    dragOptions() {
      return {
        animation: 0,
        group: 'description',
        // disabled: true,
        disabled: !this.divDrag.page,
        ghostClass: 'ghost'
      }
    }
  },
  watch: {
  },
  created() {
  },
  mounted() {
  },
  destroyed() {
  },
  methods: {
    onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element
      const draggedElement = draggedContext.element
      return (
        (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      )
    },
    dragStart() {
      Object.keys(this.divDrag).forEach((key) => {
        if (key !== 'page') {
          this.divDrag[key] = false
        }
      })
    },
    dragEnd() {
      Object.keys(this.divDrag).forEach((key) => {
        this.divDrag[key] = true
      })
      this.updateList()
    },
    handleScroll(pageIndex) {
      this.pageIndex = pageIndex
    },
    handleEdit(pageIndex) {
      this.item.pageIndex = pageIndex
      this.dialogVisible = true
    },
    handleClose() {
      this.dialogVisible = false
    },
    handleConfirm() {
      const title = this.item.title
      const pageIndex = this.item.pageIndex
      const page = this.urlList[pageIndex].slice()
      page.title = title
      this.urlList.splice(pageIndex, 1, page)
      this.dialogVisible = false
    },
    updateList() {
      this.urlList = JSON.parse(JSON.stringify(this.list))
    }
  }
}
</script>

<style lang="scss" scoped>
.url-page-nav {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  margin: 0px auto;
  height: 100%;
  overflow: auto;
}
.url-page-title {
  border: solid 1px red;
  box-sizing: content-box;
  border-radius: 2px;
  margin: 3px 1px;
  background-color: #ffffff;
  width: calc(100% - 3px);
  height: 45px;
  // 字体设置
  text-decoration: none;
  line-height: 45px;
  font-size: 14px;
  text-align: center;
  font-family: 'Microsoft Yahei', sans-serif;
  color: #474a4d;
  // div内文字不溢出，溢出部分用...代替
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  z-index: 10;
  &:hover {
    font-size: 110%;
    color: #ffffff;
    background-color: #474a4d;
  }
}
</style>
