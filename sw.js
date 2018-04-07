
const CACHE_NAME = 'static-cache';


const filesToCache = [
    '/css/styles.css',
	'/js/main.js',
    //'/js/restaurant_info.js',
    '/js/dbhelper.js'
];


self.addEventListener('install', function(event) {
  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});


self.addEventListener('fetch', function(event) {
    console.log('Fetch event for ', event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response)
                    return response;
                return fetch(event.request);
            })
    );
});

