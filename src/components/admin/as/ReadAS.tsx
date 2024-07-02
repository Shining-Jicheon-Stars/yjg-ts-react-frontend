import { useNavigate, useParams } from "react-router-dom";
import { privateApi } from "../../../services/customAxios";
import { useEffect, useState } from "react";
import { AfterServiceType } from "../../../types/post";
import PostCardSlider from "../../post/PostCardSlider";
import CloseIcon from "../../../icons/CloseIcon";
import { ListBtn } from "../../table/Table";
import ImageIcon from "../../../icons/ImageIcon";
import CommentList from "./comment/CommentList";
import { useMutation, useQuery } from "@tanstack/react-query";

function ReadAS() {
  // 글 ID 값
  const { id } = useParams<string>();
  // 사진 보여주기 상태
  const [onPicture, setOnPicture] = useState(false);
  // AS 데이터
  const [afterService, setAfterService] = useState<AfterServiceType>();
  const navigate = useNavigate();

  // A/S get Api
  const getASApi = async () => {
    const response = await privateApi.get(`/api/after-service/${id}`);

    return response.data;
  };

  // A/S 상태 변경 Api
  const patchASApi = async () => {
    const response = await privateApi.patch(`/api/after-service/status/${id}`);

    return response.data;
  };

  // A/S query
  const { data } = useQuery({
    queryKey: ["A/SData"],
    queryFn: getASApi,
  });

  useEffect(() => {
    if (data) setAfterService(data.afterService);
  }, [data]);

  // A/S 상태 변경 mutation
  const { mutate: patchASMutation } = useMutation({
    mutationFn: patchASApi,
    // Api 연결 성공
    onSuccess() {
      navigate("/main/admin/repair");
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex border-b-2 border-black items-end">
        <div className="flex-1 text-4xl font-bold tracking-tighter text-left p-4">
          タイトル : {afterService?.title}
        </div>

        <div className="flex flex-col p-2 font-bold text-right text-lg">
          <div>作成者 : {afterService?.user.name}</div>
        </div>
      </div>
      <div className="flex gap-10 text-xl font-bold">
        <div>
          場所: <span>{afterService?.visit_place}</span>
        </div>
        <div>
          希望処理日: <span>{afterService?.visit_date}</span>
        </div>
      </div>
      <div className="bg-white relative rounded-lg border border-black/40 px-4 py-6 min-h-96">
        <div className="absolute right-1 top-1">
          {afterService?.after_service_images?.length ? (
            <ImageIcon
              onClick={() => {
                setOnPicture(!onPicture);
              }}
            />
          ) : null}
          {onPicture ? (
            <>
              <div className="absolute right-0 top-0 z-10 flex flex-col bg-white border border-black/20 rounded-lg overflow-hidden">
                <div className="w-full h-10 bg-cyan-500"></div>
                <div className="p-10 pb-14">
                  <div className="flex justify-center bg-black">
                    <PostCardSlider img={afterService?.after_service_images} />
                  </div>
                </div>
              </div>
              <div className="absolute right-0 top-0 z-20">
                <CloseIcon
                  onClick={() => {
                    setOnPicture(!onPicture);
                  }}
                />
              </div>
            </>
          ) : null}
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: afterService?.content || "" }}
        />
      </div>
      <CommentList id={id} />
      {afterService?.status ? null : (
        <div className="flex justify-end gap-4">
          <ListBtn
            value="A/S 完了"
            color="bg-sky-400/90"
            onClick={patchASMutation}
          />
          <ListBtn
            value="close"
            color="bg-red-400/90"
            onClick={() => {
              navigate("/main/admin/repair");
            }}
          />
        </div>
      )}
    </div>
  );
}

export default ReadAS;
