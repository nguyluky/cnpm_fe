import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useApi } from "../contexts/apiConetxt";
import { path } from "../router";

export function LoginPage() {
    const api = useApi();

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Thêm state để hiển thị lỗi

    const handleSubmit = (event) => {
        event.preventDefault();
        setError(''); // Reset lỗi mỗi khi thử đăng nhập

        const performLogin = async () => {
            try {
                const response = await api.login({
                    username,
                    password,
                });

                if (response.status === 200) {
                    api.setSecurityData( response.data.data!)
                    navigate(path.INDEX);
                }
            }
            catch (err) {
                setError(err.error.message);
            }
        }
        performLogin();
    };

    return (
        // Container chính: Nền gradient hoặc màu sắc đậm hơn, căn giữa
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 to-blue-900 p-4">

            {/* Box đăng nhập */}
            {/* Hiệu ứng 3D nhẹ với shadow lớn hơn và bo góc mượt mà */}
            <div className="relative bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm transform transition-all duration-300">

                {/* Tiêu đề */}
                <div className="text-center mt-2 mb-6">
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Chào mừng trở lại!
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                        Hệ thống Quản lý Xe buýt
                    </p>
                </div>

                {/* Form đăng nhập */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Trường Tên đăng nhập */}
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-semibold text-gray-700 mb-1"
                        >
                            Tên đăng nhập
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                            placeholder="Nhập tên đăng nhập của bạn"
                            required
                        />
                    </div>

                    {/* Trường Mật khẩu */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-semibold text-gray-700 mb-1"
                        >
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                            placeholder="Nhập mật khẩu của bạn"
                            required
                        />
                    </div>

                    {/* Hiển thị lỗi (nếu có) */}
                    {error && (
                        <p className="text-red-600 text-sm text-center -mt-2">{error}</p>
                    )}

                    {/* Nút Đăng nhập */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform active:scale-95 transition duration-200 ease-in-out shadow-md"
                    >
                        Đăng nhập
                    </button>

                    {/* Liên kết hoặc thông tin phụ trợ */}
                    <div className="text-center text-sm text-gray-500 mt-4">
                        <a href="#" className="text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
                            Quên mật khẩu?
                        </a>
                    </div>

                </form>
            </div>
        </div>
    );
}

