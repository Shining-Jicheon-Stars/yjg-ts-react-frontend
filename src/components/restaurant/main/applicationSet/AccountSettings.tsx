import { useEffect, useState } from "react";
import { AccountType } from "../../../../types/restaurant";
import { privateApi } from "../../../../services/customAxios";
import { ListBtn } from "../../../table/Table";

function AccountSettings() {
  // 계좌정보 데이터
  const [accountData, setAccountData] = useState<AccountType>({
    account: "",
    bank_name: "",
    name: "",
  });
  // 수정 상태
  const [onModify, setOnModify] = useState(false);
  // 수정된 계좌정보 값
  const [newAccountData, setNewAccountData] = useState<AccountType>({
    account: "",
    bank_name: "",
    name: "",
  });

  // 렌더링 시
  useEffect(() => {
    getAccountData();
  }, []);

  // 설정된 계좌 가져오기
  const getAccountData = async () => {
    try {
      const accountData = await privateApi.get("/api/restaurant/account/show");
      setAccountData(accountData.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // 계좌정보 수정하기
  const patchAccountData = async () => {
    try {
      await privateApi.patch("/api/restaurant/account/set", newAccountData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="font-bold text-2xl">口座設定</div>
      {onModify ? (
        <div className="flex items-start gap-3">
          <div className="flex flex-col flex-1 gap-2 p-4 font-semibold text-lg">
            <div className="flex gap-2">
              <div>銀行名 : </div>
              <input
                className="border-b-2 border-black pl-1"
                type="text"
                value={newAccountData.bank_name}
                onChange={(e) => {
                  let copy = { ...newAccountData };
                  copy.bank_name = e.target.value;
                  setNewAccountData(copy);
                }}
              />
            </div>
            <div className="flex gap-2">
              <div>口座番号 : </div>
              <input
                className="border-b-2 border-black pl-1"
                type="text"
                value={newAccountData.account}
                onChange={(e) => {
                  let copy = { ...newAccountData };
                  copy.account = e.target.value;
                  setNewAccountData(copy);
                }}
              />
            </div>
            <div className="flex gap-2">
              <div>預金者名 : </div>
              <input
                className="border-b-2 border-black pl-1"
                type="text"
                value={newAccountData.name}
                onChange={(e) => {
                  let copy = { ...newAccountData };
                  copy.name = e.target.value;
                  setNewAccountData(copy);
                }}
              />
            </div>
          </div>
          <ListBtn
            value="修正完了"
            color="bg-blue-400/90"
            onClick={() => {
              patchAccountData().then(() => {
                getAccountData();
                setOnModify(false);
              });
            }}
          />
          <ListBtn
            value="キャンセル"
            color="bg-red-400/90"
            onClick={() => {
              setOnModify(false);
            }}
          />
        </div>
      ) : (
        <div className="flex items-start ">
          <div className="flex flex-col flex-1 gap-1 p-4 font-semibold text-lg">
            <div className="flex gap-2">
              <div>銀行名 : </div>
              <div>{accountData.bank_name}</div>
            </div>
            <div className="flex gap-2">
              <div>口座番号 : </div>
              <div>{accountData.account}</div>
            </div>
            <div className="flex gap-2">
              <div>預金者名 : </div>
              <div>{accountData.name}</div>
            </div>
          </div>
          <ListBtn
            value="修整"
            color="bg-blue-400/90"
            onClick={() => {
              setNewAccountData(accountData);
              setOnModify(true);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default AccountSettings;
