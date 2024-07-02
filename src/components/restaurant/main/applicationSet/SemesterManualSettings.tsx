import { useEffect, useState } from "react";
import {
  SemesterAutoDataType,
  SemesterManualSettingsType,
} from "../../../../types/restaurant";
import { ListBtn } from "../../../table/Table";
import { privateApi } from "../../../../services/customAxios";

function SemesterManualSettings(props: SemesterManualSettingsType) {
  const { autoData, setAutoData, semesterKind, getSemesterApply } = props;
  // 수정 상태변수
  const [onModify, setOnModify] = useState<boolean>(false);
  // 설정 값 저장 스테이트
  const [newSettings, setNewSettings] = useState<SemesterAutoDataType>({
    start_month: "01",
    start_date: "01",
    end_month: "12",
    end_date: "31",
  });
  // 학기 식수 신청 시간 양식
  const semesterInputTimes = {
    month: Array.from(
      { length: 12 },
      (_, i) => `${(i + 1).toString().padStart(2, "0")}`
    ),
    day: Array.from(
      { length: 31 },
      (_, i) => `${(i + 1).toString().padStart(2, "0")}`
    ),
  };

  // 렌더링할 시
  useEffect(() => {
    if (onModify) {
      if (autoData) {
        setNewSettings(autoData);
      }
    }
  }, [onModify]);

  // 자동 수동 변경할 시
  useEffect(() => {
    setAutoData(undefined);
  }, [semesterKind]);

  // 주말 식사 자동 data 설정하기
  const patchApplyWeekendData = async () => {
    try {
      await privateApi.patch("/api/restaurant/apply/semester/set", {
        start_date: `${newSettings.start_month}-${newSettings.start_date}`,
        end_date: `${newSettings.end_month}-${newSettings.end_date}`,
        state: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // 값에 타입에 따라 data 출력하기
  const getAutoData = () => {
    if (autoData) {
      return (
        <div className="flex font-bold gap-4 text-lg">
          <div>
            {autoData.start_month}月 - {autoData.start_date}日
          </div>
          <div>~</div>
          <div>
            {autoData.end_month}月 - {autoData.end_date}日
          </div>
        </div>
      );
    } else {
      return (
        <div className="font-bold text-lg text-gray-400">
          값을 설정해주세요.
        </div>
      );
    }
  };

  return (
    <div className="py-4">
      {onModify ? (
        <div className="flex items-center">
          <div className="flex-1 flex font-bold text-lg gap-4 px-2">
            <div>
              <select
                className="p-1"
                value={newSettings.start_month}
                onChange={(v) => {
                  let copy = { ...newSettings };
                  copy.start_month = v.target.value;
                  setNewSettings(copy);
                }}
              >
                {semesterInputTimes.month.map((v) => {
                  return <option value={v}>{v}月</option>;
                })}
              </select>
              <select
                className="p-1"
                value={newSettings.start_date}
                onChange={(v) => {
                  let copy = { ...newSettings };
                  copy.start_date = v.target.value;
                  setNewSettings(copy);
                }}
              >
                {semesterInputTimes.day.map((v) => {
                  return <option value={v}>{v}日</option>;
                })}
              </select>
            </div>
            <div>~</div>
            <div>
              <select
                className="p-1"
                value={newSettings.end_month}
                onChange={(v) => {
                  let copy = { ...newSettings };
                  copy.end_month = v.target.value;
                  setNewSettings(copy);
                }}
              >
                {semesterInputTimes.month.map((v) => {
                  return <option value={v}>{v}월</option>;
                })}
              </select>
              <select
                className="p-1"
                value={newSettings.end_date}
                onChange={(v) => {
                  let copy = { ...newSettings };
                  copy.end_date = v.target.value;
                  setNewSettings(copy);
                }}
              >
                {semesterInputTimes.day.map((v) => {
                  return <option value={v}>{v}일</option>;
                })}
              </select>
            </div>
          </div>
          <div className="flex gap-4">
            <ListBtn
              value="設定"
              color="bg-blue-400/90"
              onClick={() => {
                patchApplyWeekendData().then(() => {
                  getSemesterApply();
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
        </div>
      ) : (
        <div className="flex items-center">
          <div className="flex-1 px-4">{getAutoData()}</div>
          <div>
            <ListBtn
              value="設定"
              color="bg-orange-400/90"
              onClick={() => {
                setOnModify(true);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default SemesterManualSettings;
