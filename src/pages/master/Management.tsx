import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ListBtn, ListHead, UserList } from "../../components/table/Table";
import LoadingPage from "../../components/LoadingPage";
import { useEffect, useRef, useState } from "react";
import { privateApi } from "../../services/customAxios";
import { AxiosRequestConfig } from "axios";
import { GetUserData, PrivilegeType } from "../../types/auth";
import CheckPower from "../../components/master/CheckPower";

function Management() {
  const headList = [
    { value: "名前", col: "col-span-1" },
    { value: "電話番号", col: "col-span-1" },
    { value: "メール", col: "col-span-2" },
    { value: "", col: "col-span-1" },
  ];
  const dataList = [
    { value: "name", col: "col-span-1" },
    { value: "phone_number", col: "col-span-1", type: "phoneNum" },
    { value: "email", col: "col-span-2" },
    [
      {
        value: "権限設定",
        color: "bg-blue-400/90",
        onClick: (data: GetUserData) => {
          setOnModal(data);
        },
      },
      {
        value: "削除",
        color: "bg-red-400/90",
        onClick: (data: GetUserData) => {
          if (window.confirm("삭제하시겠습니까?")) {
            deleteMutation(data.id);
            alert("삭제되었습니다");
          } else {
            alert("취소되었습니다.");
          }
        },
      },
    ],
  ];
  // 모달 ON / OFF ( 유저 데이터 유무로 확인 )
  const [onModal, setOnModal] = useState<GetUserData>();
  // 승인 유저 스테이트
  const [approvedUsers, setApprovedUsers] = useState<GetUserData[]>([]);
  // 모달 유저의 권한
  const [userPower, setUserPower] = useState<string[]>([]);
  // 권한 목록 스테이트
  const [privilegesData, setPrivilegesData] = useState<PrivilegeType[]>([]);
  let userId = useRef(0);
  const queryClient = useQueryClient();

  // 모달 접속 시 해당 유저 데이터 받아오기
  useEffect(() => {
    if (onModal) {
      let power: string[] = [];
      onModal.privileges.map((data) => {
        power.push(data.id);
      });
      setUserPower(power);
      userId.current = onModal.id;
    }
  }, [onModal]);

  // 승인 유저 get Api
  const getAppovedUserApi = async () => {
    const config: AxiosRequestConfig = {
      params: { type: "approved" },
    };
    const response = await privateApi.get("/api/admin/list", config);

    return response.data.admins;
  };

  // 유저 거절, 삭제 Api
  const deleteApi = async (data: number) => {
    const response = await privateApi.delete(`/api/admin/master/${data}`);

    return response.data;
  };

  // 유저 권한 변경 Api
  const patchPowerApi = async (data: string[]) => {
    const response = await privateApi.patch("/api/admin/privilege", {
      admin_id: userId.current,
      privileges: userPower,
    });

    return response.data;
  };

  // 권한 목록 get Api
  const getPrivilegeDataApi = async () => {
    const response = await privateApi.get("/api/admin/privilege");

    return response.data.privileges;
  };

  // 승인 유저 query
  const { data: approvedData, isLoading } = useQuery({
    queryKey: ["approvedUser"],
    queryFn: getAppovedUserApi,
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
  });

  // 권한 목록 query
  const { data: privilegeData } = useQuery({
    queryKey: ["allPrivilege"],
    queryFn: getPrivilegeDataApi,
  });

  useEffect(() => {
    if (approvedData) setApprovedUsers(approvedData);
  }, [approvedData]);

  useEffect(() => {
    if (privilegeData) setPrivilegesData(privilegeData);
  }, [privilegeData]);

  // 유저 거절 mutation
  const { mutate: deleteMutation } = useMutation({
    mutationFn: (data: number) => deleteApi(data),
    // Api 연결 성공
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["approvedUser"] });
    },
  });

  // 유저 권한 변경 mutation
  const { mutate: patchPowerMutation } = useMutation({
    mutationFn: (data: string[]) => patchPowerApi(data),
    // Api 연결 성공
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["approvedUser"] });
    },
  });

  if (isLoading) return <LoadingPage />;

  return (
    <div className="px-10 h-full">
      {onModal ? (
        <div className="fixed flex items-center justify-center inset-0 bg-black/35">
          <div className="bg-white rounded-md w-3/5 h-3/5 py-12 overflow-auto shadow-lg">
            <div className="grid grid-cols-3 p-6 text-center text-2xl font-bold gap-5">
              <div className="col-span-3 text-xl text-left font-bold mb-10 ml-5">
                <span className="text-blue-700 text-3xl">{onModal.name} </span>
                様の管理者権限
              </div>
              <div className="text-lg">LIST</div>
              <div className="text-lg">ON</div>
              <div className="text-lg">OFF</div>
              {privilegesData.map((v) => {
                return (
                  <CheckPower
                    power={v.id}
                    name={v.privilege}
                    userPower={userPower}
                    setUserPower={setUserPower}
                  />
                );
              })}
            </div>
            <div className="flex justify-end mt-20 mr-14 gap-4">
              <ListBtn
                value="save"
                color="bg-blue-400/90"
                onClick={() => {
                  patchPowerMutation(userPower);
                  setOnModal(undefined);
                }}
              />
              <ListBtn
                value="close"
                color="bg-red-400/90"
                onClick={() => {
                  setOnModal(undefined);
                }}
              />
            </div>
          </div>
        </div>
      ) : null}
      <div className="flex">
        <div className="flex-1 text-2xl font-bold tracking-tighter text-left">
          管理者リスト
        </div>
        <div className="self-end text-right p-4 tracking-widest font-semibold">
          {approvedUsers.length}名
        </div>
      </div>
      <div className="bg-white p-4 h-5/6 rounded-2xl overflow-auto shadow-lg">
        <div className="grid grid-cols-5 text-center border-x border-black/10 shadow-lg overflow-hidden rounded-2xl">
          <ListHead headList={headList} />
          {approvedUsers.map((user) => {
            return <UserList user={user} dataList={dataList} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default Management;
