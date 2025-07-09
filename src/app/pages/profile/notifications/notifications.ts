import { Component, input } from '@angular/core';
import { NotificationService } from '../../../core/services/notification';
import { Notification } from '../../../core/models/notification.model';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-notifications',
  imports: [],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class Notifications {
  user= input<User | null>();
  notifications!: Notification[];
  visibleCount = 5;
  visibleNotifications!: Notification[];
  constructor(private notificationService: NotificationService){}

  ngOnInit(){
    this.notificationService.getUserNotifications(this.user()!.id, 50).subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        console.log("length : " + notifications.length)
        if(notifications.length >= this.visibleCount) this.visibleNotifications = notifications.slice(0, this.visibleCount);
        else this.visibleNotifications = notifications;
      },
    })
  }

  loadMore() {
    let previousCount = this.visibleCount;
    if(this.visibleCount+5<=this.notifications.length){
      this.visibleCount += 5;
    } else {
      this.visibleCount = this.notifications.length
    }
    console.log('previous value : ' + previousCount + "\nnew value : " +this.visibleCount + "\nnotifications length : " + this.notifications.length)
    this.visibleNotifications = this.notifications.slice(previousCount, this.visibleCount);
  }

}
