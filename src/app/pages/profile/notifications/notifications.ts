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
  constructor(private notificationService: NotificationService){}

  ngOnInit(){
    this.notificationService.getUserNotifications(this.user()!.id).subscribe({
      next: (notifications) => {
        this.notifications = notifications;
      },
    })
    console.log(this.notifications[0].date)
  }
}
