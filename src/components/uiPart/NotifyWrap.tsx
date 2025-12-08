import { useEffect, useRef } from "react";
import { useApi } from "../../contexts/apiConetxt";
import { setupPush } from "../../utils/webPush";



export function NotifyWrap({
    children,
}: {
    children: React.ReactNode;
}) {

    const promiseRef = useRef<Promise<void> | null>(null);
    console.log('NotifyWrap rendered');
    const { api, securityData } = useApi();

    useEffect(() => {
        if (!('serviceWorker' in navigator && 'PushManager' in window)) {
            console.warn('Trình duyệt không hỗ trợ Service Worker hoặc Push API.');
            return;
        }

        if (!securityData) {
            console.log('Người dùng chưa đăng nhập, không thiết lập thông báo đẩy.');
            return;
        }



        promiseRef.current = setupPush(api);
    }, [securityData]);
    return <>
        {children}
    </>;
}
