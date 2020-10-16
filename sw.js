const staticAssets = [
    './',
    './index.html',
    './page1.html',
    './sw.js',
    './manifest.json',
    './images/icons/icon-72x72.png',
    './images/icons/icon-96x96.png',
    './images/icons/icon-128x128.png',
    './images/icons/icon-144x144.png',
    './images/icons/icon-152x152.png',
    './images/icons/icon-192x192.png',
    './images/icons/icon-384x384.png',
    './images/icons/icon-512x512.png',
    './images/empty.png',
    './images/favicon.png',
    './images/Hospital.jpg',
    './images/intellcare.jpg',
    './images/loading.gif',
    './images/user-dummy.jpg',
    './scripts/main.js',
    './scripts/bootstrap.min.js',
    './scripts/custom.js',
    './scripts/jquery.js',
    './styles/style.css'
    // './fonts/css/fontawesome-all.min.css',
    // './fonts/webfonts/fa-brands-400.eot',
    // './fonts/webfonts/fa-brands-400.svg',
    // './fonts/webfonts/fa-brands-400.ttf',
    // './fonts/webfonts/fa-brands-400.woff',
    // './fonts/webfonts/fa-brands-400.woff2',
    // './fonts/webfonts/fa-brands-400d41d.eot',
    // './fonts/webfonts/fa-regular-400.eot',
    // './fonts/webfonts/fa-regular-400.svg',
    // './fonts/webfonts/fa-regular-400.ttf',
    // './fonts/webfonts/fa-regular-400.woff',
    // './fonts/webfonts/fa-regular-400.woff2',
    // './fonts/webfonts/fa-regular-400d41d.eot',
    // './fonts/webfonts/fa-solid-900.eot',
    // './fonts/webfonts/fa-solid-900.svg',
    // './fonts/webfonts/fa-solid-900.ttf',
    // './fonts/webfonts/fa-solid-900.woff',
    // './fonts/webfonts/fa-solid-900.woff2',
    // './fonts/webfonts/fa-solid-900d41d.eot',
    // // './images/undraw/1.svg',
    // // './images/undraw/2.svg',
    // // './images/undraw/3.svg',
    // // './images/undraw/4.svg',
    // // './images/undraw/5.svg',
    // // './images/undraw/6.svg',
];
self.addEventListener('install', async event=>{
    console.log(`installed sw and add static files`);
    const cache = await caches.open('pages-static-v1');
    cache.addAll(staticAssets);
});

self.addEventListener('fetch', event=>{
    // console.log(`fetched`);
    const req = event.request;
    event.respondWith(cacheFirst(req));
});

async function cacheFirst(req) 
{
    const cachedResponse = await caches.match(req);
    return cachedResponse || fetch(req);
}