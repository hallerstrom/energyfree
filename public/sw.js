self.addEventListener('install', (event) => {
  console.log('Service Worker installerad');
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // Behövs för att Chrome ska klassa det som en installerbar PWA
});