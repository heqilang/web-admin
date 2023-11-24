<template>
  <el-autocomplete
    v-model="keyword"
    :fetch-suggestions="getPoiByKeyword"
    :debounce="500"
    value-key="name"
    placeholder="请输入"
    clearable
    @select="handleSelect"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
const SERVE_KEY = 'f900c6d93224b931c39cef01e5bc5fbb';
const keyword = ref('');
const emits = defineEmits(['select', 'suggestionsChange']);
function handleSelect(item: Record<string, any>) {
  emits('select', {
    name: item.name,
    address: item.address,
    location: item.location,
    longitude: Number(item.location.split(',')[0]),
    latitude: Number(item.location.split(',')[1])
  });
  return '';
}
function getPoiByKeyword(keyword: string, callback: any) {
  const url = 'https://restapi.amap.com/v3/assistant/inputtips?';
  const queryStr = getSearchStr({
    key: SERVE_KEY,
    keywords: keyword,
    city: 1000,
    offset: '15',
    extensions: 'base'
  });
  window
    .fetch(url + queryStr)
    .then(res => {
      return res.json();
    })
    .then(res => {
      const { tips, status, info } = res;
      if (status === '1') {
        callback(tips || []);
        emits(
          'suggestionsChange',
          tips.map((item: Record<string, any>) => {
            return {
              name: item.name,
              address: item.address,
              location: item.location,
              longitude: Number(item.location.split(',')[0]),
              latitude: Number(item.location.split(',')[1])
            };
          })
        );
      } else {
        console.error(info);
        callback([]);
      }
    })
    .catch(() => {
      callback([]);
    });
}
function getSearchStr(params: { [key: string]: string | number }) {
  let res = '';
  for (const key in params) {
    res += `${res ? '&' : ''}${key}=${params[key]}`;
  }
  return res;
}
</script>

<style lang="scss" scoped></style>
