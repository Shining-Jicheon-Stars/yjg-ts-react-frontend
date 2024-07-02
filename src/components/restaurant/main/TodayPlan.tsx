import { TodayMenuType } from "../../../types/restaurant";

function TodayPlan(props: TodayMenuType) {
  const { meal_time, menu } = props;
  // 메뉴 배열화
  const menuArray = menu.split(" ");
  // 시간대 확인 객체
  const switchTime = () => {
    switch (meal_time) {
      case "b":
        return "朝食";
      case "l":
        return "中食";
      case "d":
        return "夕食";
    }
  };

  return (
    <div className="flex flex-col text-center font-bold text-base p-3 tracking-tighter">
      <div className="w-full border-b-2 border-cyan-500 min-w-32 mb-4 text-xl">
        {switchTime()}
      </div>
      {menuArray.map((v) => {
        return <div>{v}</div>;
      })}
    </div>
  );
}

export default TodayPlan;
