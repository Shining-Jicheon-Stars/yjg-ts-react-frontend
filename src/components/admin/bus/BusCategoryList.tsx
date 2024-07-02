import { useEffect, useState } from "react";
import { BusCategoryListType, ScheduleType } from "../../../types/admin";
import { privateApi } from "../../../services/customAxios";
import { ListBtn } from "../../table/Table";
import BusScheduleList from "./BusScheduleList";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function BusCategoryList(props: BusCategoryListType) {
  const { id, round } = props;
  // 카테고리 이름 수정 상태
  const [modify, setModify] = useState(false);
  // 수정 내용
  const [newName, setNewName] = useState("");
  // 서비스 드롭다운 상태
  const [dropdown, setDropdown] = useState(false);
  // 스케줄 데이터
  const [schedule, setSchedule] = useState<ScheduleType[]>([]);

  const queryClient = useQueryClient();

  // 렌더링 시
  useEffect(() => {
    setDropdown(false);
  }, [id]);

  // 수정할 시
  useEffect(() => {
    if (modify) {
      setNewName(round);
    }
  }, [modify]);

  // 카테고리 수정 Api
  const modifyCategoryApi = async (data: { id: string; newName: string }) => {
    const response = await privateApi.patch(`/api/bus/round/${id}`, {
      round: newName,
    });

    return response.data;
  };

  // 카테고리 삭제 Api
  const deleteCategoryApi = async (id: string) => {
    const response = await privateApi.delete(`/api/bus/round/${id}`);

    return response.data;
  };

  // 스케줄 get api
  const getScheduleApi = async () => {
    const response = await privateApi.get(`/api/bus/round/schedule/${id}`);

    return response.data;
  };

  // 카테고리 수정 mutation
  const { mutate: modifyCategotyMutation } = useMutation({
    mutationFn: modifyCategoryApi,
    // Api 연결 성공
    onSuccess() {
      setModify(false);
      queryClient.invalidateQueries({ queryKey: ["salonCategory"] });
    },
  });

  // 카테고리 삭제 mutation
  const { mutate: deleteCategoryMutation } = useMutation({
    mutationFn: deleteCategoryApi,
    // Api 연결 성공
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["salonCategory"] });
    },
  });

  // 스케줄 query
  const { data } = useQuery({
    queryKey: ["salonSchedule", id],
    queryFn: getScheduleApi,
  });

  useEffect(() => {
    if (data) setSchedule(data.schedules);
  }, [data]);

  return (
    <div>
      <div className="bg-white flex gap-3 items-center border-2 border-gray-300 p-4 rounded-lg mt-10 text-2xl font-bold shadow-md">
        {modify ? (
          <>
            <input
              type="text"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
              }}
              className="w-32 text-center outline-none border-b-2 border-gray-400"
            />
            <ListBtn
              value="完了"
              color="bg-sky-400/90"
              onClick={() => {
                modifyCategotyMutation({ id: id, newName: newName });
              }}
            />
            <ListBtn
              value="キャンセル"
              color="bg-red-400/90"
              onClick={() => {
                setModify(false);
              }}
            />
          </>
        ) : (
          <>
            <div className="min-w-32 text-center">{round}</div>
            <ListBtn
              value="修正"
              color="bg-orange-400/80"
              onClick={() => {
                setModify(true);
              }}
            />
            <ListBtn
              value="削除"
              color="bg-red-400/90"
              onClick={() => {
                if (window.confirm("삭제하시겠습니까?")) {
                  alert("삭제되었습니다");
                  deleteCategoryMutation(id);
                } else {
                  alert("취소되었습니다.");
                }
              }}
            />
          </>
        )}
        <div className="flex-1 flex justify-end">
          <span
            className="text-sm items-center underline underline-offset-4 cursor-pointer text-gray-500"
            onClick={() => {
              setDropdown(!dropdown);
            }}
          >
            {dropdown ? "close" : "open"}
          </span>
        </div>
      </div>
      {dropdown ? <BusScheduleList id={id} schedule={schedule} /> : null}
    </div>
  );
}

export default BusCategoryList;
