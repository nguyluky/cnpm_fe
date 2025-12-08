
// init indexedDB to store messages

const DB_NAME = "messages_db";
const DB_VERSION = 1;
const STORE_NAME = "messages_store";

function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

async function saveMessage(type, message) {
    const db = await openDatabase();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    store.add({ type, message, timestamp: Date.now() });
    return transaction.complete;
}

// init service worker


self.addEventListener('install', function(event) {
    console.log('[Service Worker] Đang cài đặt Service Worker...');
    self.skipWaiting(); // Kích hoạt ngay lập tức
});

self.addEventListener('activate', function(event) {
    console.log('[Service Worker] Đã kích hoạt Service Worker!');
    return self.clients.claim(); // Kiểm soát tất cả các client ngay lập tức
});

// Lắng nghe sự kiện "push" - đây là lúc tin nhắn từ server đến
self.addEventListener('push', function(event) {
    console.log('[Service Worker] Nhận Push');
    
    // Đảm bảo có dữ liệu
    const data = event.data ? event.data.json() : {}; 
    
    const title = data.title || 'Thông Báo Mới!';
    const options = {
        body: data.body || 'Bạn có thông tin cập nhật.',
        icon: '/vite.png', // Sử dụng icon của app React
        vibrate: [200, 100, 200], // Rung 200ms, nghỉ 100ms, rung 200ms
        // 2. GẮN THẺ (Tag): Ngăn thông báo trùng lặp hiển thị nhiều lần
        tag: 'important-update-1',
        data: {
            url: data.url || '/', // URL để mở khi người dùng click vào thông báo
        }
    };


    // Lưu tin nhắn vào IndexedDB
    saveMessage('push', data).then(() => {
        console.log('[Service Worker] Tin nhắn đã được lưu vào IndexedDB');
    }).catch(err => {
        console.error('[Service Worker] Lỗi khi lưu tin nhắn vào IndexedDB:', err);
    });

    // Hiển thị thông báo lên màn hình
    event.waitUntil(self.registration.showNotification(title, options));
});

// Lắng nghe sự kiện "notificationclick" - khi người dùng click vào thông báo
self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification Clicked');
    event.notification.close();

    const targetUrl = event.notification.data.url;

    // Mở trang web hoặc chuyển hướng đến URL cụ thể
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            // Kiểm tra xem đã có cửa sổ ứng dụng đang mở chưa
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url === targetUrl && 'focus' in client) {
                    return client.focus();
                }
            }
            // Nếu chưa, mở một cửa sổ mới
            return clients.openWindow(targetUrl);
        })
    );
});
