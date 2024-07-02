import { useEffect, useState } from "react";
import { TodayMenuType } from "../../types/restaurant";
import dayjs from "dayjs";
import { AxiosRequestConfig } from "axios";
import { privateApi } from "../../services/customAxios";
import TodayPlan from "../../components/restaurant/main/TodayPlan";
import WeekendApplication from "../../components/restaurant/main/WeekendApplication";
import ApplicationSettings from "../../components/restaurant/main/applicationSet/ApplicationSettings";

function Restaurant() {
  // 당일 식단표
  const [todayMenu, setTodayMenu] = useState<TodayMenuType[]>([]);

  // 페이지 렌더링 시
  useEffect(() => {
    getMenuData();
  }, []);

  // 당일 식단표 가져오기
  const getMenuData = async () => {
    try {
      const today = dayjs(new Date()).format("YYYY-MM-DD");
      const config: AxiosRequestConfig = {
        params: { date: today },
      };
      const menuData = await privateApi.get(
        "/api/restaurant/menu/get/d",
        config
      );
      setTodayMenu(menuData.data.month_menus);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-10">
        <div>
          <div className="font-bold text-lg pl-4 pb-2">• 本日の献立表</div>
          <div className="bg-white min-w-[34rem] flex gap-2 shadow-lg px-5 py-4 border border-black/10 rounded-xl min-h-72">
            {todayMenu.length > 0 ? (
              todayMenu.map((v) => {
                return <TodayPlan meal_time={v.meal_time} menu={v.menu} />;
              })
            ) : (
              <div className="m-auto px-10 font-bold text-gray-400 text-xl text-center">
                本日の献立表はありません。
              </div>
            )}
          </div>
        </div>
        <WeekendApplication />
      </div>
      <ApplicationSettings />
    </div>
  );
}

export default Restaurant;
