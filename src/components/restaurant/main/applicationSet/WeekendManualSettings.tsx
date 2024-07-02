import { useEffect, useState } from "react";
import {
  WeekendAutoDataType,
  WeekendManualSettingsType,
} from "../../../../types/restaurant";
import { getDayOfWeek } from "../../../../utils/getDayOfWeek";
import { ListBtn } from "../../../table/Table";
import { privateApi } from "../../../../services/customAxios";

function WeekendManualSettings(props: WeekendManualSettingsType) {
  const { autoData, setAutoData, weekendKind, getWeekendApply } = props;
  // 수정 상태변수
  const [onModify, setOnModify] = useState<boolean>(false);
  // 설정 값 저장 스테이트
  const [newSettings, setNewSettings] = useState<WeekendAutoDataType>({
    start_week: "0",
    start_time: "00:00",
    end_week: "0",
    end_time: "00:00",
  });
  // 주말 식수 신청 시간 양식
  const weekendInputTimes = {
    dayOfWeek: [
      { key: 0, value: "日曜日" },
      { key: 1, value: "月曜日" },
      { key: 2, value: "火曜日" },
      { key: 3, value: "水曜日" },
      { key: 4, value: "木曜日" },
      { key: 5, value: "金曜日" },
      { key: 6, value: "土曜日" },
    ],
    time: Array.from(
      { length: 24 },
      (_, i) => `${i.toString().padStart(2, "0")}:00`
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
  }, [weekendKind]);

  // 주말 식사 자동 data 설정하기
  const patchApplyWeekendData = async () => {
    try {
      await privateApi.patch("/api/restaurant/apply/weekend/set", {
        ...newSettings,
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
            ( {getDayOfWeek(autoData.start_week)} ) {autoData.start_time}
          </div>
          <div>~</div>
          <div>
            ( {getDayOfWeek(autoData.end_week)} ) {autoData.end_time}
          </div>
        </div>
      );
    } else {
      return (
        <div className="font-bold text-lg text-gray-400">設定お願いします</div>
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
                value={newSettings.start_week}
                onChange={(v) => {
                  let copy = { ...newSettings };
                  copy.start_week = v.target.value;
                  setNewSettings(copy);
                }}
              >
                {weekendInputTimes.dayOfWeek.map((v) => {
                  return <option value={v.key}>{v.value}</option>;
                })}
              </select>
              <select
                className="p-1"
                value={newSettings.start_time}
                onChange={(v) => {
                  let copy = { ...newSettings };
                  copy.start_time = v.target.value;
                  setNewSettings(copy);
                }}
              >
                {weekendInputTimes.time.map((v) => {
                  return <option value={v}>{v}</option>;
                })}
              </select>
            </div>
            <div>~</div>
            <div>
              <select
                className="p-1"
                value={newSettings.end_week}
                onChange={(v) => {
                  let copy = { ...newSettings };
                  copy.end_week = v.target.value;
                  setNewSettings(copy);
                }}
              >
                {weekendInputTimes.dayOfWeek.map((v) => {
                  return <option value={v.key}>{v.value}</option>;
                })}
              </select>
              <select
                className="p-1"
                value={newSettings.end_time}
                onChange={(v) => {
                  let copy = { ...newSettings };
                  copy.end_time = v.target.value;
                  setNewSettings(copy);
                }}
              >
                {weekendInputTimes.time.map((v) => {
                  return <option value={v}>{v}</option>;
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
                  getWeekendApply();
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

export default WeekendManualSettings;
