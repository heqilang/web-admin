import { defineComponent, ExtractPropTypes } from 'vue';

const sideRightProps = {
  title: String
};

export type SideRightProps = ExtractPropTypes<typeof sideRightProps>;

const SideRight = defineComponent({
  name: 'SideRight',
  props: sideRightProps,
  setup(props, { slots }) {
    return () => {
      return (
        <div key={props.title} class="sideRight">
          {slots && slots.default?.()}
        </div>
      );
    };
  }
});

export default SideRight;
