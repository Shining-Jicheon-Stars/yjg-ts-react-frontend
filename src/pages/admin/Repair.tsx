import { useEffect, useState } from "react";
import { AfterServiceListType, getAfterServiceType } from "../../types/post";
import { useNavigate } from "react-router-dom";
import { AxiosRequestConfig } from "axios";
import { privateApi } from "../../services/customAxios";
import SearchBar from "../../components/post/page/SearchBar";
import { ListHead, UserList } from "../../components/table/Table";
import Pagination from "../../components/post/page/Pagination";
import { useQuery } from "@tanstack/react-query";
import LoadingPage from "../../components/LoadingPage";

function Repair() {
  // 리스트종류 스테이트
  const [listKind, setListKind] = useState(0);
  const kind = [
    {
      state: 1,
      head: "処理完了",
    },
    {
      state: 0,
      head: "未処理",
    },
  ];
  const headList = [
    { value: "タイトル", col: "col-span-2" },
    { value: "作成者", col: "col-span-1" },
    { value: "号数", col: "col-span-1" },
    { value: "", col: "col-span-1" },
  ];
  const dataList = [
    { value: "title", col: "col-span-2" },
    { value: "user_name", col: "col-span-1" },
    { value: "visit_place", col: "col-span-1" },
    [
      {
        value: "照会",
        color: "bg-cyan-500",
        onClick: (user: AfterServiceListType) => {
          navigate(`/main/admin/reading/${user.id}`, {
            state: { type: "AS" },
          });
        },
      },
    ],
  ];

  // A/S 파라미터 값
  const [ASParams, setASParams] = useState<getAfterServiceType>({
    page: 1,
    status: 0,
  });
  // A/S 데이터 값
  const [ASList, setASList] = useState<AfterServiceListType[]>([]);
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
  const navigate = useNavigate();

  // 리스트 종류 변경 시
  useEffect(() => {
    setPage(1);
    if (listKind === 1) {
      getASData({ status: 1, page: 1 });
    } else {
      getASData({ status: 0, page: 1 });
    }
  }, [listKind]);

  // 검색 바 데이터 변경 시
  useEffect(() => {
    if (page === 1) {
      let data: getAfterServiceType = {
        page: 1,
        status: listKind,
      };
      if (search) {
        data = { ...data, name: search };
      }
      setASParams(data);
    }
    setPage(1);
  }, [search]);

  // 페이지 변경 시
  useEffect(() => {
    let data: getAfterServiceType = {
      page: page,
      status: listKind,
    };
    if (search) {
      data = { ...data, name: search };
    }
    setASParams(data);
  }, [page]);

  // A/S 데이터 get Api
  const getASApi = async () => {
    const config: AxiosRequestConfig = {
      params: ASParams,
    };
    const response = await privateApi.get("/api/after-service", config);

    return response.data;
  };

  // A/S 데이터 query
  const { data: AS, isLoading } = useQuery({
    queryKey: ["ASData", ASParams],
    queryFn: getASApi,
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (AS) setASList(AS.after_services.data);
  }, [AS]);

  // AS 데이터 가져오기
  const getASData = async (data?: getAfterServiceType) => {
    try {
      const config: AxiosRequestConfig = {
        params: data,
      };
      const ASData = await privateApi.get("/api/after-service", config);
      setASList(ASData.data.after_services.data);
      setLastPage(ASData.data.after_services.last_page);
    } catch (error) {}
  };

  return (
    <div className="flex flex-col gap-4 mx-10">
      <div className="flex gap-4">
        <div className="text-4xl font-bold">A/Sリスト</div>
        <div className="flex gap-3 pl-2 items-end tracking-tighter">
          {kind.map((v) => {
            return (
              <span
                className={`${
                  listKind === v.state
                    ? "font-bold text-xl underline underline-offset-2"
                    : "text-gray-400"
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
        <div className="flex-1 flex justify-end">
          <SearchBar
            tagList={tagList}
            tag={tag}
            setTag={setTag}
            setSearch={setSearch}
          />
        </div>
      </div>
      <div className="bg-white flex flex-col gap-2 p-4 h-full rounded-2xl min-h-[30rem]">
        {isLoading ? (
          <div className="m-auto">
            <LoadingPage />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-5 mt-2 border-x border-black/10 shadow-lg overflow-hidden rounded-2xl text-center">
              {<ListHead headList={headList} />}
              {ASList.map((user) => {
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
  );
}

export default Repair;
