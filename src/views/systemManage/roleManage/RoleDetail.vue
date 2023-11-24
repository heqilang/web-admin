<template>
  <div class="single-page">
    <div class="content-block">
      <div class="info-head">
        <h4 class="left_line">
          基本信息
          <el-button style="float: right" type="primary" v-if="!disable" @click="save">保存</el-button>
          <el-button style="float: right; margin-right: 16px" @click="back">返回</el-button>
        </h4>
      </div>
      <div class="info-content">
        <div class="row">
          <p class="row-label">角色名称</p>
          <div class="row-value-box">
            <span v-if="disable">{{ data.baseInfo.role_name || '-' }}</span>
            <el-input style="width: 400px" v-else v-model.trim="data.baseInfo.role_name"></el-input>
          </div>
        </div>
        <div class="row">
          <p class="row-label">角色描述</p>
          <div class="row-value-box">
            <span v-if="disable">{{ data.baseInfo.role_desc || '-' }}</span>
            <el-input
              v-else
              style="width: 400px"
              v-model.trim="data.baseInfo.role_desc"
              type="textarea"
              :rows="3"
            ></el-input>
          </div>
        </div>
      </div>
    </div>
    <div class="content-block">
      <div class="info-head">
        <h4 class="left_line">权限管理</h4>
      </div>
      <div class="info-content">
        <el-tabs v-model="curTab">
          <el-tab-pane v-for="(item, index) in data.sysModuleList" :key="index" :label="item.title" :name="item.title">
            <div :class="disable || item.title == '日常办公' ? 'disable-row' : ''">
              <template v-for="(item2, index2) in item.children" :key="index2">
                <div class="check-row">
                  <el-checkbox
                    v-if="item2.id"
                    :checked="item2.checked"
                    v-model="data.prop[item2.id]"
                    @change="checkChangeLv2($event, item.id, item2.id)"
                  >
                    <span style="font-weight: 600; font-size: 14px">{{ item2.title }}</span>
                  </el-checkbox>
                  <el-divider v-if="item2.children?.length" direction="vertical"></el-divider>
                  <el-checkbox-group v-if="item2.children && item2.children.length" v-model="checkedArrLv3">
                    <el-checkbox
                      :checked="item3.checked"
                      @change="checkChangeLv3($event, item.id, item2.id, item3.id)"
                      v-for="(item3, index3) in item2.children"
                      :label="item3.id"
                      :key="index3"
                      >{{ item3.title }}</el-checkbox
                    >
                  </el-checkbox-group>
                </div>
              </template>
              <span v-if="item.title == '日常办公'" class="danger-tip"
                >日常办公的权限默认所有角色都包含，且不可移除</span
              >
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { CheckboxValueType, ElMessage } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { MenuListCheckedVO, RoleData, ModuleMenuListCheckedVO } from './role';
import { addSysRole, getSysModuleList, getSysRole, updateSysRole } from '@/api/system/api/SysApi';
const route = useRoute();
const router = useRouter();
onMounted(() => {
  if (route.query.id && route.query.role_type === '0') {
    disable.value = true;
  }
  init();
});

const disable = ref(false);
const checkedArrLv3 = ref<string[]>([]);
const user_module_list = ref<ModuleMenuListCheckedVO[]>([]);
const curTab = ref('日常办公');
const data = reactive<RoleData>({
  prop: {},
  sysModuleList: [],
  baseInfo: {
    role_name: '',
    role_desc: ''
  }
});

