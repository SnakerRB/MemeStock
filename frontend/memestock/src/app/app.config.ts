import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(withEventReplay()), provideFirebaseApp(() => initializeApp({ projectId: "memestock-591b0", appId: "1:759309128644:web:537b97bf1787ba1ab18a91", storageBucket: "memestock-591b0.firebasestorage.app", apiKey: "AIzaSyDy0BFMfyMERGu8a0toZBbFfN_K1jetn14", authDomain: "memestock-591b0.firebaseapp.com", messagingSenderId: "759309128644" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
};
