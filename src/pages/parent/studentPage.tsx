import { Card } from '../../components/uiItem/card.tsx';
import TeamLogo from "../../assets/vector_parent.png";

export function StudentPage() {
  return (
    <div className="flex flex-row bg-[#E0E7FF] w-full h-full overflow-scroll">
      <div className="my-5 mx-7 flex-1">
        <Card>
          <div className="my-5">
            <div className="font-semibold text-xl m-5">Thông tin học sinh</div>
            <div className="justify-between  border-3 border-[#8fd67c] rounded-xl m-5 flex flex-row gap-5 items-center">
              <img src={TeamLogo} className="w-12 h-12 m-4" />
              <div className="w-8/10">
                <div className="font-semibold text-[20px]">Dương Tùng Thiện</div>
                <div className="">Con ngoan của mẹ</div>
              </div>
            </div>
          </div>
        </Card>
        <p>Maybe we should not show this page on parent module</p>
      </div>
    </div>
  )
}
