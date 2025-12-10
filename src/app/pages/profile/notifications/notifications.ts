import { Component, input, OnInit } from '@angular/core';
import { NotificationService } from '../../../core/services/notification';
import { Notification } from '../../../core/models/notification.model';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-notifications',
  imports: [],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class Notifications implements OnInit {
  user= input<User | null>();
  notifications: Notification[] = [];
  visibleCount = 5;
  visibleNotifications: (Notification | null)[] = [];
  readonly ROWS_TO_DISPLAY = 5;
  constructor(private notificationService: NotificationService){}

  ngOnInit(){
    this.notificationService.getUserNotifications(this.user()!.id, 50).subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        console.log("length : " + notifications.length)
        this.prepareDisplayData();
      },
    })
  }

  prepareDisplayData(): void {
    const realData = this.notifications.slice(0, this.visibleCount);
    const placeholdersNeeded = this.ROWS_TO_DISPLAY - realData.length;
    const placeholders = Array(
      placeholdersNeeded > 0 ? placeholdersNeeded : 0
    ).fill(null);
    this.visibleNotifications = [...realData, ...placeholders];
  }

  loadMore() {
    let previousCount = this.visibleCount;
    if(this.visibleCount+5<=this.notifications.length){
      this.visibleCount += 5;
    } else {
      this.visibleCount = this.notifications.length
    }
    console.log('previous value : ' + previousCount + "\nnew value : " +this.visibleCount + "\nnotifications length : " + this.notifications.length)
    this.prepareDisplayData();
  }

}