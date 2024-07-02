import { useEffect, useRef, useState } from "react";
import { ReservationList, RoomType } from "../../types/admin";
import dayjs from "dayjs";
import { privateApi } from "../../services/customAxios";
import { AxiosRequestConfig } from "axios";
import * as S from "../../styles/calender";
import RoomState from "../../components/admin/room/RoomState";
import { ListBtn } from "../../components/table/Table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function MeetingRoom() {
  // 캘린더에서 선택한 DATE값
  const [clickDay, setClickDay] = useState<Value>(new Date());
  // formatted date 값
  let formattedDate = useRef<string>();
  // 회의실 목록
  const [rooms, setRooms] = useState<RoomType[]>([]);
  // 선택된 회의실
  const [room, setRoom] = useState<RoomType>();
  // 선택한 버튼 종류
  const [selectedBtn, setSelectedBtn] = useState<{
    room: string;
    fucKind: string;
  }>();
  // 카테고리 생성 명 입력 값
  const [newRoomName, setNewRoomName] = useState<string | number>("");
  // 선택된 회의실, 날짜에 맞는 예약 리스트
  const [reservationList, setReservationList] = useState<ReservationList[]>([]);
  // 전체 시간 값
  const allTime: string[] = Array.from({ length: 24 }, (_, index) => {
    const hour = index.toString().padStart(2, "0");
    return `${hour}:00`;
  });
  const queryClient = useQueryClient();

  // 회의실 선택할 시
  useEffect(() => {
    if (clickDay instanceof Date) {
      formattedDate.current = dayjs(clickDay).format("YYYY-MM-DD");
    }
  }, [clickDay]);

  // 회의실 데이터 얻을 시
  useEffect(() => {
    if (selectedBtn?.fucKind === "create") {
      rooms.map((v) => {
        if (v.room_number === selectedBtn.room) {
          setRoom(v);
        }
      });
    } else if (selectedBtn?.fucKind === "delete") {
      rooms.map((v) => {
        if (v.room_number === selectedBtn.room) {
          setRoom(v);
        }
      });
    } else if (selectedBtn?.fucKind === "patch") {
      rooms.map((v) => {
        if (v.room_number === selectedBtn.room) {
          setRoom(v);
        }
      });
    } else {
      setRoom(rooms[0]);
    }
  }, [rooms]);

  // 회의실 목록 get Api
  const getRoomApi = async () => {
    const response = await privateApi.get("/api/meeting-room");

    return response.data;
  };

  // 회의실 추가 Api
  const createRoomApi = async () => {
    const response = await privateApi.post("/api/meeting-room", {
      room_number: newRoomName,
    });

    return response.data;
  };

  // 회의실 삭제 Api
  const deleteRoomApi = async () => {
    const response = await privateApi.delete(
      `/api/meeting-room/${room?.room_number}`
    );

    return response.data;
  };

  // 회의실 상태 수정 Api
  const patchRoomApi = async (data: number) => {
    const response = await privateApi.patch(
      `/api/meeting-room/${room?.room_number}`,
      {
        open: data,
      }
    );

    return response.data;
  };

  // 회의실 예약자 리스트 get Api
  const getReservationListAPi = async () => {
    const config: AxiosRequestConfig = {
      params: {
        date: formattedDate.current,
        room_number: room?.room_number,
      },
    };
    const response = await privateApi.get(
      "/api/meeting-room/reservation",
      config
    );

    return response.data;
  };

  // 회의실 예약 거절 Api
  const patchReservationApi = async (id: string) => {
    const response = await privateApi.patch(
      `/api/meeting-room/reservation/reject/${id}`
    );

    return response.data;
  };

  // 회의실 목록 query
  const { data: meetingRoom } = useQuery({
    queryKey: ["roomData"],
    queryFn: getRoomApi,
  });

  useEffect(() => {
    if (meetingRoom) {
      setRooms(meetingRoom.meeting_rooms);
    }
  }, [meetingRoom]);

  // 회의실 추가 mutation
  const { mutate: createRoomMutation } = useMutation({
    mutationFn: createRoomApi,
    // Api 연결 성공
    onSuccess() {
      let state = { room: String(newRoomName), fucKind: "create" };
      setSelectedBtn(state);
      setNewRoomName("");
      queryClient.invalidateQueries({ queryKey: ["roomData"] });
    },
  });

  // 회의실 삭제 mutation
  const { mutate: deleteRoomMutation } = useMutation({
    mutationFn: deleteRoomApi,
    // Api 연결 성공
    onSuccess() {
      let state = { room: rooms[0].room_number, fucKind: "delete" };
      setSelectedBtn(state);
      queryClient.invalidateQueries({ queryKey: ["roomData"] });
    },
  });

  // 회의실 상태 수정 mutation
  const { mutate: patchRoomMutation } = useMutation({
    mutationFn: patchRoomApi,
    // Api 연결 성공
    onSuccess() {
      if (room) {
        let state = { room: room?.room_number, fucKind: "patch" };
        setSelectedBtn(state);
        queryClient.invalidateQueries({ queryKey: ["roomData"] });
      }
    },
  });

  // 회의실 예약자 리스트 query
  const { data: reservationLists } = useQuery({
    queryKey: ["reservationList", clickDay, room],
    queryFn: getReservationListAPi,
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (reservationLists)
      setReservationList(reservationLists.reservations.data);
  }, [reservationLists]);

  // 회의실 예약자 거절 mutation
  const { mutate: patchReservaionListMutation } = useMutation({
    mutationFn: patchReservationApi,
    // Api 연결 성공
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["reservationList"] });
    },
  });

  // 예약시간에 맞는 이름 반환
  const reservations = () => {
    return allTime.map((time) => {
      const matchingReservation = reservationList.find((reservation) => {
        const sTime = parseInt(reservation.reservation_s_time.split(":")[0]);
        const eTime = parseInt(reservation.reservation_e_time.split(":")[0]);
        const currentTime = parseInt(time.split(":")[0]);
        return sTime <= currentTime && eTime >= currentTime;
      });
      if (matchingReservation) {
        return (
          <div className="flex items-center gap-5 font-bold text-lg">
            <div className="bg-yellow-200 rounded-md p-1">⏰ {time}</div>
            <div>{matchingReservation.user.name}</div>
          </div>
        );
      } else {
        return (
          <div className="flex gap-5 font-bold text-lg">
            <div>⏰ {time}</div>
            <div></div>
          </div>
        );
      }
    });
  };

  return (
    <div className="flex">
      <div className="flex flex-col gap-6">
        <S.CalendarBox className="flex-auto">
          <S.StyleCalendar
            locale="en"
            onChange={setClickDay}
            value={clickDay}
            calendarType="US"
          />
        </S.CalendarBox>
        <div className="bg-white rounded-md relative h-[440px] p-2 py-4 border-2 border-sky-900/30 shadow-lg">
          <div className="absolute right-24 -translate-y-12 font-bold text-xl px-4">
            会議室の利用状況
          </div>
          <div className="grid grid-cols-2 gap-6 px-6 py-2 text-center overflow-auto max-h-full">
            {rooms.map((v) => {
              return <RoomState room={v} setRoom={setRoom} />;
            })}
          </div>
        </div>
        <div className="flex gap-2 justify-center items-end">
          <div>
            <input
              type="text"
              className="p-2 w-32 text-center ring-2 rounded-2xl focus:outline-none focus:ring-2 focus:rounded-xl focus:ring-blue-500 shadow-md"
              placeholder="会議室の号室"
              onChange={(e) => {
                setNewRoomName(e.target.value);
              }}
              value={newRoomName}
            />
          </div>
          <div>
            <ListBtn
              value="生成"
              color="bg-blue-400/90"
              onClick={() => {
                createRoomMutation();
              }}
            />
          </div>
        </div>
      </div>

      <div className=" flex-1 h-[760px] p-8 mx-16 my-4 bg-white rounded-xl overflow-auto shadow-lg">
        <div className="flex border-b-4 border-blue-600/50 mb-10 p-2">
          <div className="flex-1 font-bold text-2xl">
            <span className="text-blue-700/70 text-3xl">
              {room?.room_number}号
            </span>{" "}
            予約者リスト
          </div>
          {room?.open ? (
            <div className="flex gap-3">
              <ListBtn
                value="close"
                color="bg-orange-400/90"
                onClick={() => {
                  patchRoomMutation(0);
                }}
              />

              <ListBtn
                value="削除"
                color="bg-red-400/90"
                onClick={() => {
                  deleteRoomMutation();
                }}
              />
            </div>
          ) : null}
        </div>
        {room?.open ? (
          <div className="grid grid-cols-3 gap-10">{reservations()}</div>
        ) : (
          <div className="flex gap-3 justify-center">
            <ListBtn
              value="open"
              color="bg-orange-400/90"
              onClick={() => {
                patchRoomMutation(1);
              }}
            />

            <ListBtn
              value="削除"
              color="bg-red-400/90"
              onClick={() => {
                deleteRoomMutation();
              }}
            />
          </div>
        )}
        {reservationList.length > 0 ? (
          <div className="font-bold text-xl mt-4 text-blue-700">
            予約者リスト
          </div>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {reservationList.map((v) => {
            return (
              <div className="flex gap-3 items-center justify-center p-2 font-bold border-b-2 border-red-300">
                <div className="text-lg mr-2">🔑 {v.user.name}</div>
                <div className="text-lg flex-1 ">
                  {` ${v.reservation_s_time} ~ ${v.reservation_e_time.substring(
                    0,
                    3
                  )}59`}
                </div>
                <ListBtn
                  value="予約お断り"
                  color="bg-red-400"
                  onClick={() => {
                    patchReservaionListMutation(v.id);
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MeetingRoom;
