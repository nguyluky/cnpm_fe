import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { path } from "../router";
import { getPWADisplayMode, isMobileDevice } from "../utils/mobileCheck";

// Dữ liệu nội dung dựa trên tài liệu "Smart School Bus Tracking System.pdf"
const homePageContent = {
    title: "Hệ thống Theo dõi Xe Buýt Học Sinh Thông Minh (SSB 1.0)",
    tagline: "Đảm bảo an toàn và minh bạch cho hành trình đến trường của con bạn.",
    description: "SSB 1.0 là giải pháp toàn diện giúp nhà trường, phụ huynh và tài xế quản lý và giám sát xe đưa đón học sinh theo thời gian thực. Hệ thống được đề xuất nhằm giải quyết các vấn đề về quản lý xe đưa đón, giảm áp lực và tăng cường sự an tâm cho các bên liên quan.",
    features: [
        "Theo dõi vị trí xe buýt theo thời gian thực (Độ trễ tối đa 3 giây).",
        "Phụ huynh nhận thông báo khi xe đến gần và cảnh báo nếu xe bị trễ.",
        "Quản lý xe buýt: Xem danh sách học sinh, tài xế và tuyến đường.",
        "Tài xế xem lịch làm việc và báo cáo tình trạng đón/trả học sinh.",
        "Hỗ trợ đa nền tảng: Web dashboard cho quản lý và Ứng dụng di động (Android/iOS)."
    ],
    installButton: "Cài đặt Ngay",
};

const SSBHomePage = () => {
    const handleInstallClick = () => {
        const deferredPrompt = (window as any).deferredPrompt;
        deferredPrompt?.prompt();

        deferredPrompt?.userChoice.then((choiceResult: any) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('Người dùng đã chấp nhận cài đặt PWA');
            } else {
                console.log('Người dùng đã từ chối cài đặt PWA');
            }
            
            (window as any).deferredPrompt = null;
        });

    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center">

            {/* Header/Navigation - Tối ưu cho Mobile */}
            <header className="w-full bg-white shadow-lg p-4 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                    <h1 className="text-xl md:text-2xl font-bold text-indigo-600">SSB 1.0</h1>

                    {/* Menu cho Desktop */}
                    <nav className="hidden md:flex items-center space-x-4">
                        <a href="#features" className="text-gray-600 hover:text-indigo-600 transition">Tính năng</a>
                        <a href="#about" className="text-gray-600 hover:text-indigo-600 transition">Giới thiệu</a>
                        <button
                            onClick={handleInstallClick}
                            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition duration-300 shadow-md"
                        >
                            {homePageContent.installButton}
                        </button>
                    </nav>

                    {/* Nút Cài đặt cho Mobile - Luôn hiển thị cùng logo */}
                    <button
                        onClick={handleInstallClick}
                        className="md:hidden px-3 py-1 text-sm font-semibold bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300"
                    >
                        {homePageContent.installButton}
                    </button>
                </div>
            </header>

            {/* Hero Section - Tối ưu Padding và Font Size cho Mobile */}
            <main className="flex-grow w-full">
                <section className="pt-20 pb-16 md:pt-32 md:pb-24 bg-indigo-50/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

                        {/* Font Size: text-4xl trên mobile, scale up trên màn hình lớn */}
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-3 leading-tight">
                            {homePageContent.title}
                        </h2>
                        <p className="text-xl sm:text-2xl text-indigo-600 font-semibold mb-6">
                            {homePageContent.tagline}
                        </p>
                        <p className="max-w-3xl mx-auto text-base sm:text-lg text-gray-600 mb-10 px-2">
                            {homePageContent.description}
                        </p>

                        {/* Install Button Chính */}
                        <button
                            onClick={handleInstallClick}
                            className="px-8 py-3 sm:px-10 sm:py-4 text-lg sm:text-xl font-bold bg-green-500 text-white rounded-xl shadow-2xl hover:bg-green-600 transform hover:scale-105 transition duration-300 w-auto"
                        >
                            {homePageContent.installButton}
                        </button>

                        <div className="mt-8 sm:mt-12">
                            <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium leading-none text-indigo-800 bg-indigo-100 rounded-full">
                                Ứng dụng di động (Android/iOS) và Web Dashboard
                            </span>
                        </div>
                    </div>
                </section>

                {/* Features Section - Sử dụng grid-cols-1 trên mobile */}
                <section id="features" className="py-16 md:py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h3 className="text-3xl font-extrabold text-gray-900 text-center mb-10 md:mb-12 border-b-2 border-indigo-200 pb-2">
                            Các Tính Năng Nổi Bật
                        </h3>
                        {/* Trên mobile (mặc định) là 1 cột, trên màn hình trung bình trở lên (md) là 2 cột */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                            {homePageContent.features.map((feature, index) => (
                                <div key={index} className="flex items-start space-x-4 bg-white p-5 rounded-lg shadow-lg border border-gray-100 hover:shadow-xl transition duration-300">
                                    <svg className="flex-shrink-0 h-6 w-6 text-indigo-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-base text-gray-700">{feature}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* About Section - Sử dụng w-full trên mobile để stacking */}
                <section id="about" className="py-16 md:py-20 bg-indigo-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h3 className="text-3xl font-extrabold text-gray-900 mb-8">
                            Ai là người hưởng lợi từ SSB 1.0?
                        </h3>
                        <div className="flex flex-wrap justify-center gap-6 mt-8">
                            {/* Trên mobile (mặc định) là 1 cột (w-full), trên sm trở lên là 1/3, lg là 1/5 */}
                            {['Nhà trường', 'Phụ huynh', 'Tài xế'].map((stakeholder) => (
                                <div key={stakeholder} className="w-full sm:w-1/3 lg:w-1/5 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
                                    <p className="text-xl font-bold text-indigo-600 mb-2">{stakeholder}</p>
                                    <p className="text-gray-600 text-sm">Đối tượng liên quan chính được hệ thống hỗ trợ.</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="w-full bg-gray-800 text-white p-6">
                <div className="max-w-7xl mx-auto text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} Smart School Bus Tracking System. Dự án SSB 1.0.</p>
                </div>
            </footer>
        </div>
    );
};


export function HomePage() {
    const navigate = useNavigate();
    useEffect(() => {
        const display_mode = getPWADisplayMode();
        if (isMobileDevice() && display_mode !== 'standalone') {
            return;
        }
        const apiSecurityData = localStorage.getItem('securityData');
        if (!apiSecurityData) {
            navigate(path.LOGIN);
            return;
        }
        const parsed = JSON.parse(apiSecurityData);
        const rolesFromStorage: string[] = parsed?.roles ?? [];

        if (rolesFromStorage.length === 1) {
            const role = rolesFromStorage[0];
            if (role === 'admin') {
                navigate(path.ADMIN);
            } else if (role === 'driver') {
                navigate(path.DRIVER);
            } else if (role === 'parent') {
                navigate(path.PARENT);
            }
        }
    }, []);

    // home page with install pwa
    // show infor about the app
    return (
        <SSBHomePage />
    )
}
