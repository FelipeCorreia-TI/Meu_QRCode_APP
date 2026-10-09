const CACHE_NAME = 'qrcode-sesi-v1';

// Lista de arquivos estáticos que o app precisa para rodar offline
const ASSETS = [
  './',
  './index.html',
  './styles/style.css',
  './scripts/script.js',
  './icon/icon_site.ico',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQH8acYsqtM_ucsq_FusczwN6LIHX47pybtiMs0d4Io5VNwWFXniH3Ep4s&s=10' // Cacheia a imagem inicial do SESI
];

// 1. Evento de Instalação: Salva os arquivos no cache do celular/PC
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Arquivos estáticos armazenados no Cache.');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// 2. Evento de Ativação: Limpa caches antigos se você atualizar o app
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Removendo cache antigo:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Evento Fetch: Intercepta a rede e serve o arquivo do Cache se estiver offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Retorna o arquivo do cache se encontrar, senão vai buscar na internet
      return cachedResponse || fetch(event.request);
    })
  );
});
