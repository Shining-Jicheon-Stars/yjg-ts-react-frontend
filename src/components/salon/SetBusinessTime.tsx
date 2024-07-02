import { useEffect, useState } from "react";
import { privateApi } from "../../services/customAxios";
import { ListBtn } from "../table/Table";
import { BusinessTimeType } from "../../types/salon";

function SetBusinessTime() {
  // 영업설정 시간
  const [businessTime, setBusinessTime] = useState<BusinessTimeType[]>([]);
  // 선택된 요일 값
  const [selectedWeek, setSelectedWeek] = useState<BusinessTimeType>();
  // 이전의 선택 값
  const [prevSelected, setPrevSelected] = useState<string>();
  // 수정중인지 아닌지 체크
  const [onChange, setOnchange] = useState<boolean>(false);
  // 영업 상태 수정 값
  const [modifyOpen, setModifyOpen] = useState(false);
  // 영업 시작시간 수정 값
  const [selectedSHour, setSelectedSHour] = useState("");
  // 영업 마감시간 수정 값
  const [selectedEHour, setSelectedEHour] = useState("");
  // 시간 옵션 생성
  const hours = Array.from(
    { length: 24 },
    (_, i) => `${i.toString().padStart(2, "0")}:00`
  );

  // 컴포넌트 렌더링 시
  useEffect(() => {
    getBusinessTimeData();
  }, []);

  // 영업시간 데이터 받을 시
  useEffect(() => {
    if (prevSelected) {
      businessTime.map((v) => {
        if (v.date === prevSelected) {
          setSelectedWeek(v);
        }
      });
    } else {
      setSelectedWeek(businessTime[0]);
    }
  }, [businessTime]);

  // 요일 선택할 시
  useEffect(() => {
    setOnchange(false);
    setPrevSelected(selectedWeek?.date);
  }, [selectedWeek]);

  // 재설정할 시
  useEffect(() => {
    if (selectedWeek) {
      setSelectedSHour(selectedWeek.s_time);
      setSelectedEHour(selectedWeek.e_time);
    }
    if (selectedWeek?.open) {
      setModifyOpen(true);
    } else {
      setModifyOpen(false);
    }
  }, [onChange]);

  // 모든 요일의 미용실 영업 시간 가져오기
  const getBusinessTimeData = async () => {
    try {
      const BusinessTimeData = await privateApi.get("/api/salon/hour");
      setBusinessTime(BusinessTimeData.data.business_hours);
    } catch (error) {
      console.log(error);
    }
  };

  // 영업시간 업데이트하기
  const patchBusinessTimeData = async () => {
    try {
      await privateApi.patch("/api/salon/hour", {
        b_hour_id: selectedWeek?.id,
        s_time: selectedSHour,
        e_time: selectedEHour,
        open: modifyOpen,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-7 text-center p-4 gap-4">
        {businessTime.map((v) => {
          return (
            <div
              className={`${
                v.open ? "text-black" : "text-black/20"
              } p-1 rounded-md cursor-pointer underline underline-offset-4 font-bold`}
              onClick={() => {
                setSelectedWeek(v);
              }}
            >
              {v.date}
            </div>
          );
        })}
      </div>
      {selectedWeek && !onChange ? (
        <div className="rounded-lg grid grid-cols-6 text-center px-8 pb-6 gap-5">
          <div className="relative font-bold text-lg col-span-6 mb-3">
            {selectedWeek.date}
            {selectedWeek.open ? " 営業日" : ""}
            <div className="absolute -right-3 -top-1">
              <ListBtn
                value="リセット"
                color="bg-blue-400/90"
                onClick={() => {
                  setOnchange(true);
                }}
              />
            </div>
          </div>
          {selectedWeek.open ? (
            <>
              <div className="font-bold text-lg col-span-3">🔓 open</div>
              <div className="font-bold text-xl col-span-3 outline-none text-center">
                {selectedWeek?.s_time}
              </div>
              <div className="font-bold text-lg col-span-3">🔒 close</div>
              <div className="font-bold text-xl col-span-3 outline-none text-center">
                {selectedWeek?.e_time}
              </div>
            </>
          ) : (
            <div className="col-span-6 text-xl font-bold text-gray-400 p-6">
              営業日ではありません
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg grid grid-cols-6 text-center p-4 gap-5">
          <div className="font-bold text-lg col-span-3 self-center">영업</div>
          <div className="font-bold text-xl col-span-3 outline-none text-center px-20">
            <div className="flex gap-2 p-4">
              <label className="relative cursor-pointer">
                <input
                  id="switch-3"
                  type="checkbox"
                  className="peer sr-only"
                  onChange={() => {
                    setModifyOpen(!modifyOpen);
                  }}
                  checked={modifyOpen}
                />
                <label htmlFor="switch-3" className="hidden"></label>
                <div className="peer h-4 w-11 rounded border bg-slate-200 after:absolute after:-top-1 after:left-0 after:h-6 after:w-6 after:rounded-md after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-400 peer-checked:after:translate-x-full peer-focus:ring-blue-400"></div>
              </label>
            </div>
          </div>
          {modifyOpen ? (
            <>
              <div className="font-bold text-lg col-span-3">🔓 open</div>
              <div className="font-bold text-xl col-span-3 outline-none text-center">
                <select
                  className="border-b-2 border-black px-1"
                  value={selectedSHour}
                  onChange={(e) => setSelectedSHour(e.target.value)}
                >
                  {hours.map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  ))}
                </select>
              </div>
              <div className="font-bold text-lg col-span-3">🔒 close</div>
              <div className="font-bold text-xl col-span-3 outline-none text-center">
                <select
                  className="border-b-2 border-black px-1"
                  value={selectedEHour}
                  onChange={(e) => setSelectedEHour(e.target.value)}
                >
                  {hours.map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : null}
          <div className="flex gap-5 justify-center col-span-6 mt-3">
            <ListBtn
              value="設定完了"
              color="bg-blue-400/90"
              onClick={() => {
                patchBusinessTimeData().then(() => {
                  setOnchange(false);
                  getBusinessTimeData();
                });
              }}
            />
            <ListBtn
              value="キャンセル"
              color="bg-red-400/90"
              onClick={() => {
                setOnchange(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default SetBusinessTime;
