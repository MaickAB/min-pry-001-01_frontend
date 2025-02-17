import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { WelcomeComponent } from './app/view/welcome/welcome.component';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
