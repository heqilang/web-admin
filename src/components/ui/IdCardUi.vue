<template>
  <span>
    <span>{{ id_card }}</span>
  </span>
</template>

<script setup lang="ts">
import { formateIdCard } from '@/utils/formateUtil';
import { computed } from 'vue';

interface Props {
  userInfo: Record<string, any> & { id_card: string };
  desensitize?: boolean;
}
const props = withDefaults(defineProps<Props>(), { desensitize: true });
const id_card = computed(() => {
  const id = props.userInfo.id_card;
  if (props.desensitize) {
    return formateIdCard(id);
  }
  return id;
});
</script>
