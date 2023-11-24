import { ExtractPropTypes, defineComponent } from 'vue';
import './generalPlateTitle.scss';

const generalPlateTitleProps = {
  title: {
    type: String,
    default: ''
  },
  isClick: {
    type: Boolean,
    default: false
  },
  showClose: {
    type: Boolean,
    default: false
  },
  showBack: {
    type: Boolean,
    default: false
  },
  className: {
    type: String,
    default: ''
  }
};
export type GeneralPlateTitleProps = ExtractPropTypes<typeof generalPlateTitleProps>;

const GeneralPlateTitle = defineComponent({
  name: 'GeneralPlateTitle',
  props: generalPlateTitleProps,
  setup(props, { emit, slots }) {
    function emitTitle() {
      if (props.isClick) {
        emit('clickTitle', props.title);
      }
    }
    return () => {
      const rightIcon = (
        <div class="right-icons">
          {props.showBack && (
            <img onClick={() => emit('back')} class="close-btn" src="/images/screen/返回.png" alt="返回" />
          )}
          {props.showClose && (
            <img onClick={() => emit('close')} class="close-btn" src="/images/screen/关闭.png" alt="关闭" />
          )}
        </div>
      );

      return (
        <div class={`generalPlateTitle ${props.className}`}>
          <div class={props.isClick ? 'title pointer' : 'title'} onClick={() => emitTitle}>
            <span class={props.title.length > 20 ? 'font18' : ''}>{props.title}</span>
          </div>
          {slots.right ? slots.right?.() : rightIcon}
        </div>
      );
    };
  }
});

export default GeneralPlateTitle;
