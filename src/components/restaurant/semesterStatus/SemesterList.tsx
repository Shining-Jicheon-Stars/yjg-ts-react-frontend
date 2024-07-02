import { useEffect, useState } from "react";
import {
  SemesterListType,
  SemesterDetailDataType,
} from "../../../types/restaurant";
import { AxiosRequestConfig } from "axios";
import { privateApi } from "../../../services/customAxios";
import Pagination from "../../post/page/Pagination";
import { ListBtn, ListHead } from "../../table/Table";
import { formatPhoneNumber } from "../../../utils/formatPhoneNum";
import SearchBar from "../../post/page/SearchBar";

function SemesterList() {
  const headList = [
    { value: "名前", col: "col-span-1" },
    { value: "類型", col: "col-span-1" },
    { value: "入金可否確認", col: "col-span-1" },
    { value: "", col: "col-span-1" },
  ];
  // 주말 식수 리스트 값
  const [semesterList, setSemesterList] = useState<SemesterListType[]>([]);
  // 태그 리스트
  const tagList = [{ value: "", name: "名前" }];
  // 검색 바 태그 값
  const [tag, setTag] = useState("");
  // 검색 바 제목 값
  const [search, setSearch] = useState("");
  // 공지사항 페이지 값
  const [page, setPage] = useState(1);
  // 공지사항 마지막 페이지 값
  const [lastPage, setLastPage] = useState(8);
  // 상세보기 유저 값
  const [detailData, setDetailData] = useState<SemesterDetailDataType>();
  // 입금 여부 값
  const [payment, setPayment] = useState<number>();

  // 검색 바 데이터 변경 시
  useEffect(() => {
    if (page === 1) {
      let data: { name?: string; page: number } = { page: 1 };
      if (search) {
        data = { ...data, name: search };
      }
      getSemesterListData(data);
    }
    setPage(1);
  }, [search]);

  // 페이지 변경 시
  useEffect(() => {
    let data: { name?: string; page: number } = { page: page };
    if (search) {
      data = { ...data, name: search };
    }
    getSemesterListData(data);
  }, [page]);

  // 주말 식수 신청 리스트 가져오기
  const getSemesterListData = async (data: { name?: string; page: number }) => {
    try {
      const config: AxiosRequestConfig = {
        params: data,
      };
      const semesterListData = await privateApi.get(
        "/api/restaurant/semester/show",
        config
      );
      setSemesterList(semesterListData.data.data);
      setLastPage(semesterListData.data.last_page);
      console.log(semesterListData);
    } catch (error) {
      console.log(error);
    }
  };

  // 유저 입금 정보 수정하기
  const postSemesterUserPayment = async (id: string) => {
    try {
      await privateApi.post(`/api/restaurant/semester/p/payment/${id}`, {
        payment: payment,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="flex items-center gap-4 font-bold pr-4">
        <div className="font-bold text-3xl px-3">学期申請の現況</div>
        <div className="flex-1 flex justify-center">
          <SearchBar
            tag={tag}
            tagList={tagList}
            setTag={setTag}
            setSearch={setSearch}
          />
        </div>
      </div>
      <div className="relative bg-white flex flex-col gap-2 p-4 min-h-[500px] h-full rounded-2xl overflow-auto shadow-lg">
        {detailData ? (
          <div className="absolute top-10 right-1/4 center rounded-xl overflow-hidden font-bold border border-black/20 shadow-lg">
            <div className="bg-gray-200 h-10"></div>
            <div className="bg-white px-32 py-8 grid grid-cols-2 gap-4 h-full">
              <div className="text-right pr-10">学番 : </div>
              <div>{detailData.student_id}</div>
              <div className="text-right pr-10">名前 : </div>
              <div>{detailData.name}</div>
              <div className="text-right pr-10">携帯電話 : </div>
              <div>{formatPhoneNumber(detailData.phone_number)}</div>
              <div className="text-right pr-10">類型 : </div>
              <div>{detailData.meal_type}</div>
              <div className="text-right pr-10">入金 :</div>
              <div className="flex gap-5">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-3 w-3 text-gray-600 shadow-sm"
                    checked={payment ? true : false}
                    onClick={() => {
                      setPayment(1);
                    }}
                  />
                  <span className="ml-2 text-gray-700">完了</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-3 w-3 text-gray-600 shadow-sm"
                    checked={payment ? false : true}
                    onClick={() => {
                      setPayment(0);
                    }}
                  />
                  <span className="ml-2 text-gray-700">未完了</span>
                </label>
              </div>
              <div className="col-span-2 my-1"></div>
              <ListBtn
                value="save"
                color="bg-cyan-500/80"
                onClick={() => {
                  postSemesterUserPayment(detailData.id).then(() => {
                    setDetailData(undefined);
                    getSemesterListData({ name: search, page: page });
                  });
                }}
              />
              <ListBtn
                value="close"
                color="bg-red-400/90"
                onClick={() => {
                  setDetailData(undefined);
                }}
              />
            </div>
          </div>
        ) : null}
        <div className="grid grid-cols-4 border-x border-black/10 shadow-lg overflow-hidden rounded-2xl text-center font-bold">
          {<ListHead headList={headList} />}
          {semesterList.map((user) => {
            return (
              <>
                <div className="my-auto text-lg py-5">{user.user.name}</div>
                <div className="my-auto text-lg py-5">
                  {user.semester_meal_type.meal_type}
                </div>
                <div className="my-auto text-lg py-5">
                  {user.payment ? "完了" : "未完了"}
                </div>
                <div className="my-auto text-lg">
                  <ListBtn
                    value="詳細"
                    color="bg-blue-400/90"
                    onClick={() => {
                      setDetailData({
                        id: user.id,
                        name: user.user.name,
                        phone_number: user.user.phone_number,
                        student_id: user.user.student_id,
                        meal_type: user.semester_meal_type.meal_type,
                      });
                      setPayment(user.payment);
                    }}
                  />
                </div>
              </>
            );
          })}
        </div>
        <div className="flex-1 justify-end flex flex-col gap-2">
          <Pagination page={page} setPage={setPage} lastPage={lastPage} />
          <div className="text-center font-bold text-xs">{`1 - ${lastPage}`}</div>
        </div>
      </div>
    </div>
  );
}

export default SemesterList;
