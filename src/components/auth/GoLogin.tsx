import { useNavigate } from "react-router-dom";

function GoLogin() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center gap-2 mt-3">
      <div className="text-xs text-right pt-1 font-bold">
        アカウントはありますか
      </div>
      <div
        className="text-xs text-right pt-1 font-bold underline-offset-2  hover:underline cursor-pointer"
        onClick={() => {
          navigate("/");
        }}
      >
        ログイン
      </div>
    </div>
  );
}

export default GoLogin;
