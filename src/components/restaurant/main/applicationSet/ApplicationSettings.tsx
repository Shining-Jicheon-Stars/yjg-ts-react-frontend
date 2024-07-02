import { useEffect, useState } from "react";
import { privateApi } from "../../../../services/customAxios";
import AccountSettings from "./AccountSettings";
import {
  SemesterAutoDataType,
  WeekendAutoDataType,
} from "../../../../types/restaurant";
import ManualSettings from "./ManualSettings";
import WeekendManualSettings from "./WeekendManualSettings";
import SemesterManualSettings from "./SemesterManualSettings";

function ApplicationSettings() {
  // 주말 리스트종류 스테이트
  const [weekendKind, setWeekendKind] = useState<string>("automatic");
  // 학기 리스트 종류 스테이트
  const [semesterKind, setSemesterKind] = useState<string>("automatic");
  // 주말 수동일 때 값
  const [weekendBtn, setWeekBtn] = useState<boolean>(true);
  // 주말 자동일 때 값
  const [weekendAutoData, setWeekendAutoData] = useState<WeekendAutoDataType>();
  // 학기 수동일 때 값
  const [semesterBtn, setSemesterBtn] = useState<boolean>(true);
  // 학기 자동일 때 값
  const [semesterAutoData, setSemesterAutoData] =
    useState<SemesterAutoDataType>();
  // 리스트 종류 값
  const kind = [
    {
      state: "automatic",
      head: "自動",
    },
    {
      state: "manual",
      head: "手動",
    },
  ];

  // 페이지 렌더링 시
  useEffect(() => {
    getWeekendApply();
    getSemesterApply();
  }, []);

  // 리스트 종류가 변경될 때
  useEffect(() => {
    if (weekendKind === "manual") {
      patchApplyManual("weekend", true);
    }
    if (semesterKind === "manual") {
      patchApplyManual("semester", true);
    }
  }, [weekendKind, semesterKind]);

  // 주말 식수 신청 상태 가져오기
  const getWeekendApply = async () => {
    try {
      const weekendApply = await privateApi.get(
        "/api/restaurant/apply/state/web/weekend"
      );
      if ("manual" in weekendApply.data) {
        // data 값이 수동일 때 값 저장
        setWeekendKind("manual");
        if (weekendApply.data.manual.state) {
          setWeekBtn(true);
        } else {
          setWeekBtn(false);
        }
      } else {
        // data 값이 자동일 때 값 저장
        setWeekendKind("automatic");
        setWeekendAutoData(weekendApply.data.weekendAutoData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 학기 식수 신청 상태 가져오기
  const getSemesterApply = async () => {
    try {
      const semesterApply = await privateApi.get(
        "/api/restaurant/apply/state/web/semester"
      );
      if ("manual" in semesterApply.data) {
        // data 값이 수동일 때 값 저장
        setSemesterKind("manual");
        if (semesterApply.data.manual.state) {
          setSemesterBtn(true);
        } else {
          setSemesterBtn(false);
        }
      } else {
        // data 값이 자동일 때 값 저장
        setSemesterKind("automatic");
        const startParts = semesterApply.data.auto.start_date.split("-");
        const endParts = semesterApply.data.auto.end_date.split("-");
        setSemesterAutoData({
          start_month: startParts[0],
          start_date: startParts[1],
          end_month: endParts[0],
          end_date: endParts[1],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 식수 수동 신청
  const patchApplyManual = async (division: string, state: boolean) => {
    try {
      await privateApi.patch("/api/restaurant/apply/manual/set", {
        division: division,
        state: state,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="font-bold text-lg pl-4 pb-2">• 飲み水の申請設定</div>
      <div className="bg-white flex w-[800px] flex-col gap-4 shadow-lg px-10 py-5 border border-black/10 rounded-xl">
        <div className="flex flex-col border-b border-black/20">
          <div className="flex gap-8">
            <div className="font-bold text-2xl">週末の飲み水の申し込み</div>
            <div className="flex items-end gap-3">
              {kind.map((v) => {
                return (
                  <span
                    className={`${
                      weekendKind === v.state
                        ? "font-bold text-blue-600"
                        : "text-gray-400"
                    } text-lg cursor-pointer`}
                    onClick={() => {
                      setWeekendKind(v.state);
                    }}
                  >
                    {v.head}
                  </span>
                );
              })}
            </div>
          </div>
          {weekendKind === "automatic" ? (
            <WeekendManualSettings
              autoData={weekendAutoData}
              setAutoData={setWeekendAutoData}
              weekendKind={weekendKind}
              getWeekendApply={getWeekendApply}
            />
          ) : (
            <ManualSettings
              kind="weekend"
              btnState={weekendBtn}
              setBtnState={setWeekBtn}
            />
          )}
        </div>
        <div className="flex flex-col border-b border-black/20">
          <div className="flex gap-8">
            <div className="font-bold text-2xl">学期の植樹申請</div>
            <div className="flex items-end gap-3">
              {kind.map((v) => {
                return (
                  <span
                    className={`${
                      semesterKind === v.state
                        ? "font-bold text-blue-600"
                        : "text-gray-400"
                    } text-lg cursor-pointer`}
                    onClick={() => {
                      setSemesterKind(v.state);
                    }}
                  >
                    {v.head}
                  </span>
                );
              })}
            </div>
          </div>
          {semesterKind === "automatic" ? (
            <SemesterManualSettings
              autoData={semesterAutoData}
              setAutoData={setSemesterAutoData}
              semesterKind={semesterKind}
              getSemesterApply={getSemesterApply}
            />
          ) : (
            <ManualSettings
              kind="semester"
              btnState={semesterBtn}
              setBtnState={setSemesterBtn}
            />
          )}
        </div>
        <AccountSettings />
      </div>
    </div>
  );
}

export default ApplicationSettings;
