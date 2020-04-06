<template>
  <el-dialog title="标签列表" :visible.sync="isTag" width="70%" model-append-to-body class="dialog-custom">
    <div class="main">
      <div class="tag-selected">
        <draggable v-model="tagSelected" v-bind="dragOptions" element="div" :move="onMove" @start="dragStart" @end="dragEnd" class="dragarea">
          <transition v-for="tag in tagSelected" :key="tag.id" name="fade">
            <div class="tag-item">
              <el-tag class="item"> {{ tag.title }} </el-tag>
            </div>
          </transition>
        </draggable>
      </div>
      <div class="tag-search">
        <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
          <el-button slot="prepend" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <div class="tag-store">
        <draggable v-model="urlTag" v-bind="dragOptions" element="div" :move="onMove" @start="dragStart" @end="dragEnd" class="dragarea">
          <transition v-for="tag in urlTag" :key="tag.id" name="fade">
            <div class="tag-item">
              <el-tag class="item"> {{ tag.title }} </el-tag>
            </div>
          </transition>
        </draggable>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isTag = false">取 消</el-button>
      <el-button type="primary" @click="isTag = false">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getUrlTag } from '@/api/url'
import draggable from 'vuedraggable'
export default {
  components: {
    draggable
  },
  data() {
    return {
      search: '',
      tagSelected: []
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
        console.log('xx')
        this.$store.dispatch('url/setTagPopover', val)
      }
    },
    dragOptions() {
      return {
        animation: 0,
        group: 'description',
        // disabled: true,
        disabled: false,
        ghostClass: 'ghost'
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
    onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element
      const draggedElement = draggedContext.element
      return (
        (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      )
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    dragStart() {
    },
    dragEnd() {
    }
  }
}
</script>
<style lang="scss" scoped>
$searchHeight: 50px;
$tagSelectedHeight: 100px;
$stars: (
  (background-color: #409EFF, border-color: #409EFF, color: #fff),
  (background-color: #67c23a, border-color: #67c23a, color: #fff),
  (background-color: #E6A23C, border-color: #E6A23C, color: #fff),
  (background-color: #F56C6C, border-color: #F56C6C, color: #fff),
  (background-color: #909399, border-color: #909399, color: #fff),
  (background-color: #8040FF, border-color: #8040FF, color: #fff),
  (background-color: #FC40FF, border-color: #FC40FF, color: #fff),
);

.dialog-custom {
  height: 90%;
}
.main {
  width: 99%!important;
  height: calc(70% - 50px);
  height: 500px;
  margin-bottom: 20px!important;
  margin-left: 10px;
  // overflow: auto;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  // align-items: center;
}
.tag-selected {
  width: 100%;
  height: $tagSelectedHeight;
  border: solid 1px red;
  overflow: auto;
  .dragarea {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    div {
      margin: 2px 4px;
      height: 32px;
      // background-color:rgba(255,255,255,0);
    }
    @for $i from 1 through length($stars) {
      $item: nth($stars, $i);
      & div:nth-child(#{$i}n+#{$i}) {
        .item {
          background-color: map-get($item, background-color) !important;
          border-color: map-get($item, border-color) !important;
          color: map-get($item, color) !important;
        }
      }
    }
  }
}
.tag-search {
  width: 100%;
  height: $searchHeight;
  border: solid 1px red;
}
.tag-store {
  width: 100%;
  height: calc(100% - #{$searchHeight} - #{$tagSelectedHeight} - 10px);
  border: solid 1px red;
  overflow: auto;
  .dragarea {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    div {
      margin: 2px 4px;
      height: 32px;
      // background-color:rgba(255,255,255,0);
    }
    @for $i from 1 through length($stars) {
      $item: nth($stars, $i);
      & div:nth-child(#{$i}n+#{$i}) {
        margin: 2px 4px;
        .item {
          background-color: map-get($item, background-color) !important;
          border-color: map-get($item, border-color) !important;
          color: map-get($item, color) !important;
        }
      }
    }
  }
}
</style>
