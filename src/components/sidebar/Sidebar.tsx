import { useRecoilValue, useSetRecoilState } from "recoil";
import SidePowerModal from "./SidePowerModal";
import { LoginStateAtom, UserDataAtom } from "../../recoil/UserDataAtiom";
import { admin, master, restaurant, salon } from "../../constants/powerList";
import { useNavigate } from "react-router-dom";
import { privateApi } from "../../services/customAxios";
import symbolImg from "../../assets/schoolImg/simbol.png";
import { useMutation } from "@tanstack/react-query";

function Sidebar() {
  const userData = useRecoilValue(UserDataAtom);
  const navigate = useNavigate();
  // 로그인 상태 전역 변수
  const setLoginState = useSetRecoilState(LoginStateAtom);

  // 로그아웃 Api
  const logoutApi = async () => {
    const response = await privateApi.post("/api/logout");

    return response.data;
  };

  // 로그아웃 mutation
  const { mutate: logoutMutation } = useMutation({
    mutationFn: () => logoutApi(),
    // Api 연결 성공
    onSuccess() {
      setLoginState(false);
      sessionStorage.removeItem("userToken");
      navigate("/");
    },
  });

  return (
    <div className="bg-cyan-600/70 min-w-[23rem] h-full p-2 shadow-black/35 shadow-xl flex flex-col gap-10 overflow-scroll">
      <div className="rounded-2xl border-4 border-cyan-900/70 mt-28 mx-4 grid grid-cols-7 p-5 h-44 gap-2">
        <div className="relative col-span-3">
          <img
            alt="symbol"
            src={symbolImg}
            className="absolute w-full object-cover inset-y-2"
          />
        </div>
        <div className="col-span-4 flex-col mt-4">
          <p className="text-center self-center text-white text-2xl font-bold underline underline-offset-8">
            {userData.name} 様
          </p>
          <div className="flex gap-2 mt-7 text-sm font-bold">
            <button
              className="flex-1 py-3 px-1 rounded-3xl bg-cyan-400/70 uppercase text-white shadow-md shadow-inherit transition-all hover:shadow-sm hover:shadow-inherit  focus:opacity-[0.85] active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              data-ripple-light="true"
              onClick={() => {
                navigate("/main/mypage");
              }}
            >
              My page
            </button>
            <button
              onClick={() => {
                logoutMutation();
              }}
              className="flex-1 py-3 px-1 rounded-3xl bg-cyan-600 uppercase text-white shadow-md shadow-inherit transition-all hover:shadow-sm hover:shadow-inherit focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              data-ripple-light="true"
            >
              log out
            </button>
          </div>
        </div>
      </div>
      {userData.power.includes("master") ? (
        <SidePowerModal power={master} />
      ) : null}
      {userData.power.includes("salon") ? (
        <SidePowerModal power={salon} />
      ) : null}
      {userData.power.includes("restaurant") ? (
        <SidePowerModal power={restaurant} />
      ) : null}
      {userData.power.includes("admin") ? (
        <SidePowerModal power={admin} />
      ) : null}
    </div>
  );
}

export default Sidebar;
