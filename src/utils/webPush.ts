import type { Api } from "../api/Api";

export const setupPush = async (api: Api<any>) => {
    try {
        console.log('Setting up Push Notifications');
        // a. Đăng ký Service Worker
        const reg = await navigator.serviceWorker.register("/sw.js");

        console.log('Service Worker registered:', reg);

        // b. Yêu cầu quyền nếu chưa có (TỰ ĐỘNG BẬT)
        const permissionResult = await Notification.requestPermission();
        console.log('Notification permission result:', permissionResult);

        if (permissionResult !== 'granted') {
            console.warn('Quyền thông báo không được cấp.');
            alert('Vui lòng cho phép thông báo để nhận cập nhật mới nhất.');
            return;
        }

        // c. get vapid key from server
        const reap = await api.getVapidPublicKey()
        const key = reap.data.data?.vapidPublicKey;

        if (!key) {
            console.error('Không lấy được VAPID Public Key từ server.');
            return;
        }

        // b. Kiểm tra trạng thái hiện tại
        let subscription = await reg.pushManager.getSubscription();
        if (!subscription) {
            // d. Tạo và Gửi Subscription lên Server
            subscription = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: key,
            });
            console.log('New Push Subscription created:', subscription);
        }
        else {
            console.log('Existing Push Subscription found:', subscription);
        }

        const data = subscription.toJSON();
        await api.saveSubscription({
            subscription: {
                endpoint: data.endpoint || '',
                keys: {
                    p256dh: data.keys?.p256dh || '',
                    auth: data.keys?.auth || ''
                }
            }
        })
        console.log('Subscription saved to server.');

    } catch (error) {
        if (Notification.permission === 'denied') {
            console.warn('Quyền thông báo bị từ chối bởi người dùng.');
        } else {
            console.error('Lỗi thiết lập Push:', error);
        }
    }
};
