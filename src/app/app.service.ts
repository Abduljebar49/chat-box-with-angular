import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { UserChat } from '../model/user-chat';
import { Message } from '../model/message';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private http: HttpClient) {}
  loggedInPersonId = 3;
  private dataChangedSubject = new Subject<void>();

  getPersonalChat(id: number) {
    return of(
      this.userChatHistory.messages.filter(
        (ele) =>
          (ele.sender == this.userChatHistory.id && ele.receiver == id) ||
          (ele.sender == id && ele.receiver == this.userChatHistory.id)
      )
    );
  }

  sendMessage(msg: Message): void {
    this.userChatHistory.messages.push(msg);
    this.notifyDataChanged();
  }

  private notifyDataChanged(): void {
    this.dataChangedSubject.next();
  }

  onDataChanged(): Observable<void> {
    return this.dataChangedSubject.asObservable();
  }

  userChatHistory: UserChat = {
    id: 3,
    name: 'User1',
    friends: [1, 2, 4, 5, 6],
    messages: [
      {
        sender: 4,
        receiver: 3,
        type: 'text',
        message: `Hi Jake, how are you? I saw on the app that we've crossed paths several times this week 😊`,
      },
      {
        sender: 3,
        receiver: 4,
        type: 'text',
        message: `Haha truly! Nice to meet you Grace! What about a cup of coffee today evening? ☕️`,
      },
    ],
  };
}
