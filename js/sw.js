
const CACHE_NAME = 'static-cache';


const filesToCache = [
    '/css/styles.css',
	'/js/main.js',
    '/js/restaurant_info.js',
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

/*
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
*/


self.addEventListener('fetch', function(event) {
    console.log('Fetch event for ', event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                return response || fetchAndCache(event.request);
            })
    );
});


function fetchAndCache(url) {
    return fetch(url)
        .then(function(response) {
            // Check if we received a valid response
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return caches.open(CACHE_NAME)
                .then(function(cache) {
                    cache.put(url, response.clone());
                    return response;
                });
        })
        .catch(function(error) {
            console.log('Request failed:', error);
            // You could return a custom offline 404 page here
        });
}
