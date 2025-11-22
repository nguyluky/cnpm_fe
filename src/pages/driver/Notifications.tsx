import { useState } from 'react';
import { Badge } from '../../components/uiItem/badge';
import { Button } from '../../components/uiItem/button';
import { Card } from '../../components/uiItem/card';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  isRead: boolean;
  createdAt: string;
}

export default function DriverNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'noti-001',
      title: 'Thay đổi lịch trình',
      message: 'Lịch trình ngày mai đã được cập nhật. Vui lòng kiểm tra lại thời gian và tuyến đường.',
      type: 'WARNING',
      isRead: false,
      createdAt: '2024-11-20T08:30:00Z'
    },
    {
      id: 'noti-002',
      title: 'Bảo trì xe định kỳ',
      message: 'Xe 29A-123.45 cần bảo trì định kỳ vào tuần tới. Vui lòng liên hệ phòng kỹ thuật.',
      type: 'INFO',
      isRead: true,
      createdAt: '2024-11-19T14:15:00Z'
    },
    {
      id: 'noti-003',
      title: 'Chúc mừng!',
      message: 'Bạn đã hoàn thành xuất sắc chuyến đi hôm nay với 100% học sinh có mặt đúng giờ.',
      type: 'SUCCESS',
      isRead: false,
      createdAt: '2024-11-19T16:45:00Z'
    },
    {
      id: 'noti-004',
      title: 'Cảnh báo thời tiết',
      message: 'Dự báo mưa to vào chiều nay. Vui lòng lái xe cẩn thận và kiểm tra thiết bị an toàn.',
      type: 'ERROR',
      isRead: true,
      createdAt: '2024-11-18T12:00:00Z'
    }
  ]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'INFO': return 'bg-blue-100 text-blue-800';
      case 'WARNING': return 'bg-yellow-100 text-yellow-800';
      case 'ERROR': return 'bg-red-100 text-red-800';
      case 'SUCCESS': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'INFO': return 'ℹ️';
      case 'WARNING': return '⚠️';
      case 'ERROR': return '🚨';
      case 'SUCCESS': return '✅';
      default: return '📢';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(notifications.map(noti => 
      noti.id === notificationId 
        ? { ...noti, isRead: true }
        : noti
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(noti => ({ ...noti, isRead: true })));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Thông báo</h1>
            <p className="text-gray-600">
              Bạn có {unreadCount} thông báo chưa đọc
            </p>
          </div>
          {unreadCount > 0 && (
            <Button 
              onClick={handleMarkAllAsRead}
              variant="outline"
            >
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </div>
      </div>

      {/* Notification Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {notifications.filter(n => n.type === 'INFO').length}
          </div>
          <div className="text-sm text-gray-600">Thông tin</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {notifications.filter(n => n.type === 'WARNING').length}
          </div>
          <div className="text-sm text-gray-600">Cảnh báo</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {notifications.filter(n => n.type === 'ERROR').length}
          </div>
          <div className="text-sm text-gray-600">Khẩn cấp</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {notifications.filter(n => n.type === 'SUCCESS').length}
          </div>
          <div className="text-sm text-gray-600">Thành công</div>
        </Card>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`p-4 ${!notification.isRead ? 'ring-2 ring-blue-200 bg-blue-50' : ''}`}
          >
            <div className="flex items-start gap-4">
              <div className="text-2xl">
                {getTypeIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {notification.title}
                  </h3>
                  <Badge className={`${getTypeColor(notification.type)} px-2 py-1 text-xs font-medium rounded-full`}>
                    {notification.type}
                  </Badge>
                  {!notification.isRead && (
                    <Badge className="bg-red-500 text-white px-2 py-1 text-xs font-medium rounded-full">
                      Mới
                    </Badge>
                  )}
                </div>
                <p className="text-gray-700 mb-3">
                  {notification.message}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {formatDate(notification.createdAt)}
                  </span>
                  {!notification.isRead && (
                    <Button 
                      onClick={() => handleMarkAsRead(notification.id)}
                      size="sm"
                      variant="outline"
                    >
                      Đánh dấu đã đọc
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {notifications.length === 0 && (
        <Card className="p-8 text-center">
          <div className="text-gray-500">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-lg mb-2">Chưa có thông báo nào</p>
            <p className="text-sm">Các thông báo mới sẽ hiển thị tại đây</p>
          </div>
        </Card>
      )}
    </div>
  );
}
