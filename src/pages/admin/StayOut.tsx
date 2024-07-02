import { useEffect, useRef, useState } from "react";
import { AbsenceListType, GetAbsenceDataType } from "../../types/admin";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { AxiosRequestConfig } from "axios";
import { privateApi } from "../../services/customAxios";
import CountCard from "../../components/salon/CountCard";
import * as S from "../../styles/calender";
import SearchBar from "../../components/post/page/SearchBar";
import { ListHead, UserList } from "../../components/table/Table";
import Pagination from "../../components/post/page/Pagination";
import { useQuery } from "@tanstack/react-query";
import LoadingPage from "../../components/LoadingPage";

function StayOut() {
  const headList = [
    { value: "学番", col: "col-span-1" },
    { value: "名前", col: "col-span-1" },
    { value: "外出日", col: "col-span-2" },
    { value: "", col: "col-span-1" },
  ];
  const dataList = [
    { value: "student_id", col: "col-span-1" },
    { value: "user_name", col: "col-span-1" },
    { value: "start_date", col: "col-span-2" },
    [
      {
        value: "照会",
        color: "bg-cyan-500",
        onClick: (user: AbsenceListType) => {
          navigate(`/main/admin/reading/${user.id}`, {
            state: { type: "Absence" },
          });
        },
      },
    ],
  ];
  //캘린더에서 선택한 DATE값
  const [clickDay, setClickDay] = useState<Value>(new Date());
  const formattedDate = useRef<string>("2024-01-01");
  // 리스트종류 스테이트
  const [listKind, setListKind] = useState("sleep");
  const kind = [
    {
      state: "sleep",
      head: "外泊",
    },
    {
      state: "go",
      head: "外出",
    },
  ];
  // 외박,외출 데이터 값
  const [absence, setAbsence] = useState<AbsenceListType[]>([]);
  // 외출, 외박 파라미터 값
  const [absenceParams, setAbsenceParams] = useState<GetAbsenceDataType>({
    type: kind[0].state,
    page: 1,
    date: formattedDate.current,
  });
  // 태그 리스트
  const tagList = [{ value: "name", name: "名前" }];
  // 검색 바 태그 값
  const [tag, setTag] = useState("");
  // 검색 바 제목 값
  const [search, setSearch] = useState("");
  // A/S 글 페이지 값
  const [page, setPage] = useState(1);
  // A/S 마지막 페이지 값
  const [lastPage, setLastPage] = useState(1);
  // 해당 일 외박 신청 수
  const [sleepMember, setSleepMember] = useState(0);
  // 해당 일 외출 신청 수
  const [goMember, setGoMember] = useState(0);
  const navigate = useNavigate();

  // 외박, 외출 상태 변경 시
  useEffect(() => {
    setPage(1);
    setSearch("");
    setAbsenceParams({
      type: listKind,
      page: 1,
      date: formattedDate.current,
    });
  }, [listKind]);

  // 날짜 변경 시 발생
  useEffect(() => {
    if (clickDay instanceof Date) {
      formattedDate.current = dayjs(clickDay).format("YYYY-MM-DD");
      setAbsenceParams({
        type: listKind,
        page: 1,
        date: formattedDate.current,
      });
    }
  }, [clickDay]);

  // 검색 바 데이터 변경 시
  useEffect(() => {
    if (page === 1) {
      let data: GetAbsenceDataType = {
        page: 1,
        type: listKind,
        date: formattedDate.current,
      };
      if (search) {
        data = { ...data, user_name: search };
      }
      setAbsenceParams(data);
    }
    setPage(1);
  }, [search]);

  // 페이지 변경 시
  useEffect(() => {
    let data: GetAbsenceDataType = {
      page: page,
      type: listKind,
      date: formattedDate.current,
    };

    if (search) {
      data = { ...data, user_name: search };
    }
    setAbsenceParams(data);
  }, [page]);

  // 외출, 외박 목록 get Api
  const getAbsenceApi = async () => {
    const config: AxiosRequestConfig = {
      params: absenceParams,
    };
    const response = await privateApi.get("/api/absence", config);

    return response.data;
  };

  // 외출, 외박 신청자 수 get Api
  const getOverNightCountApi = async () => {
    const config: AxiosRequestConfig = {
      params: { date: formattedDate.current },
    };
    const response = await privateApi.get("/api/absence/count", config);

    return response.data;
  };

  // 외출, 외박 목록 query
  const { data: ASList, isLoading } = useQuery({
    queryKey: ["ASListData"],
    queryFn: getAbsenceApi,
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (ASList) {
      setAbsence(ASList.absence_lists.data);
      setLastPage(ASList.absence_lists.last_page);
    }
  }, [ASList]);

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

  return (
    <div className="flex gap-7">
      <div className="flex-col">
        <div className="flex justify-between px-3 gap-6">
          <CountCard header="外泊" count={sleepMember} />
          <CountCard header="外出" count={goMember} />
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

      <div className="flex flex-col flex-1">
        <div className="flex">
          <div className="flex gap-4 items-end tracking-tighter text-left mb-6">
            {kind.map((v) => {
              return (
                <span
                  className={`${
                    listKind === v.state
                      ? "font-bold text-3xl underline underline-offset-8"
                      : "text-gray-400 text-2xl"
                  } cursor-pointer`}
                  onClick={() => {
                    setListKind(v.state);
                  }}
                >
                  {v.head}
                </span>
              );
            })}
          </div>
          <div className="flex-1 flex items-center justify-end">
            <SearchBar
              tagList={tagList}
              tag={tag}
              setTag={setTag}
              setSearch={setSearch}
            />
          </div>
        </div>
        <div className="bg-white flex flex-col gap-2 p-4 h-full rounded-2xl overflow-auto shadow-lg">
          {isLoading ? (
            <LoadingPage />
          ) : (
            <>
              <div className="grid grid-cols-5 mb-5 border-x border-black/10 shadow-lg overflow-hidden rounded-2xl text-center">
                <ListHead headList={headList} />
                {absence.map((user) => {
                  return <UserList user={user} dataList={dataList} />;
                })}
              </div>
              <div className="flex-1 justify-end flex flex-col gap-2">
                <Pagination page={page} setPage={setPage} lastPage={lastPage} />
                <div className="text-center font-bold text-xs">{`1 - ${lastPage}`}</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default StayOut;
