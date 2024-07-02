import { useEffect, useState } from "react";
import { BusScheduleListType, ScheduleType } from "../../../types/admin";
import { ListBtn, ListHead } from "../../table/Table";
import PlusIcon from "../../../icons/PlusIcon";
import { privateApi } from "../../../services/customAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function BusScheduleList(props: BusScheduleListType) {
  const { schedule, id } = props;
  const headList = [
    { value: "駅の名前", col: "col-span-1" },
    { value: "時間", col: "col-span-1" },
    { value: "", col: "col-span-1" },
  ];

  const queryClient = useQueryClient();

  // 스케줄 생성 상태
  const [createSchedule, setCreateSchedule] = useState(false);
  // 새로운 역 명
  const [newStation, setNewStation] = useState("");
  // 새로운 시간 값
  const [newTime, setNewTime] = useState("");

  // 생성 칸 열릴 시 초기화 작업
  useEffect(() => {
    setNewStation("");
    setNewTime("");
  }, [createSchedule]);

  // 스케줄 생성 Api
  const createScheduleApi = async () => {
    const response = await privateApi.post("/api/bus/schedule", {
      round_id: id,
      station: newStation,
      bus_time: newTime,
    });

    return response.data;
  };

  // 스케줄 생성 mutation
  const { mutate: createScheduleMutation } = useMutation({
    mutationFn: createScheduleApi,
    // Api 연결 성공
    onSuccess() {
      setCreateSchedule(false);
      queryClient.invalidateQueries({ queryKey: ["salonSchedule"] });
    },
  });

  return (
    <>
      <div className="bg-white relative grid grid-cols-3 mt-2 text-center border-x border-black/10 shadow-lg overflow-hidden rounded-2xl">
        {<ListHead headList={headList} />}
        <div className="absolute right-0 pt-1 pr-2">
          <PlusIcon
            onClick={() => {
              setCreateSchedule(true);
            }}
          />
        </div>
        {createSchedule ? (
          <>
            <input
              id="name"
              type="text"
              value={newStation}
              onChange={(e) => {
                setNewStation(e.target.value);
              }}
              className="p-2 mx-5 my-3 text-center font-bold text-xl border border-black rounded-md"
            />
            <input
              id="value"
              type="text"
              value={newTime}
              onChange={(e) => {
                setNewTime(e.target.value);
              }}
              className="p-2 mx-5 my-3 text-center font-bold text-xl border border-black rounded-md"
            />
            <div className="flex gap-3 items-center justify-center">
              <ListBtn
                value="生成"
                color="bg-blue-400/90"
                onClick={() => {
                  createScheduleMutation();
                }}
              />
              <ListBtn
                value="キャンセル"
                color="bg-red-400/90"
                onClick={() => {
                  setCreateSchedule(false);
                }}
              />
            </div>
          </>
        ) : null}
        {schedule.map((schedule) => {
          return <ScheduleList schedule={schedule} />;
        })}
      </div>
    </>
  );
}

export default BusScheduleList;

function ScheduleList(props: { schedule: ScheduleType }) {
  const { schedule } = props;
  // 수정 상태
  const [onModify, setOnModify] = useState(false);
  // 수정된 역이름
  const [newStation, setNewStation] = useState("");
  // 수정된 시간
  const [newTime, setNewTime] = useState("");

  const queryClient = useQueryClient();

  // 스케줄 삭제 Api
  const deleteScheduleApi = async (id: string) => {
    const response = await privateApi.delete(`/api/bus/schedule/${id}`);

    return response.data;
  };

  // 스케줄 수정 Api
  const patchScheduleApi = async (id: string) => {
    const response = await privateApi.patch(`/api/bus/schedule/update/${id}`, {
      station: newStation,
      bus_time: newTime,
    });

    return response.data;
  };

  // 스케줄 삭제 mutation
  const { mutate: deleteScheduleMutation } = useMutation({
    mutationFn: deleteScheduleApi,
    // Api 연결 성공
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["salonSchedule"] });
    },
  });

  // 스케줄 수정 mutation
  const { mutate: patchScheduleMutation } = useMutation({
    mutationFn: patchScheduleApi,
    // Api 연결 성공
    onSuccess() {
      setOnModify(false);
      queryClient.invalidateQueries({ queryKey: ["salonSchedule"] });
    },
  });

  return (
    <>
      {onModify ? (
        <>
          <div className="border-b border-r py-5 px-6 font-semibold text-lg">
            <input
              type="text"
              className="flex-1 border-b border-black/20 text-center outline-none"
              value={newStation}
              onChange={(e) => {
                setNewStation(e.target.value);
              }}
            />
          </div>
          <div className="border-b border-r py-5 px-6 font-semibold text-lg">
            <input
              type="text"
              className="flex-1 border-b border-black/20 text-center outline-none"
              value={newTime}
              onChange={(e) => {
                setNewTime(e.target.value);
              }}
            />
          </div>
          <div className="m-auto border-b py-4 w-full space-x-5 text-center">
            <ListBtn
              value="修正完了"
              color="bg-sky-400/90"
              onClick={() => {
                patchScheduleMutation(schedule.id);
              }}
            />
            <ListBtn
              value="キャンセル"
              color="bg-red-400/90"
              onClick={() => {
                setOnModify(false);
              }}
            />
          </div>
        </>
      ) : (
        <>
          <div className="border-b border-r py-5 px-6 font-semibold text-lg">
            {schedule.station}
          </div>
          <div className="border-b border-r py-5 px-6 font-semibold text-lg">
            {schedule.bus_time}
          </div>
          <div className="m-auto border-b py-4 w-full space-x-5 text-center">
            <ListBtn
              value="修正"
              color="bg-sky-400/90"
              onClick={() => {
                setOnModify(true);
                setNewStation(schedule.station);
                setNewTime(schedule.bus_time);
              }}
            />
            <ListBtn
              value="削除"
              color="bg-red-400/90"
              onClick={() => {
                deleteScheduleMutation(schedule.id);
              }}
            />
          </div>
        </>
      )}
    </>
  );
}
