
<template>
  <div class="operate">
    <div v-if="visible" class="content box animated fadeInUp">
      <el-tooltip :disabled="disabled" class="item" effect="dark" content="标签管理" placement="left">
        <i @click="setTag" :class="[isTag ? activeClass : inactiveClass]" class="el-icon-paperclip" />
      </el-tooltip>
      <el-tooltip :disabled="disabled" class="item" effect="dark" content="编辑" placement="left">
        <i @click="setEdit" :class="[isEdit ? activeClass : inactiveClass]" class="el-icon-edit" />
      </el-tooltip>
      <el-tooltip :disabled="disabled" class="item" effect="dark" content="拖拽" placement="left">
        <i @click="setDrag" :class="[isDrag ? activeClass : inactiveClass]" class="el-icon-rank" />
      </el-tooltip>
      <el-tooltip :disabled="disabled" class="item" effect="dark" content="回收站" placement="left">
        <i :class="[isRecycleBinEmpty ? inactiveClass : activeClass]" class="el-icon-delete" />
      </el-tooltip>
      <el-tooltip :disabled="disabled" class="item" effect="dark" content="后退" placement="left">
        <i @click="back" :class="[isBack ? activeClass : inactiveClass]" class="el-icon-arrow-left" />
      </el-tooltip>
      <el-tooltip :disabled="disabled" class="item" effect="dark" content="前进" placement="left">
        <i @click="forward" :class="[isForward ? activeClass : inactiveClass]" class="el-icon-arrow-right" />
      </el-tooltip>
      <el-tooltip :disabled="disabled" class="item" effect="dark" content="保存" placement="left">
        <i :class="[isUpdate ? activeClass : inactiveClass]" class="el-icon-circle-check" @click="save()" />
      </el-tooltip>
    </div>
    <div v-else class="content" />
    <div slot="reference" class="button" @click="popOver"><i class="el-icon-caret-top caret" /></div>
  </div>
</template>>

<script>
import draggable from 'vuedraggable'
export default {
  components: {
    draggable
  },
  data() {
    return {
      visible: false,
      recycleBin: [],
      history: [],
      activeClass: 'active',
      inactiveClass: 'inactive',
      isDrag: false,
      oldUrlList: [],
      timer: null,
      disabled: true,
      isTag: false
    }
  },
  computed: {
    urlList: {
      get() {
        return this.$store.getters.urlList
      },
      set(val) {
        this.$store.dispatch('url/setList', val)
      }
    },
    historyList: {
      get() {
        return this.$store.state.url.history.length
      }
    },
    drag: {
      get() {
        return this.$store.state.url.drag
      },
      set(val) {
        this.$store.dispatch('url/setDrag', val)
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
    isEdit: {
      get() {
        return this.$store.state.url.edit
      },
      set(val) {
        this.$store.dispatch('url/setEdit', val)
      }
    },
    isBack() {
      return this.$store.state.url.index <= 0 ? false : true
    },
    isForward() {
      return this.$store.state.url.index >= this.$store.state.url.history.length-1 ? false : true
    },
    isUpdate() {
      const oldString = JSON.stringify(this.oldUrlList)
      const newString = JSON.stringify(this.urlList)
      const oldLen = oldString.length
      const newLen = newString.length
      if (this.oldUrlList.length != 0) {
        if (oldLen != newLen) {
          return true
        } else {
          return oldString != newString
        }
      } else {
        return false
      }
    },
    isRecycleBinEmpty() {
      return this.recycleBin.length == 0
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
    popOver() {
      this.visible = !this.visible
      // 500时间要与动画一致
      if (this.visible) {
        this.timer = setTimeout(() => { this.disabled = false }, 500)
      } else {
        window.clearTimeout(this.timer)
        this.disabled = true
      }
    },
    setDrag() {
      Object.keys(this.drag).forEach((key) => {
        this.drag[key] = !this.drag[key]
      })
      this.isDrag = !this.isDrag
      this.save()
    },
    setEdit() {
      this.isEdit =  !this.isEdit
      this.save()
    },
    save() {
      this.oldUrlList = JSON.parse(JSON.stringify(this.urlList))
    },
    back() {
      this.$store.dispatch('url/backwardHistory')
    },
    forward() {
      this.$store.dispatch('url/forwardHistory')
    },
    setTag() {
      this.isTag = !this.isTag
    }
  }
}
</script>

<style lang="scss" scoped>
.button {
  width: 30px;
  height: 30px;
  border: solid 1px red;
}
.content {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin: 20px auto;
  width: 30px;
  height: 280px;
  overflow: auto;
  i {
    width: 100%;
    height: 30px;
    font-weight: 400;
    font-size: 30px;
  }
}
.active {
  color: #409EFF
}
.inactive {
  color: #909399;
}
.hidden {
  visibility: hidden;
}
.show {
  visibility: visible;
}
.caret {
  font-weight: 400;
  font-size: 30px;
  color: #409EFF
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
