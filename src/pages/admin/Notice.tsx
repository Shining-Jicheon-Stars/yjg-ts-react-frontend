import { useEffect, useState } from "react";
import { NoticeListType, getNoticeDataType } from "../../types/post";
import { useNavigate } from "react-router-dom";
import { AxiosRequestConfig } from "axios";
import { privateApi } from "../../services/customAxios";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import CountCard from "../../components/salon/CountCard";
import SearchBar from "../../components/post/page/SearchBar";
import { ListBtn, ListHead, UserList } from "../../components/table/Table";
import LoadingPage from "../../components/LoadingPage";
import Pagination from "../../components/post/page/Pagination";

function Notice() {
  const headList = [
    { value: "タイトル", col: "col-span-4" },
    { value: "タグ", col: "col-span-1" },
    { value: "", col: "col-span-1" },
  ];
  const dataList = [
    { value: "title", col: "col-span-4" },
    { value: "tag", col: "col-span-1" },
    [
      {
        value: "照会",
        color: "bg-cyan-500",
        onClick: (user: NoticeListType) => {
          navigate(`/main/admin/reading/${user.id}`, {
            state: { type: "Post" },
          });
        },
      },
    ],
  ];
  // 공지사항 데이터 값
  const [noticeList, setNoticeList] = useState<NoticeListType[]>([]);
  // 태그 리스트
  const tagList = [
    { value: "", name: "タイトル" },
    { value: "admin", name: "行政" },
    { value: "salon", name: "美容室" },
    { value: "restaurant", name: "食堂" },
    { value: "bus", name: "バス" },
  ];
  // 공지사항 파라미터 값
  const [noticeParams, setNoticeParams] = useState<getNoticeDataType>({
    page: 1,
  });
  // 검색 바 태그 값
  const [tag, setTag] = useState("");
  // 검색 바 제목 값
  const [search, setSearch] = useState("");
  // 공지사항 페이지 값
  const [page, setPage] = useState(1);
  // 공지사항 마지막 페이지 값
  const [lastPage, setLastPage] = useState(8);
  // 금일 외박 신청 수
  const [sleepMember, setSleepMember] = useState(0);
  // 금일 외출 신청 수
  const [goMember, setGoMember] = useState(0);
  // 금일 회의실 예약 수
  const [roomReservation, setRoomReservation] = useState(0);
  // A/S 미처리 건 신청 수
  const [unprocessedCase, setUnprocessedCase] = useState(0);
  const navigate = useNavigate();

  // 검색 바 데이터 변경 시
  useEffect(() => {
    if (page === 1) {
      let data: getNoticeDataType = { page: 1 };
      if (tag) {
        data = { ...data, tag: tag };
      }
      if (search) {
        data = { ...data, title: search };
      }
      setNoticeParams(data);
    }
    setPage(1);
  }, [tag, search]);

  // 페이지 변경 시
  useEffect(() => {
    let data: getNoticeDataType = { page: page };
    if (tag) {
      data = { ...data, tag: tag };
    }
    if (search) {
      data = { ...data, title: search };
    }
    setNoticeParams(data);
  }, [page]);

  // 공지사항 데이터 get Api
  const getNoticeListApi = async () => {
    const config: AxiosRequestConfig = {
      params: noticeParams,
    };
    const response = await privateApi.get("/api/notice", config);
    return response.data;
  };

  // 외출, 외박 신청자 수 get Api
  const getOverNightCountApi = async () => {
    let currentDate = dayjs(new Date()).format("YYYY-MM-DD");
    const config: AxiosRequestConfig = { params: { date: currentDate } };
    const response = await privateApi.get("/api/absence/count", config);

    return response.data;
  };

  // 회의실 예약자 수 get Api
  const getReservationCountApi = async () => {
    let currentDate = dayjs(new Date()).format("YYYY-MM-DD");
    const config: AxiosRequestConfig = { params: { date: currentDate } };
    const response = await privateApi.get(
      "/api/meeting-room/reservation",
      config
    );

    return response.data;
  };

  // A/S 신청 수 get Api
  const getASCountApi = async () => {
    const config: AxiosRequestConfig = {
      params: { status: 0, page: 1 },
    };
    const response = await privateApi.get("/api/after-service", config);

    return response.data;
  };

  // 공지사항 데이터 query
  const { data: notice, isLoading } = useQuery({
    queryKey: ["noticeData", noticeParams],
    queryFn: getNoticeListApi,
  });

  useEffect(() => {
    if (notice) {
      setNoticeList(notice.notices.data);
      setLastPage(notice.notices.last_page);
    }
  }, [notice]);

  // 외출, 외박 신청자 query
  const { data: overNightCount } = useQuery({
    queryKey: ["overNightCountData"],
    queryFn: getOverNightCountApi,
  });

  useEffect(() => {
    if (overNightCount) {
      setGoMember(overNightCount.go_count);
      setSleepMember(overNightCount.sleep_count);
    }
  }, [overNightCount]);

  // 회의실 예약자 query
  const { data: reservationCount } = useQuery({
    queryKey: ["reservationCountData"],
    queryFn: getReservationCountApi,
  });

  useEffect(() => {
    if (reservationCount) {
      setRoomReservation(reservationCount.reservations.total);
    }
  }, [reservationCount]);

  // A/S 신청 수 query
  const { data: ASCount } = useQuery({
    queryKey: ["ASCountData"],
    queryFn: getASCountApi,
  });

  useEffect(() => {
    if (ASCount) {
      setUnprocessedCase(ASCount.after_services.total);
    }
  }, [ASCount]);

  return (
    <div className="flex gap-7 pr-10">
      <div className="flex flex-col ml-4">
        <CountCard header="外泊" count={sleepMember} />
        <CountCard header="外出" count={goMember} />
        <CountCard header="会議室" count={roomReservation} />
        <CountCard header="未処理A/S" count={unprocessedCase} />
      </div>
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center gap-4  font-bold text-3xl pr-4">
          <div>お知らせ</div>
          <div className="flex-1 flex justify-center">
            <SearchBar
              tag={tag}
              tagList={tagList}
              setTag={setTag}
              setSearch={setSearch}
            />
          </div>
          <ListBtn
            value="作成"
            color="bg-cyan-500/90"
            onClick={() => {
              navigate("/main/admin/writing", { state: { type: "Post" } });
            }}
          />
        </div>
        <div className="bg-white flex flex-col gap-2 p-4 h-full rounded-2xl overflow-auto shadow-lg">
          {isLoading ? (
            <LoadingPage />
          ) : (
            <div className="grid grid-cols-6 border-x border-black/10 shadow-lg overflow-hidden rounded-2xl">
              {<ListHead headList={headList} />}
              {noticeList.map((user) => {
                return <UserList user={user} dataList={dataList} />;
              })}
            </div>
          )}
          <div className="flex-1 justify-end flex flex-col gap-2">
            <Pagination page={page} setPage={setPage} lastPage={lastPage} />
            <div className="text-center font-bold text-xs">{`1 - ${lastPage}`}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notice;
