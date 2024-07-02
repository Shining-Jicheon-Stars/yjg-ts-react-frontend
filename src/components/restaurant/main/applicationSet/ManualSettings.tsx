import { privateApi } from "../../../../services/customAxios";

function ManualSettings(props: {
  kind: string;
  btnState: boolean;
  setBtnState: (btnState: boolean) => void;
}) {
  const { kind, btnState, setBtnState } = props;

  // 수동 영업시간 패치
  const patchApplyManual = async (state: boolean) => {
    try {
      await privateApi.patch("/api/restaurant/apply/manual/set", {
        division: kind,
        state: state,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex gap-2 items-center px-10 py-4">
      <p className="flex font-bold text-lg">close ⇽⇾ open</p>
      <label className="relative cursor-pointer items-center">
        <input
          id="switch-3"
          type="checkbox"
          className="peer sr-only"
          onChange={() => {
            patchApplyManual(!btnState);
            setBtnState(!btnState);
          }}
          checked={btnState}
        />
        <label htmlFor="switch-3" className="hidden"></label>
        <div className="peer h-4 w-11 rounded border bg-slate-200 after:absolute after:-top-1 after:left-0 after:h-6 after:w-6 after:rounded-md after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-400 peer-checked:after:translate-x-full peer-focus:ring-blue-400"></div>
      </label>
    </div>
  );
}

export default ManualSettings;
