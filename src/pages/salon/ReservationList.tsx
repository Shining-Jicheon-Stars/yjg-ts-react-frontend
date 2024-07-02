import { useEffect, useState } from "react";
import { ReservationUserType } from "../../types/salon";
import dayjs from "dayjs";
import { AxiosRequestConfig } from "axios";
import { privateApi } from "../../services/customAxios";
import CountCard from "../../components/salon/CountCard";
import * as S from "../../styles/calender";
import { ListHead, UserList } from "../../components/table/Table";

function ReservationList() {
  //캘린더에서 선택한 DATE값
  const [clickDay, setClickDay] = useState<Value>();
  //예약이 승인된 유저 리스트
  const [reservationUser, setReservationUser] = useState<ReservationUserType[]>(
    []
  );
  //예약이 미승인된 유저 리스트
  const [unreservedUser, setUnreservedUser] = useState([]);
  //리스트 헤드, 데이터 틀
  const headList = [
    { value: "名前", col: "col-span-1" },
    { value: "電話番号", col: "col-span-2" },
    { value: "時間", col: "col-span-1" },
    { value: "施術タイプ", col: "col-span-2" },
  ];
  const dataList = [
    { value: "user_name", col: "col-span-1" },
    { value: "phone_number", col: "col-span-2", type: "phoneNum" },
    { value: "reservation_time", col: "col-span-1" },
    { value: "service_name", col: "col-span-2" },
  ];

  // 렌더링 할 시
  useEffect(() => {
    setClickDay(new Date());
  }, []);

  // 날짜 변경 시 발생
  useEffect(() => {
    if (clickDay instanceof Date) {
      const formattedData = dayjs(clickDay).format("YYYY-MM-DD");
      getData({
        status: "confirm",
        r_date: formattedData,
      });
      getData({
        status: "submit",
        r_date: formattedData,
      });
    }
  }, [clickDay]);

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
      if (data.status === "confirm") {
        //예약 승인 값
        setReservationUser(reservationData.data.reservations);
      } else if (data.status === "submit") {
        //예약 미승인 값
        setUnreservedUser(reservationData.data.reservations);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex gap-10">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between px-3 gap-6">
          <CountCard header="予約者" count={reservationUser.length} />
          <CountCard header="待機者" count={unreservedUser.length} />
        </div>
        <S.CalendarBox className="flex-auto">
          <S.StyleCalendar
            locale="en"
            onChange={setClickDay}
            value={clickDay}
            calendarType="US"
          />
        </S.CalendarBox>
      </div>

      <div className="flex-1">
        <div className="text-2xl font-bold mb-4 tracking-tighter text-left">
          予約確定リスト
        </div>
        <div className="bg-white p-5 h-full rounded-2xl overflow-auto shadow-lg">
          <div className="grid grid-cols-6 text-center  border-black/10 shadow-lg overflow-hidden rounded-2xl">
            <ListHead headList={headList} />
            {reservationUser.map((user) => {
              return <UserList user={user} dataList={dataList} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReservationList;
