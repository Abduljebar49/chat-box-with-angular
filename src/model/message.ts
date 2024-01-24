export interface Message {
  sender: number;
  receiver: number;
  message: string;
  type: string;
  fileUrl?: string;
}
