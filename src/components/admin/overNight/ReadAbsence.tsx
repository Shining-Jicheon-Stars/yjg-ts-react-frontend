import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { privateApi } from "../../../services/customAxios";
import { ListBtn } from "../../table/Table";
import { AbsenceType } from "../../../types/admin";
import { useMutation, useQuery } from "@tanstack/react-query";

function ReadAbsence() {
  // 글 ID 값
  const { id } = useParams<string>();

  // 외박, 외출 데이터
  const [absence, setAbsence] = useState<AbsenceType>();
  const navigate = useNavigate();

  // 외출, 외박 데이터 get Api
  const getAbsenceDataApi = async () => {
    const response = await privateApi.get(`/api/absence/${id}`);

    return response.data;
  };

  // 외출, 외박 거절 Api
  const patchAbsenceApi = async (id: string) => {
    const response = await privateApi.patch(`/api/absence/reject/${id}`);

    return response.data;
  };

  // 외출, 외박 query
  const { data } = useQuery({
    queryKey: ["absenceData"],
    queryFn: getAbsenceDataApi,
  });

  useEffect(() => {
    if (data) setAbsence(data.stay_out);
  }, [data]);

  // 외출, 외박 거절 mutation
  const { mutate: patchAbsenceMutation } = useMutation({
    mutationFn: (id: string) => patchAbsenceApi(id),
    // Api 연결 성공
    onSuccess() {
      navigate("/main/admin/stayOut");
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex border-b-2 border-black items-end">
        <div className="flex-1 text-4xl font-bold tracking-tighter text-left p-4">
          {absence?.type === "sleep" ? "外泊" : "外出"}{" "}
          <span className="text-3xl">
            🗓 {absence?.start_date} ~ {absence?.end_date}
          </span>
        </div>

        <div className="flex flex-col p-2 font-bold text-right text-lg">
          <div>作成者 : {absence?.user.name}</div>
          <div>
            学番 :{" "}
            {absence?.user.student_id ? absence?.user.student_id : "未登録"}
          </div>
        </div>
      </div>

      <div className="bg-white relative rounded-xl border border-black/20 px-4 py-6 min-h-96 shadow-md">
        <div dangerouslySetInnerHTML={{ __html: absence?.content || "" }} />
      </div>

      <div className="flex justify-end gap-4">
        <ListBtn
          value="外出お断り"
          color="bg-orange-400/70"
          onClick={() => {
            if (id) {
              if (window.confirm("거절하시겠습니까?")) {
                alert("거절되었습니다");
                patchAbsenceMutation(id);
              } else {
                alert("취소되었습니다.");
              }
            }
          }}
        />
        <ListBtn
          value="close"
          color="bg-red-400/90"
          onClick={() => {
            navigate("/main/admin/stayOut");
          }}
        />
      </div>
    </div>
  );
}

export default ReadAbsence;
