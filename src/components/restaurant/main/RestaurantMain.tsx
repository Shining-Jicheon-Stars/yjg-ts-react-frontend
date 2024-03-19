import dayjs from "dayjs";
import { customAxios } from "../../../services/customAxios";
import { useEffect, useState } from "react";
import { AxiosRequestConfig } from "axios";
import { TodayMenuType } from "../../../types/restaurant";
import TodayPlan from "./TodayPlan";
import WeekendApplication from "./WeekendApplication";
import ApplicationSettings from "./ApplicationSettings";

function RestaurantMain() {
  // 당일 식단표
  const [todayMenu, setTodayMenu] = useState<TodayMenuType[]>([]);

  // 페이지 렌더링 시
  useEffect(() => {
    getMenuData();
    console.log(todayMenu);
  }, []);

  // 당일 식단표 가져오기
  const getMenuData = async () => {
    try {
      const today = dayjs(new Date()).format("YYYY-MM-DD");
      const config: AxiosRequestConfig = {
        params: { date: today },
      };
      const menuData = await customAxios.get(
        "/api/restaurant/menu/get/d",
        config
      );
      setTodayMenu(menuData.data.month_menus);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col gap-20 p-4">
      <div className="flex gap-24">
        <div>
          <div className="font-bold text-lg pl-4 pb-2">• 금일 식단표</div>
          <div className="flex gap-10 shadow-lg px-8 py-5 border border-black/10 rounded-xl">
            {todayMenu.length > 0 ? (
              todayMenu.map((v) => {
                return <TodayPlan meal_time={v.meal_time} menu={v.menu} />;
              })
            ) : (
              <div className="py-20 px-10 font-bold text-gray-400 text-xl">
                금일 식단표가 없습니다.
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

export default RestaurantMain;