import { useEffect, useState } from "react";
import { BusCategotyType } from "../../types/admin";
import { AxiosRequestConfig } from "axios";
import { privateApi } from "../../services/customAxios";
import ChoiceList from "../../components/admin/bus/ChoiceList";
import { ListBtn } from "../../components/table/Table";
import BusCategoryList from "../../components/admin/bus/BusCategoryList";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function BusTimeTable() {
  // 카테고리 생성 명 입력 값
  const [newCategoryName, setNewCategoryName] = useState("");
  // 카테고리 데이터
  const [category, setCategory] = useState<BusCategotyType[]>([]);
  // 학기/방학 스테이트
  const [semester, setSemester] = useState<number>(1);
  // 평일/주말 스테이트
  const [weekend, setWeekend] = useState<number>(1);
  // 노선 스테이트
  const [route, setRoute] = useState<string>("s_bokhyun");
  // 리스트
  const semesterList = [
    {
      state: 1,
      head: "学期",
    },
    {
      state: 0,
      head: "休み",
    },
  ];
  const weekendList = [
    {
      state: 0,
      head: "平日",
    },
    {
      state: 1,
      head: "週末",
    },
  ];
  const routeList = [
    { state: "s_bokhyun", head: "ボクヒョン -> 英語村" },
    { state: "s_english", head: "英語村 -> ボクヒョン" },
  ];

  const queryClient = useQueryClient();

  // 카테고리 리스트 get APi
  const getCategoryApi = async () => {
    const config: AxiosRequestConfig = {
      params: {
        semester: semester,
        weekend: weekend,
        bus_route_direction: route,
      },
    };
    const response = await privateApi.get("/api/bus/round", config);

    return response.data;
  };

  // 카테고리 추가 Api
  const createCategoryApi = async () => {
    const response = await privateApi.post("/api/bus/round", {
      round: newCategoryName,
      weekend: weekend,
      semester: semester,
      bus_route_direction: route,
    });

    return response.data;
  };

  // 카테고리 query
  const { data } = useQuery({
    queryKey: ["salonCategory", semester, weekend, route],
    queryFn: getCategoryApi,
  });

  useEffect(() => {
    if (data) setCategory(data.roundDate);
  }, [data]);

  // 카레고리 추가 mutation
  const { mutate: createCategoryMutation } = useMutation({
    mutationFn: createCategoryApi,
    // Api 연결 성공
    onSuccess() {
      setNewCategoryName("");
      queryClient.invalidateQueries({ queryKey: ["salonCategory"] });
    },
  });

  return (
    <div className="flex flex-col gap-6 p-2">
      <div className="flex gap-10">
        <ChoiceList
          head="1. 学期/休み"
          state={semester}
          setState={setSemester}
          list={semesterList}
        />
        <ChoiceList
          head="2. 平日/週末"
          state={weekend}
          setState={setWeekend}
          list={weekendList}
        />
      </div>
      <ChoiceList
        head="3. 路線"
        state={route}
        setState={setRoute}
        list={routeList}
      />
      <div>
        <div className="flex">
          <div className="flex-1 text-xl font-bold p-4 tracking-tighter">
            路線管理
          </div>
          <div className="flex gap-2 justify-end items-end">
            <div>
              <input
                type="text"
                className="p-2 w-32 rounded-lg text-center focus:outline-none focus:ring-2 focus:rounded-xl focus:ring-blue-500 shadow-md"
                placeholder="カテゴリ名"
                onChange={(e) => {
                  setNewCategoryName(e.target.value);
                }}
                value={newCategoryName}
              />
            </div>
            <div>
              <ListBtn
                value="生成"
                color="bg-blue-400/90"
                onClick={() => {
                  createCategoryMutation();
                }}
              />
            </div>
          </div>
        </div>
        {category.map((v) => {
          return (
            <BusCategoryList
              id={v.id}
              round={v.round}
              semester={semester}
              bus_route_direction={route}
              weekend={weekend}
            />
          );
        })}
      </div>
    </div>
  );
}

export default BusTimeTable;
