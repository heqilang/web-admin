import mitt, { EventType } from 'mitt';

export interface EventData extends Record<EventType, any> {
  title?: string;
}

export type Events = {
  changeRoute: string;
  changeLeftModal?: EventData;
  changeRightModal?: EventData;
  changePopModal?: EventData;
};

const mitter = mitt<Events>();

export default mitter;
