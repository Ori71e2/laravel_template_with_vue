
<template>
  <div class="operate">
    <div v-if="visible" class="content box animated fadeInUp">
      <i class="el-icon-edit"></i>
      <i class="el-icon-share"></i>
      <i class="el-icon-delete"></i>
    </div>
    <div v-else class="content"></div>
    <div @click="popOver" class="button" slot="reference"><i class="el-icon-caret-top caret"/></div>
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
      default: []
    },
    'drag' : {
      type: Object,
      default: {}
    },
    'edit': {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false
    }
  },
  computed: {
    urlList: {
      get() {
        return this.list
      },
      set(val) {
        this.$emit('update:list', val)
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
  margin: 0px auto;
  width: 30px;
  height: 200px;
  overflow: auto;
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
