import { useEffect, useRef, useState } from "react";
import { BreakTimeType, GuestType, TimeData } from "../../types/salon";
import dayjs from "dayjs";
import { AxiosRequestConfig } from "axios";
import { privateApi } from "../../services/customAxios";
import { ListBtn, ListHead, UserList } from "../../components/table/Table";
import * as S from "../../styles/calender";

function SalonPending() {
  // 캘린더에서 선택한 DATE값
  const [clickDay, setClickDay] = useState<Value>();
  // 변경된 DATE 값
  const formattedDate = useRef<string>("");
  // 선택된 날의 시간 데이터
  const [timeData, setTimeData] = useState<TimeData[]>([]);
  // 선택된 시간
  const [selectedTime, setSelectedTime] = useState<string | TimeData>();
  // 기간이 전체인지 시간인지 스테이트
  const [allUser, setAllUser] = useState(true);
  // 선택된 날의 미승인 유저 리스트
  const [unreservedUser, setUnreservedUser] = useState<GuestType[]>([]);
  // 선택된 시간의 미승인 유저 리스트
  const [filterUser, setFilterUser] = useState<GuestType[]>([]);
  // 시간 별 인원 정리
  const [personnel, setPersonnel] = useState<string[]>([]);
  // 예약대기자 제목 스테이트
  const [head, setHead] = useState<string>();
  // 리스트 헤드, 데이터 틀
  const headList = [
    { value: "名前", col: "col-span-1" },
    { value: "時間", col: "col-span-1" },
    { value: "施術タイプ", col: "col-span-1" },
    { value: "承認処理", col: "col-span-1" },
  ];
  const dataList = [
    { value: "user_name", col: "col-span-1" },
    { value: "reservation_time", col: "col-span-1" },
    { value: "service_name", col: "col-span-1" },
    [
      {
        value: "承認",
        color: "bg-blue-400/90",
        onClick: (data: GuestType) => {
          if (window.confirm("승인하시겠습니까?")) {
            alert("승인되었습니다");
            patchData(data.id, true).then(() => {
              getData({
                status: "submit",
                r_date: formattedDate.current,
              });
            });
          } else {
            alert("취소되었습니다.");
          }
        },
      },
      {
        value: "断り",
        color: "bg-red-400/90",
        onClick: (data: GuestType) => {
          patchData(data.id, false).then(() => {
            if (window.confirm("거절하시겠습니까?")) {
              alert("거절되었습니다");
              getData({
                status: "submit",
                r_date: formattedDate.current,
              });
            } else {
              alert("취소되었습니다.");
            }
          });
        },
      },
    ],
  ];

  // 렌더링 할 시
  useEffect(() => {
    setClickDay(new Date());
  }, []);

  // 날짜 변경 시 발생 함수
  useEffect(() => {
    if (clickDay instanceof Date) {
      setSelectedTime("allTime");
      formattedDate.current = dayjs(clickDay).format("YYYY-MM-DD");
      getTimeData(formattedDate.current);
      setHead(formattedDate.current);
      getData({
        status: "submit",
        r_date: formattedDate.current,
      });
      setAllUser(true);
    }
  }, [clickDay]);

  // 시간 변경 시 발생 함수
  useEffect(() => {
    if (typeof selectedTime !== "string") {
      setHead(selectedTime?.time);
      setAllUser(false);
      const filter = unreservedUser.filter(
        (v) => v.reservation_time === selectedTime?.time
      );
      setFilterUser(filter);
    }
  }, [selectedTime]);

  // 예약 리스트 변경 시 발생 함수
  useEffect(() => {
    const pickTime: string[] = [];
    unreservedUser.map((v: GuestType) => {
      pickTime.push(v.reservation_time);
    });
    setPersonnel(pickTime);
  }, [unreservedUser]);

  //지정 날짜의 예약 리스트 가져오기
  const getData = async (data: GetTodayReservation) => {
    try {
      const config: AxiosRequestConfig = {
        params: data,
      };
      const reservationData = await privateApi.get(
        "/api/salon/reservation",
        config
      );
      setUnreservedUser(reservationData.data.reservations);
    } catch (error) {
      console.log(error);
    }
  };

  // 예약 승인/거절 요청하기
  const patchData = async (id: string, status: boolean) => {
    try {
      await privateApi.patch("/api/salon/reservation", {
        id: id,
        status: status,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // 해당 날짜 미용실 영업 시간 전체 가져오기
  const getTimeData = async (data: string) => {
    try {
      const getTime = await privateApi.get(`/api/salon/hour/${data}`);
      setTimeData(getTime.data.business_hours);
    } catch (error) {
      console.log(error);
    }
  };

  // 예약불가 시간 생성
  const postBreakData = async (data: string) => {
    try {
      await privateApi.post("/api/salon/break", {
        break_time: [data],
        date: formattedDate.current,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // 예약불가 시간 삭제
  const deleteBreakData = async (data: BreakTimeType) => {
    try {
      const config: AxiosRequestConfig = {
        params: data,
      };
      await privateApi.delete("/api/salon/break", config);
    } catch (error) {
      console.log(error);
    }
  };

  // 시간과 상태에 따른 버튼 값
  const breakBtn = () => {
    if (typeof selectedTime === "string") {
      return null;
    } else if (selectedTime?.available) {
      return (
        <ListBtn
          value="close"
          color="bg-red-400/90"
          onClick={() => {
            postBreakData(selectedTime.time).then(() => {
              getTimeData(formattedDate.current);
              setSelectedTime(formattedDate.current);
            });
          }}
        />
      );
    } else if (selectedTime?.available === false) {
      return (
        <ListBtn
          value="open"
          color="bg-sky-400/90"
          onClick={() => {
            deleteBreakData({
              break_time: [selectedTime.time],
              date: formattedDate.current,
            }).then(() => {
              getTimeData(formattedDate.current);
              setSelectedTime(formattedDate.current);
            });
          }}
        />
      );
    }
  };

  return (
    <div className="flex gap-10 h-full">
      <div className="flex flex-col">
        <S.CalendarBox>
          <S.StyleCalendar
            locale="en"
            onChange={setClickDay}
            value={clickDay}
            calendarType="US"
          />
        </S.CalendarBox>
        <div className="  text-black font-bold text-xl my-2 text-center">
          ⏱ 時間割
        </div>
        <div className="bg-white text-white rounded-lg grid grid-cols-4 text-center p-4 h-50 gap-4 overflow-auto shadow-lg">
          {timeData.map((v: TimeData) => {
            return (
              <div
                className={`${
                  v.available
                    ? "bg-cyan-500 hover:bg-cyan-600 hover:font-bold"
                    : "bg-gray-300 hover:bg-gray-400"
                } relative  p-1 rounded-md cursor-pointer shadow-lg`}
                onClick={() => {
                  setSelectedTime(v);
                }}
              >
                {v.time}
                {personnel.filter((item) => item === v.time).length > 0 ? (
                  <span className="absolute top-[-10px] right-[-10px] bg-sky-200 font-bold text-blue-400 rounded-full w-8 h-8 shadow-xl flex items-center justify-center">
                    {personnel.filter((item) => item === v.time).length}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex align-middle text-2xl font-bold tracking-tight m-2 text-black">
          <div className="flex-1">{head} 予約待ち</div>
          <div className="flex align-middle">{breakBtn()}</div>
        </div>
        <div className="bg-white rounded-2xl h-5/6 p-4 overflow-auto shadow-lg">
          <div className="grid grid-cols-4 text-center border-x border-black/10 shadow-lg overflow-hidden rounded-2xl">
            <ListHead headList={headList} />
            {allUser
              ? unreservedUser.map((user) => {
                  return <UserList user={user} dataList={dataList} />;
                })
              : filterUser.map((user) => {
                  return <UserList user={user} dataList={dataList} />;
                })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalonPending;
