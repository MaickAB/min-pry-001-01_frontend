import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { LocationStrategy, PathLocationStrategy } from '@angular/common'
import { provideHttpClient,withInterceptors } from '@angular/common/http'
import { authInterceptor } from './service/auth/interceptor/auth.interceptor';


import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    provideAnimations(),
    importProvidersFrom([]),    
    provideHttpClient(),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
