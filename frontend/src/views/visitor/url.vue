
<template>
  <div :style="urlListStyle" class="url-list">
    {{ windowWidth }}
    <div v-for="(urlPage, index) in urlList" :key="index">
      <draggable v-model="urlPage.page" v-bind="fatherDragOptions" :move="onMove" element="div" @start="fatherStart" @end="fatherEnd">
        <div v-for="(urlGroup, index) in urlPage.page" :key="index"  :style="urlGroupStyle" class="url-group">
          <div :style="urlGroupTitleStyle" class="url-group-title">
            <span>{{ urlGroup.title }}</span>
          </div>
          <draggable v-model="urlGroup.group" v-bind="childDragOptions" :move="onMove" element="div" @start="childStart" @end="childEnd" :class="pageClass">
            <transition v-for="(url, index) in urlGroup.group" :key="index" name="fade" >
              <div :style="boxStyle" class="url-box">
                <a href=url.url target="_blank">
                  <span>{{ url.title }}{{ index }}</span>
                </a>
              </div>
            </transition>
          </draggable>
        </div>
      </draggable>
    </div>
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
    }
  },
  data() {
    return {
      groupList1: [],
      groupList2: [],
      editable: true,
      childEditable: true,
      fatherEditable: true,
      isDragging: false,
      delayedDragging: false,
      windowWidth: 1000,
      urlPageOffsetLeft: 0,
      unitnum: 3,
      // colnum: 4,
      urlPageBorder: 1,
      boxWidth: 100,
      boxPaddingLR: 1,
      boxBorder: 1,
      boxMarginLR: 1,
      UCBoxMarginR: 50
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
    childDragOptions() {
      return {
        animation: 0,
        group: 'description',
        // disabled: true,
        disabled: !this.childEditable,
        ghostClass: 'ghost'
      }
    },
    fatherDragOptions() {
      return {
        animation: 0,
        group: 'description',
        disabled: !this.fatherEditable,
        ghostClass: 'ghost'
      }
    },
    pageClass: function() {
      let pageItem = []
      for(let i=1; i<11; i++) {
        let item = []
        for (let j=1; j<11; j++) {
          let string = ['page', 'item', i, j].join('-')
          item.push(string) 
        }
        pageItem.push(item)
      }
      return pageItem[this.unitnum - 1][this.colnum - 1]
    },
    urlGroupTitleStyle: function() {
      return { width: this.boxWidth + 'px' }
    },
    urlGroupStyle: function() {
      return { borderWidth: this.urlPageBorder + 'px'}
    },
    colnum() {
      const boxBase1 = (this.boxWidth + (this.boxMarginLR + this.boxBorder + this.boxPaddingLR)*2)
      const boxBase2 = (this.boxWidth + (this.boxPaddingLR + this.boxBorder)*2 + this.UCBoxMarginR + this.boxMarginLR)
      const boxToUrlPage = this.urlPageBorder * 2
      let base = 240
      let num = Math.floor((this.windowWidth - boxBase1 + boxBase2 - boxToUrlPage - base) / ((this.unitnum-1)*boxBase1 + boxBase2))
      return num
    },
    urlListStyle: function() {
      const boxBase1 = (this.boxWidth + (this.boxMarginLR + this.boxBorder + this.boxPaddingLR)*2)
      const boxBase2 = (this.boxWidth + (this.boxPaddingLR + this.boxBorder)*2 + this.UCBoxMarginR + this.boxMarginLR) 
      const boxToUrlPage = this.urlPageBorder * 2
      const width = ((this.unitnum-1)*this.colnum + 1)*boxBase1 + (this.colnum - 1)*boxBase2 + boxToUrlPage;
      return { width: width + 'px' }
    },
    boxStyle: function() {
      return { width: this.boxWidth + 'px', borderWidth: this.boxBorder + 'px' }
    }
  },
  watch: {
    isDragging(newValue) {
      if (newValue) {
        this.delayedDragging = true
        return
      }
      this.$nextTick(() => {
        this.delayedDragging = false
      })
    }
  },
  created() {
    this.getWindowWidth()
    window.addEventListener('resize', this.handleWindowResize, false)
  },
  mounted() {
  },
  destroyed() {
     window.removeEventListener('resize', this.handleWindowResize)
  },
  methods: {
    handleWindowResize() {
      this.windowWidth = document.body.clientWidth
      console.log(document.body.clientWidth)
    },
    onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element
      const draggedElement = draggedContext.element
      return (
        (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      )
    },
    fatherStart() {
      this.childEditable = !this.childEditable
    },
    fatherEnd() {
      this.childEditable = !this.childEditable
    },
    childStart() {
      this.fatherEditable = !this.fatherEditable
    },
    childEnd() {
      this.fatherEditable = !this.fatherEditable
    },
    getWindowWidth() {
      this.windowWidth = document.body.clientWidth
    }
  }
}
</script>

<style lang="scss" scoped>
  $boxPaddingLR: 1px;
  $boxBorder: 1px;
  $boxMarginLR: 1px;
  $UCBoxMarginR: 50px;
  .url-list {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    margin: 0px auto;
  }
  .url-group {
    border-width: 1px;
    border-style: solid;
    border-color: red;
    .url-group-title {
      border: solid $boxBorder red;
      border-radius: 2px;
      margin-left: $boxMarginLR;
      margin-right: $boxMarginLR;
      margin-bottom: 2px;
      background-color: #ffffff;
      height: 30px;
      display: block;
      position: relative;
      // 字体设置
      text-decoration: none;
      line-height: 30px;
      font-size: 14px;
      text-align: center;
      font-family: 'Microsoft Yahei', sans-serif;
      color: #474a4d;
      &:hover {
        font-size: 100%;
        color: #ffffff;
        background-color: #474a4d;
      }
    }
  }
  @for $unitnum from 1 through 10 {
    @for $colnum from 1 through 10 {
      .page-item-#{$unitnum}-#{$colnum} {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
        margin: 0px;
        div:nth-child(#{$unitnum}n+#{$unitnum}) {
          margin-right: $UCBoxMarginR !important;
        }
        div:nth-child(#{$unitnum*$colnum}n+#{$unitnum*$colnum}) {
          margin-right: $boxMarginLR !important;
        }
      }
    }
  }
  .url-box {
    border: solid red;
    box-sizing: content-box;
    border-radius: 2px;
    margin: 3px $boxMarginLR;
    padding: $boxPaddingLR;
    background-color: #ffffff;
    height: 45px;
    display: block;
    position: relative;
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
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active 在低于版本 2.1.8 中 */ {
    opacity: 0;
  }
</style>
