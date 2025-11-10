import { Card } from '../../components/uiItem/card.tsx';
import { Button } from "../../components/uiItem/button.tsx";

export function NotiPage() {
  return (
    <div className="flex flex-row bg-[#E0E7FF] w-full h-full overflow-scroll">
      <div className="my-5 mx-7 flex-1">
        <div>
          <Card className="p-5 flex flex-col gap-5 min-h-screen">
            <div className="flex flex-row gap-5 justify-between items-center">
              <Button variant="ghost" size="icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10.268 21a2 2 0 0 0 3.464 0" />
                  <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
                </svg>
              </Button>
              <span className="font-semibold text-[18px] w-16/20">Thông báo</span>
              <Button variant='ghost' size='icon' className='w-3/20 flex flex-row gap-3'>
                <span>Đã đọc tất cả</span>
              </Button>
            </div>
            <div className="flex flex-col gap-2 p-5 px-10 bg-[#FEFCE8] rounded-xl border-l-4 border-l-[#FACC15]">
              <div className="font-semibold">Xe bus sẽ đến đón trong 5 phút</div>
              <div><span>1 phút trước</span></div>
            </div>

            <div className="flex flex-col gap-2 p-5 px-10 bg-[#F0FDF4] rounded-xl border-l-4 border-l-[#4ADE80]">
              <div className="font-semibold">Học sinh đã lên xe an toàn</div>
              <div><span>1 phút trước</span></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
