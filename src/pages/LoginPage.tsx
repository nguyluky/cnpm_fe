import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../contexts/apiConetxt";
import { path } from "../router";
import { toast } from "react-toastify";

export function LoginPage() {
    const {api} = useApi();

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Thêm state để hiển thị lỗi
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(''); // Reset lỗi mỗi khi thử đăng nhập

        const performLogin = async () => {
            try {
                const response = await api.login({
                    username,
                    password,
                });

                if (response.status === 200) {
                    api.setSecurityData(response.data.data!)
                    const role = response.data.data!.roles;
                    if (role.length === 1) {
                        const userRole = role[0];
                        if (userRole === 'admin') {
                            navigate(path.ADMIN);
                        } else if (userRole === 'driver') {
                            navigate(path.DRIVER);
                        } else if (userRole === 'parent') {
                            navigate(path.PARENT);
                        }
                    }
                    navigate(path.INDEX);
                    toast.success('Đăng nhập thành công!');
                }
            }
            catch (err) {
                setError((err as any).error.message);
            }
        }
        setIsLoading(true);
        performLogin().finally(() => setIsLoading(false));
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
                            disabled={isLoading}
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
                        <div className="relative w-full">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                disabled={isLoading}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                                placeholder="Nhập mật khẩu của bạn"
                                required

                            />
                            <button type="button" className="absolute inset-y-0 end-0 flex items-center pe-3" onClick={() => setShowPassword(!showPassword)}>
                                {
                                    !showPassword ? (
                                        <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                                    )
                                }
                            </button>
                        </div>
                    </div>

                    {/* Hiển thị lỗi (nếu có) */}
                    {error && (
                        <p className="text-red-600 text-sm text-center -mt-2">{error}</p>
                    )}

                    {/* Nút Đăng nhập */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform active:scale-95 transition duration-200 ease-in-out shadow-md"
                        disabled={isLoading}
                    >
                        {isLoading ? (

                            <>
                                <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-gray-200 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2" />
                                </svg>
                                Đang đăng nhập...
                            </>
                        ) : 'Đăng nhập'}

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

