import { useNavigate } from "react-router-dom";
import bigBusIcon from "../assets/bus-side-solid-full.png";
import adminIcon from "../assets/vector_admin.png";
import busIcon from "../assets/vector_bus.png";
import parentIcon from "../assets/vector_parent.png";
import { useApi } from "../contexts/apiConetxt";
import { path } from "../router";
import { Toast } from "../components/uiPart/ToastContainer";
import { useEffect } from "react";

// HomePage.tsx
//
const toast = Toast({
    defultDuration: 3000,
    position: 'top-right',
    customToasts: {
        success: ({ message }: { message: string }) => (
            <div
                id="toast-simple"
                className="flex items-center w-full max-w-sm p-4 text-body bg-neutral-primary-soft rounded-base shadow-xs border border-default"
                role="alert"
            >
                <svg
                    className="w-5 h-5 text-fg-brand"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="m12 18-7 3 7-18 7 18-7-3Zm0 0v-5"
                    />
                </svg>
                <div className="ms-2.5 text-sm border-s border-default ps-3.5">
                    Message sent successfully.
                </div>
                <button
                    type="button"
                    className="ms-auto flex items-center justify-center text-body hover:text-heading bg-transparent box-border border border-transparent hover:bg-neutral-secondary-medium focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded text-sm h-8 w-8 focus:outline-none"
                    data-dismiss-target="#toast-simple"
                    aria-label="Close"
                >
                    <span className="sr-only">Close</span>
                    <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18 17.94 6M18 18 6.06 6"
                        />
                    </svg>
                </button>
            </div>

        ),
        error: ({ message }: { message: string }) => (
            <div className="bg-red-500 text-white p-4 rounded shadow">
                {message}
            </div>
        ),
    },
});

export function HomePage() {
    const { api } = useApi();
    const navigate = useNavigate();
    useEffect(() => {
        if (!api.getSecurityData()) {
            navigate(path.LOGIN);
        }
    }, []);


    const roles = [
        {
            title: "Quản lý",
            description:
                "Quản lý toàn bộ hệ thống xe bus, lịch trình và giám sát hoạt động",
            icon: adminIcon,
            features: ["Quản lý xe Bus", "Lập lịch trình", "Theo dõi xe Bus"],
            buttonText: "Đăng nhập quản lý",
            path: path.ADMIN
        },
        {
            title: "Tài xế",
            description: "Xem lịch làm việc, danh sách học sinh và báo cáo tình trạng",
            icon: busIcon,
            features: ["Lịch làm việc", "Danh sách học sinh", "Báo cáo sự cố"],
            buttonText: "Đăng nhập tài xế",
            pat: path.DRIVER
        },
        {
            title: "Phụ huynh",
            description: "Theo dõi vị trí xe Bus của học sinh và nhận thông báo",
            icon: parentIcon,
            features: ["Liên hệ khẩn cấp", "Thông báo", "Theo dõi xe Bus"],
            buttonText: "Đăng nhập phụ huynh",
            path: path.PARENT
        },
    ];

    const renderItems = [];
    for (let i = 0; i < roles.length; i++) {
        renderItems.push(
            <div key={i} className="rounded-xl bg-white lg:max-w-80 min-w-30 p-5 shadow-2xl text-center">
                <img src={roles[i].icon} alt={roles[i].title} className="w-20 h-20 mb-4 mx-auto" />
                <div className="font-semibold text-[20px]">{roles[i].title}</div>
                <div className="text-[17px] text-[#421F06] py-5">{roles[i].description}</div>
                <button onClick={
                    () => {
                        const apiSecurityData = api.getSecurityData();
                        if (!apiSecurityData) {
                            // User is not logged in, navigate to login page
                            navigate(path.LOGIN, { state: { from: roles[i].path } });
                            return;
                        }


                        // NOTE: 4/11/2025 Uncomment the following lines to enable role-based access control
                        // Currently, all logged-in users can access any role for testing purposes
                        // if (!apiSecurityData.roles.includes(roles[i].title.toLowerCase())) {
                        //     alert("Bạn không có quyền truy cập vào khu vực này.");
                        //     return;
                        // }

                        navigate(roles[i].path);


                    }

                } className="bg-[#111827] text-[#FFFDFD] text-[15px] font-semibold my-5 px-10 py-3 rounded-xl">{roles[i].buttonText}</button>
            </div>
        );
    }

    return (
        <div className="bg-[#E0E7FF] w-full min-h-screen mx-auto px-4 py-16">
            <button onClick={() => {
                console.log("Toast success clicked");
                toast.success({ message: "Đăng nhập thành công!" });
            }}>Test Toast Success</button>
            <button onClick={() => {
                toast.error({ message: "Đăng nhập thất bại!" });
            }}>Test Toast Error</button>

            <div className="align-items-center text-center space-y-3">

                <img src={bigBusIcon} alt="bigBusIcon" className="w-20 h-20 mb-4 mx-auto" />
                <div className="font-bold text-[30px]">Hệ thống theo dõi xe Bus thông minh</div>
                <div className="font-semibold text-[26px] text-[#656BEB] my-8 -mt-3">SSB 1.0</div>
            </div>
            <div className="malign-items-center text-center x-10 mt-20 flex flex-col gap-5 lg:flex-row w-full place-content-evenly">
                {renderItems}
            </div>
        </div>
    );
}
