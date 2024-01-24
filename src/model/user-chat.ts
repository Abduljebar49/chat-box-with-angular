import { Message } from './message';

export interface UserChat {
  id: number;
  name: string;
  friends: number[];
  messages: Message[];
}
