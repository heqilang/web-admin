import { defineComponent } from 'vue';

const SideLeft = defineComponent({
  name: 'SideLeft',
  setup(_props, { slots }) {
    return () => {
      return <div class="sideLeft">{slots && slots.default?.()}</div>;
    };
  }
});

export default SideLeft;
