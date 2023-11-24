<template>
  <div>
    <div @click="changeVisible" class="select-btn">
      <slot name="reference">
        <el-button text> 选择位置 </el-button>
      </slot>
    </div>
    <el-dialog
      v-model="dialogVisible"
      :title="disabled ? '查看位置' : '选择位置'"
      width="60%"
      :before-close="handleClose"
    >
      <div id="container">
        <div class="search-box" v-if="!disabled">
          <QueryAddress @select="onAddressSelect" />
        </div>
      </div>
      <p class="address">{{ _address }}</p>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" v-if="!disabled" @click="addressConfirm">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import AMapLoader from '@amap/amap-jsapi-loader';
import { ref, shallowRef, nextTick, defineEmits, watch } from 'vue';
import QueryAddress from './QueryAddress.vue';
const JS_KEY = 'c8413dd4394ccace63e6c0a63b1f425c';
const SERVE_KEY = 'f900c6d93224b931c39cef01e5bc5fbb';
window._AMapSecurityConfig = 'c69178285e577481d813959c6df502ae';
const emit = defineEmits(['change']);
const props = defineProps({
  poi: { type: Object, default: null },
  address: String,
  disabled: {
    type: Boolean,
    default: false
  }
});
const map = shallowRef(null);
const AMAP = shallowRef(null);
const dialogVisible = ref(false);
const _address = ref('');
const _poi = {};
const poiStack = [];
watch(
  () => props.poi,
  () => {
    if (props.poi?.longitude) {
      if (map.value) {
        createPoi([props.poi.longitude, props.poi.latitude]);
      } else {
        poiStack.push([props.poi.longitude, props.poi.latitude]);
      }
    }
    _address.value = props.address;
  }
);
function handleClose() {
  dialogVisible.value = false;
}
function changeVisible() {
  dialogVisible.value = !dialogVisible.value;
  if (dialogVisible.value) {
    nextTick(() => {
      initMap();
    });
  }
}
function addressConfirm() {
  dialogVisible.value = false;
  emit('change', {
    address: _address.value,
    position: [_poi.lng, _poi.lat]
  });
}
// 地址搜索框选择
function onAddressSelect(address) {
  createPoi([address.longitude, address.latitude]);
  map.value.setCenter([address.longitude, address.latitude]);
  _address.value = `${address.address} ${address.name}`;
  _poi.lng = address.longitude;
  _poi.lat = address.latitude;
}
function initMap() {
  if (AMAP.value || map.value) {
    return;
  }
  AMapLoader.load({
    key: JS_KEY, // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  }).then(AMap => {
    AMAP.value = AMap;
    map.value = new AMap.Map('container', {
      //设置地图容器id
      viewMode: '3D', //是否为3D地图模式
      zoom: 16, //初始化地图级别
      center: AMap.LngLat(104.065943, 30.657263) //初始化地图中心点位置
    });
    !props.disabled &&
      map.value.on('click', function (ev) {
        const lnglat = ev.lnglat;
        _poi.lng = lnglat.lng;
        _poi.lat = lnglat.lat;
        createPoi(lnglat);
        geoParse(lnglat.lng, lnglat.lat);
      });
    if (poiStack.length) {
      createPoi(poiStack[0]);
      map.value.setCenter(poiStack[0]);
      poiStack.splice(0, 1);
    }
  });
}
function createPoi(position) {
  map.value.clearMap();
  const marker = new AMAP.value.Marker({
    position,
    title: ''
  });
  map.value.add(marker);
}
function geoParse(lng, lat) {
  const key = SERVE_KEY;
  const url = 'https://restapi.amap.com/v3/geocode/regeo?';
  const queryStr = getSearchStr({
    key,
    location: `${lng},${lat}`,
    radius: 1000,
    extensions: 'all',
    output: 'json'
  });
  window
    .fetch(url + queryStr)
    .then(res => {
      return res.json();
    })
    .then(res => {
      const { regeocode, status } = res;
      if (status === '1') {
        _address.value = regeocode.formatted_address;
      }
    });
}
function getSearchStr(params) {
  let res = '';
  for (const key in params) {
    res += `${res ? '&' : ''}${key}=${params[key]}`;
  }
  return res;
}
</script>

<style lang="scss" scoped>
.select-btn {
  display: inline-block;
  margin-left: 8px;
}
#container {
  position: relative;
  height: 60vh;
  .search-box {
    position: absolute;
    top: 12px;
    left: 12px;
    min-width: 150px;
    min-height: 32px;
    line-height: 0;
    z-index: 999;
  }
}
.address {
  min-height: 20px;
  margin-bottom: 0;
}
</style>
