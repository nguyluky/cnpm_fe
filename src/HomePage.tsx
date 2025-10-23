import { useNavigate } from "react-router-dom";
import bigBusIcon from "./assets/bus-side-solid-full.png";
import adminIcon from "./assets/vector_admin.png";
import busIcon from "./assets/vector_bus.png";
import parentIcon from "./assets/vector_parent.png";

// HomePage.tsx

export function HomePage() {
  const navigate = useNavigate();
  const roles = [
    {
      title: "Quản lý",
      description:
        "Quản lý toàn bộ hệ thống xe bus, lịch trình và giám sát hoạt động",
      icon: adminIcon,
      features: ["Quản lý xe Bus", "Lập lịch trình", "Theo dõi xe Bus"],
      buttonText: "Đăng nhập quản lý",
    },
    {
      title: "Tài xế",
      description: "Xem lịch làm việc, danh sách học sinh và báo cáo tình trạng",
      icon: busIcon,
      features: ["Lịch làm việc", "Danh sách học sinh", "Báo cáo sự cố"],
      buttonText: "Đăng nhập tài xế",
    },
    {
      title: "Phụ huynh",
      description: "Theo dõi vị trí xe Bus của học sinh và nhận thông báo",
      icon: parentIcon,
      features: ["Liên hệ khẩn cấp", "Thông báo", "Theo dõi xe Bus"],
      buttonText: "Đăng nhập phụ huynh",
    },
  ];

  const renderItems = [];
  for (let i = 0; i < roles.length; i++) {
    renderItems.push(
      <div key={i} className="rounded-xl bg-white max-w-80 p-5 shadow-2xl text-center">
        <img src={roles[i].icon} alt={roles[i].title} className="w-20 h-20 mb-4 mx-auto" />
        <div className="font-semibold text-[20px]">{roles[i].title}</div>
        <div className="text-[17px] text-[#421F06] py-5">{roles[i].description}</div>
        <button onClick={() => navigate('/login')} className="bg-[#111827] text-[#FFFDFD] text-[15px] font-semibold my-5 px-10 py-3 rounded-xl">{roles[i].buttonText}</button>
      </div>
    );
  }

  return (
    <div className="bg-[#E0E7FF] w-full min-h-screen mx-auto px-4 py-16">

      <div className="align-items-center text-center space-y-3">

        <img src={bigBusIcon} alt="bigBusIcon" className="w-20 h-20 mb-4 mx-auto" />
        <div className="font-bold text-[30px]">Hệ thống theo dõi xe Bus thông minh</div>
        <div className="font-semibold text-[26px] text-[#656BEB] my-8 -mt-3">SSB 1.0</div>
      </div>
      <div className="malign-items-center text-center x-10 flex flex-row place-content-evenly">
        {renderItems}
      </div>
    </div>
  );
}
