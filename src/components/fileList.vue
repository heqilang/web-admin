<template>
  <div class="">
    <div
      :key="index"
      v-for="(it, index) in list"
      class="icon-warper"
      :class="props.inline ? 'inline' : 'block'"
      :title="it.name"
      @click="download(it.url)"
    >
      <span v-if="props.showIndex" class="file_index">{{ index + 1 }}、</span>
      <svg-icon :name="it.type" :w="15" :h="15"></svg-icon>
      <span class="file-name" v-if="props.showName">{{ it.name }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  showName: {
    type: Boolean,
    default: false
  },
  inline: {
    type: Boolean,
    default: true
  },
  showIndex: {
    type: Boolean,
    default: false
  }
});

const list = computed(() => {
  if (!this.data) {
    return [];
  } else {
    const supportTypes = {
      png: 'img',
      jpg: 'img',
      pdf: 'pdf',
      xlsx: 'xlsx',
      docx: 'docx',
      doc: 'docx',
      rtf: 'docx',
      txt: 'txt',
      html: 'html'
    };
    return this.data.map(it => {
      const splitStr = it.split('.');
      const splitStr2 = it.split('/');
      const file_type = splitStr[splitStr.length - 1].toLowerCase();
      const name = splitStr2[splitStr2.length - 1];
      const svgIcon = supportTypes[file_type] || 'normal';
      return {
        url: it,
        name,
        type: `file-${svgIcon}`
      };
    });
  }
});

function download(url) {
  window.open(url, '_blank');
}
</script>
<style lang="scss" scoped>
.icon-warper {
  cursor: pointer;
  margin-right: 16px;
  transition: all 250ms;
  margin-bottom: 10px;
  .file-name {
    color: #666;
    font-size: 13px;
    margin-left: 5px;
    vertical-align: middle;
  }
  &:hover {
    // transform: scale(1.15);
    box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.1);
  }
  &:hover .file-name {
    color: #409eff;
    border-bottom: 1px solid #409eff;
  }
}

.file_index {
  vertical-align: middle;
  color: #999;
}
.inline {
  display: inline-block;
}
.block {
  display: block;
}
</style>
