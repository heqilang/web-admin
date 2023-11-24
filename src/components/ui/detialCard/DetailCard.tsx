import { ExtractPropTypes, defineComponent } from 'vue';
import './detailCard.scss';

const detailCardProps = {
  title: {
    type: String,
    default: ''
  },
  icon: {
    type: String
  }
};

export type DetailCardProps = ExtractPropTypes<typeof detailCardProps>;

const DetailCard = defineComponent({
  name: 'DetailCard',
  props: detailCardProps,
  setup(props, { emit, slots }) {
    function handleChangePage(title: string) {
      emit('changePage', title);
    }

    return () => {
      return (
        <div class="right-detail-card" onClick={() => handleChangePage(props.title)}>
          <div class="tab card-bg">
            <div class="head">
              <div class="head-icon">
                <img src={props.icon ? props.icon : '/images/screen/详情卡片图标.png'} alt="" />
              </div>
              <div class="head-title blue-num">{props.title}</div>
            </div>
            {slots?.default?.()}
          </div>
        </div>
      );
    };
  }
});

export default DetailCard;
