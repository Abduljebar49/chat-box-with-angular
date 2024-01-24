import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { AppService } from './app.service';
import { FormsModule } from '@angular/forms';
import { Message } from '../model/message';
import { Subject, takeUntil } from 'rxjs';
import { CircleProgressModule } from 'nextsapien-component-lib';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    PickerModule,
    HttpClientModule,
    FormsModule,
    CircleProgressModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'assessment';
  personId = 3;
  friendId = 4;
  message: string = '';
  messages: Message[] | undefined = [];
  selectedFile: File | null = null;
  filePreviewUrl: string | null = null;
  isImageFile: boolean = false;
  private unsubscribe$ = new Subject<void>();

  constructor(private service: AppService) {}

  ngOnInit(): void {
    this.service.getPersonalChat(4).subscribe((ele) => {
      this.messages = ele;
    });

    this.service.onDataChanged().subscribe(() => {
      this.service.getPersonalChat(4).subscribe((ele) => {
        this.messages = ele;
      });
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getPersonalChat(id: number) {
    return this.service.getPersonalChat(id).pipe(takeUntil(this.unsubscribe$));
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.isImageFile = file.type.startsWith('image/');

      if (this.isImageFile) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.filePreviewUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
  }

  clearFile() {
    this.selectedFile = null;
    this.filePreviewUrl = null;
  }

  clearInputForm() {
    this.clearFile();
    this.isImageFile = false;
    this.message = '';
  }

  messageChanges($event: any) {
    this.message = $event;
  }

  showEmojiPicker = false;

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any) {
    this.message += event.emoji.native;
  }
  sendMessage() {
    let msgTemp: Message | undefined;

    if (this.selectedFile && this.selectedFile.type.includes('image')) {
      msgTemp = {
        sender: this.personId,
        type: 'image',
        message: this.message,
        fileUrl: this.filePreviewUrl!,
        receiver: this.friendId,
      };
    } else {
      msgTemp = {
        sender: this.personId,
        type: 'text',
        message: this.message,
        receiver: this.friendId,
      };
    }

    if (msgTemp) {
      this.service.sendMessage(msgTemp);
      this.clearInputForm();
    }
  }
}
