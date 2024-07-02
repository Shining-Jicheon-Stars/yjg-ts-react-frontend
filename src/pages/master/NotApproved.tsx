import { useEffect, useState } from "react";
import { ListHead, UserList } from "../../components/table/Table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { privateApi } from "../../services/customAxios";
import { AxiosRequestConfig } from "axios";
import { GetUserData } from "../../types/auth";
import LoadingPage from "../../components/LoadingPage";

function NotApproved() {
  const headList = [
    { value: "名前", col: "col-span-1" },
    { value: "電話番号", col: "col-span-1" },
    { value: "メール", col: "col-span-2" },
    { value: "承認処理", col: "col-span-1" },
  ];
  const dataList = [
    { value: "name", col: "col-span-1" },
    { value: "phone_number", col: "col-span-1", type: "phoneNum" },
    { value: "email", col: "col-span-2" },
    [
      {
        value: "承認",
        color: "bg-blue-400/90",
        onClick: (data: GetUserData) => {
          approvalMutation(data.id);
        },
      },
      {
        value: "断り",
        color: "bg-red-400/90",
        onClick: (data: GetUserData) => {
          if (window.confirm("거절하시겠습니까?")) {
            deleteMutation(data.id);
            alert("거절되었습니다");
          } else {
            alert("취소되었습니다.");
          }
        },
      },
    ],
  ];
  const queryClient = useQueryClient();

  // 미승인 유저 데이터 state
  const [unApprovedUser, setUnApprovedUser] = useState<GetUserData[]>([]);

  // 미승인 유저 get Api
  const getUnappovedUserApi = async () => {
    const config: AxiosRequestConfig = {
      params: { type: "unapproved" },
    };
    const response = await privateApi.get("/api/admin/list", config);

    return response.data.admins;
  };

  // 유저 승인 Api
  const approvalApi = async (data: number) => {
    const response = await privateApi.patch("/api/admin/approve", {
      admin_id: data,
      approve: 1,
    });

    return response.data;
  };

  // 유저 거절, 삭제 Api
  const deleteApi = async (data: number) => {
    const response = await privateApi.delete(`/api/admin/master/${data}`);

    return response.data;
  };

  // 미승인 유저 query
  const { data, isLoading } = useQuery({
    queryKey: ["unapprovedUser"],
    queryFn: getUnappovedUserApi,
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (data) setUnApprovedUser(data);
  }, [data]);

  // 유저 승인 mutation
  const { mutate: approvalMutation } = useMutation({
    mutationFn: (data: number) => approvalApi(data),
    // Api 연결 성공
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["unapprovedUser"] });
    },
  });

  // 유저 거절 mutation
  const { mutate: deleteMutation } = useMutation({
    mutationFn: (data: number) => deleteApi(data),
    // Api 연결 성공
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["unapprovedUser"] });
    },
  });

  if (isLoading) return <LoadingPage />;

  return (
    <div className="px-10 h-full">
      <div className="flex">
        <div className="flex-1 text-2xl font-bold tracking-tighter text-left">
          承認待ちリスト
        </div>
        <div className="self-end text-right p-4 font-bold tracking-widest">
          {unApprovedUser.length}名
        </div>
      </div>
      <div className="bg-white p-4 h-5/6 rounded-2xl overflow-auto shadow-lg">
        <div className="grid grid-cols-5 text-center border-x border-black/10 shadow-lg overflow-hidden rounded-2xl">
          <ListHead headList={headList} />
          {unApprovedUser.map((user) => {
            return <UserList user={user} dataList={dataList} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default NotApproved;