// 二级选择
function checkChangeLv2(e: CheckboxValueType, id1?: string, id2?: string) {
  for (const it of data.sysModuleList) {
    if (it.id !== id1) continue;
    it.children?.map(it2 => {
      if (it2.id === id2) {
        it2.checked = e as boolean;
        // 二级勾选与否直接影响三级所有子集
        if (it2.children?.length) {
          for (const it3 of it2.children) {
            it3.checked = e as boolean;
            e && it3.id && checkedArrLv3.value.push(it3.id);
            !e && (checkedArrLv3.value = checkedArrLv3.value.filter(i => i !== it3.id));
          }
        }
      }
    });
    // 二级含有被选时 一级自动选择
    it.checked = it.children?.some(i => i.checked);
  }
}
// 三级选择
function checkChangeLv3(e: CheckboxValueType, id1?: string, id2?: string, id3?: string) {
  for (const it of data.sysModuleList) {
    if (it.id === id1) {
      it.children?.map(it2 => {
        if (it2.id && it2.id === id2) {
          it2.children?.map(it3 => {
            if (it3.id === id3) {
              it3.checked = e as boolean;
            }
          });
          const lv2Checked = it2.children?.some(it => it.checked);
          it2.checked = lv2Checked;
          data.prop[it2.id] = lv2Checked;
        }
      });
      it.checked = it.children?.some(i => i.checked);
      moduleFilter();
    }
  }
}
// 模块过滤 用于提交
function moduleFilter() {
  let level = 1;
  const res = format(data.sysModuleList);
  return res;
  function format(data: MenuListCheckedVO[]) {
    const modules: MenuListCheckedVO[] = [];
    for (const it of data) {
      const item: MenuListCheckedVO = {};
      if (it.children?.length) {
        item.children = format(it.children);
      } else {
        item.children = [];
      }
      if (it.checked) {
        const level1 = {
          id: it.id,
          name: it.name,
          title: it.title,
          icon: it.icon,
          seq: it.seq
        };
        const level2 = {
          id: it.id,
          name: it.name,
          title: it.title,
          icon: it.icon,
          seq: it.seq,
          upper_id: it.upper_id,
          module_id: it.module_id
        };
        const obj = it.module_id ? level2 : level1;
        modules.push({ ...obj, ...item });
      }
    }

    level = level + 1;
    return modules;
  }
}
/* 更新角色 */
function updateRole() {
  const params = {
    ...data.baseInfo,
    module_list: moduleFilter(),
    id: route.query.id as string
  };
  updateSysRole(params).then(res => {
    if (res.state === 0) {
      ElMessage.success('修改成功');
      router.back();
    } else {
      ElMessage.error(res.msg);
    }
  });
}
/* 新增角色 */
function addRole() {
  const params = {
    ...data.baseInfo,
    module_list: moduleFilter()
  };
  addSysRole(params).then(res => {
    if (res.state === 0) {
      ElMessage.success('新增成功');
      router.back();
    } else {
      ElMessage.error(res.msg);
    }
  });
}
function querySysRole() {
  getSysRole({ role_id: route.query.id as string }).then(res => {
    if (res.state === 0) {
      data.baseInfo = {
        role_name: res.data?.role_name,
        role_desc: res.data?.role_desc
      };
      disable.value = res.data?.role_type === 0;
      user_module_list.value = res.data?.module_list || [];
      curTab.value = res.data?.module_list?.[0]?.title ?? '';
      setModuleChecked();
    }
  });
}
function setModuleChecked() {
  const list = user_module_list.value;

  const allCheckIds: string[] = []; // 收集所有角色check id
  collectAllCheckIds(list);
  if (data.sysModuleList?.length && list?.length) {
    for (const it of list) {
      if (!it.children?.length) continue;
      for (const it2 of it.children) {
        if (it2.id) data.prop[it2.id] = true;
        if (!it2.children?.length) continue;
        for (const it3 of it2.children) {
          if (it3.id) checkedArrLv3.value.push(it3.id);
        }
      }
    }

    addCheckToModule(data.sysModuleList);
  }
  // function 收集所有角色check id
  function collectAllCheckIds(data: ModuleMenuListCheckedVO[]) {
    for (const it of data) {
      it.id && allCheckIds.push(it.id);
      it.children?.length && collectAllCheckIds(it.children);
    }
  }
  // 添加check属性到系统模块
  function addCheckToModule(data: ModuleMenuListCheckedVO[]) {
    for (const it of data) {
      if (allCheckIds.some(i => i === it.id)) {
        it.checked = true;
      }
      it.children?.length && addCheckToModule(it.children);
    }
  }
}
function save() {
  if (route.query.id) {
    updateRole();
  } else {
    addRole();
  }
}
function back() {
  router.back();
}
function init() {
  getSysModuleList().then(res => {
    if (res.data) {
      data.sysModuleList = res.data ?? [];
      curTab.value = res.data[0].title ?? '';
      route.query.id && setModuleChecked();
    }
  });
  route.query.id && querySysRole();
}
</script>
<style lang="scss" scoped>
.content-block {
  .info-head {
    h3 {
      font-size: 16px;
      padding: 0 10px;
      border-left: 3px solid #409eff;
    }
  }
  .info-content {
    padding-left: 20px;
    .row {
      margin: 30px 0;
      font-size: 14px;
      .row-label {
        width: 100px;
        text-align: left;
        float: left;
        margin: 0;
        color: #666;
        user-select: none;
      }
      .row-value-box {
        margin-left: 100px;
        padding-left: 12px;
        color: #333;
        .link {
          cursor: pointer;
          &:hover {
            text-decoration: underline;
            color: #409eff;
          }
        }
      }
    }
    .check-row {
      margin: 8px 8px;
      padding: 24px 16px;
      display: flex;
      align-items: flex-start;
      .el-divider {
        margin: 0 16px;
      }
      &:hover {
        box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.1);
      }
    }
    .disable-row {
      position: relative;
      &:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background-color: transparent;
        z-index: 99999;
      }
    }
  }
}
.danger-tip {
  color: #e00065;
  font-size: 14px;
  margin: 40px 24px;
}
</style>
