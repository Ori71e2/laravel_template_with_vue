
<template>
  <div class="url-page-nav">
    <draggable v-model="urlList" v-bind="dragOptions" :move="onMove" element="div" @start="dragStart" @end="dragEnd">
      <transition v-for="(page, index) in urlList" :key="index" name="fade" >
        <div class="url-page-title">
          <a>
            <span>{{ page.title }}</span>
          </a>
        </div>
      </transition>
    </draggable>
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
    }
  },
  data() {
    return {
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
