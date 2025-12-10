import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { environment } from './environments/environment';

const meta = document.createElement('meta');
meta.httpEquiv = 'Content-Security-Policy';
meta.content = `
  default-src 'self';
  script-src 'self';
  style-src 'self' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' ${environment.apiUrl};
`;
document.head.appendChild(meta);

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
