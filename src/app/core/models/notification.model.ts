export interface Notification {
  id: number;
  contenu: string;
  nom: string;
  date: string;
  userId: number;
  userName: string;
}

export interface RequestNotification {
  id?: number;
  contenu: string;
  nom: string;
  date: string;
  userId: number;
  userName: string;
}