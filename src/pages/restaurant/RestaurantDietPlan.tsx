import { useEffect, useState } from "react";
import { privateApi } from "../../services/customAxios";
import ModalAddPlan from "../../components/restaurant/dietPlan/ModalAddPlan";
import cook from "../../assets/cook.png";
import { ListBtn } from "../../components/table/Table";
import ExcelCard from "../../components/restaurant/dietPlan/ExcelCard";
import { AxiosRequestConfig } from "axios";
import { useQuery } from "@tanstack/react-query";
import { ExcelPlanType } from "../../types/restaurant";
import CloseIcon from "../../icons/CloseIcon";
import TodayPlan from "../../components/restaurant/main/TodayPlan";

function RestaurantDietPlan() {
  // 모달창 상태
  const [onModal, setOnModal] = useState<boolean>(false);
  // 시간 데이터
  const [year, setYear] = useState<string[]>([]);
  // 선택된 년도
  const [selectedYear, setSelectedYear] = useState<string>("");
  // 리스트종류 스테이트
  const [month, setMonth] = useState<string>("01");
  const months = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  // 식단표 데이터
  const [weekPlan, setWeekPlan] = useState<ExcelPlanType[][]>([]);
  // 선택된 식단표
  const [selectedWeekPlan, setSelectedWeekPlan] = useState<ExcelPlanType[]>();

  // 페이지 랜더링할 시
  useEffect(() => {
    getYearData();
  }, []);

  // 년도 값 넣을 시
  useEffect(() => {
    setSelectedYear(year[0]);
  }, [year]);

  // 식단표 년도 가져오기
  const getYearData = async () => {
    try {
      const yearData = await privateApi.get("/api/restaurant/menu/get/year");
      setYear(yearData.data.years);
    } catch (error) {
      console.log(error);
    }
  };

  // 식단표 1주치 get Api
  const getWeekPlan = async () => {
    const config: AxiosRequestConfig = {
      params: { year: selectedYear, month: month },
    };
    const response = await privateApi.get("/api/restaurant/menu/get/w", config);

    return response.data;
  };

  // 식단표 1주치 query
  const { data } = useQuery({
    queryKey: ["weekPlan", selectedYear, month],
    queryFn: getWeekPlan,
  });
  useEffect(() => {
    if (data) {
      setWeekPlan(data.week_menus);
    }
  }, [data]);

  return (
    <div className="relative h-full flex flex-col">
      {selectedWeekPlan ? (
        <div
          className="absolute z-10 bg-white rounded-xl shadow-lg p-10 w-10/12 left-1/2 -translate-x-1/2 overflow-scroll h-full
        "
        >
          <div className="absolute right-1 top-1">
            <CloseIcon
              onClick={() => {
                setSelectedWeekPlan(undefined);
              }}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {selectedWeekPlan.map((data) => {
              return (
                <div className="border p-5 rounded-md">
                  <div>{data.date}</div>
                  <TodayPlan meal_time={data.meal_time} menu={data.menu} />
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
      {onModal ? <ModalAddPlan setOnModal={setOnModal} /> : null}
      <div className="flex gap-10 mt-4 ml-4 items-center">
        <div className="font-bold text-3xl">献立表の管理</div>
        <select
          className="outline-none focus:outline-none px-4 py-1 bg-transparent font-bold text-xl border-b-2 border-black"
          value={selectedYear}
          onChange={(e) => {
            setSelectedYear(e.target.value);
          }}
        >
          {year.map((item, i) => (
            <option value={item} key={i}>
              {item}
            </option>
          ))}
        </select>
        <div className="flex gap-3 items-end">
          {months.map((v) => {
            return (
              <div className="relative">
                <span
                  className={`${
                    month === v
                      ? "relative font-bold text-3xl text-purple-500"
                      : "text-gray-400 text-2xl hover:text-purple-400"
                  } cursor-pointer`}
                  onClick={() => {
                    setMonth(v);
                  }}
                >
                  {v}
                </span>
                <div className="absolute -right-2 top-0 -translate-y-10 w-12">
                  {month === v ? (
                    <img src={cook} alt="cookLogo" className="h-full w-full" />
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex-1 text-right">
          <ListBtn
            value="献立表追加"
            color="bg-blue-400/90"
            onClick={() => {
              setOnModal(true);
            }}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-7 p-10 mt-4">
        {weekPlan.map((data, index) => {
          if (data) {
            return (
              <ExcelCard
                data={data}
                index={index}
                year={selectedYear}
                month={month}
                setSelctedData={setSelectedWeekPlan}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

export default RestaurantDietPlan;
