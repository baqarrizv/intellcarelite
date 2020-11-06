const staticAssets = [
    './',
    './manifest.json',
    './sw.js',
    './index.html',
    './appnt_new_book.html',
    './appnt_new.html',
    './appnt_view_det.html',
    './appnt_view.html',
    './dash_patient.html',
    './demogrp_update.html',
    './demogrp_view.html',
    './medi_view.html',
    './report_view.html',
    './testfooter.txt',
    './testheader.txt',
    './vitals_add.html',
    './vitals_view_det.html',
    './vitals_view.html',
    './images/icons/icon-72x72.png',
    './images/icons/icon-96x96.png',
    './images/icons/icon-128x128.png',
    './images/icons/icon-144x144.png',
    './images/icons/icon-152x152.png',
    './images/icons/icon-192x192.png',
    './images/icons/icon-384x384.png',
    './images/icons/icon-512x512.png',
    './images/close.png',
    './images/empty.png',
    './images/favicon.png',
    './images/Hospital.jpg',
    './images/intellcare.jpg',
    './images/intellcare.png',
    './images/interactive_logo.png',
    './images/loading.gif',
    './images/next.png',
    './images/prev.png',
    './images/user-dummy.jpg',
    './scripts/bootstrap.min.js',
    './scripts/custom.js',
    './scripts/jquery.js',
    './scripts/main.js',
    './scripts/pwa.js',
    './scripts/scrolling-tabs.js',
    './styles/scrolling-tabs.css',
    './styles/style.css'
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