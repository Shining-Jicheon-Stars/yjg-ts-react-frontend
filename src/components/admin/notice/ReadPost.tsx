import { useEffect, useState } from "react";
import ImageIcon from "../../../icons/ImageIcon";
import PostCardSlider from "../../post/PostCardSlider";
import CloseIcon from "../../../icons/CloseIcon";
import { ListBtn } from "../../table/Table";
import { useNavigate, useParams } from "react-router-dom";
import { privateApi } from "../../../services/customAxios";
import { NoticeType } from "../../../types/post";
import { useMutation, useQuery } from "@tanstack/react-query";

function ReadPost() {
  // 글 ID 값
  const { id } = useParams<string>();
  // 사진 보여주기 상태
  const [onPicture, setOnPicture] = useState(false);
  // 게시글 데이터
  const [notice, setNotice] = useState<NoticeType>();
  const navigate = useNavigate();

  // 게시글 get Api
  const getNoticeContentApi = async () => {
    const response = await privateApi.get(`/api/notice/${id}`);

    return response.data;
  };

  // 게시글 delete Api
  const deleteNoticeApi = async () => {
    const response = await privateApi.delete(`/api/notice/${id}`);

    return response.data;
  };

  // 게시글 query
  const { data } = useQuery({
    queryKey: ["noticeContent"],
    queryFn: getNoticeContentApi,
  });

  useEffect(() => {
    if (data) {
      setNotice(data.notice);
    }
  }, [data]);

  // 게시글 delete mutation
  const { mutate: noticeDeleteMutation } = useMutation({
    mutationFn: deleteNoticeApi,
    onSuccess() {
      navigate("/main/admin/notice");
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex border-b-2 border-black items-end">
        <div className="flex-1 text-4xl font-bold tracking-tighter text-left p-4">
          タイトル : {notice?.title}
        </div>

        <div className="flex flex-col p-2 font-bold text-right text-lg">
          <div>作成者 : {notice?.tag}</div>
          {notice?.urgent ? <div>タグ : 🚨 {notice.tag}</div> : null}
        </div>
      </div>

      <div className="bg-white rounded-xl relative border border-black/20 px-4 py-6 min-h-96 max-h-full shadow-md">
        <div className="absolute right-1 top-1">
          {notice?.notice_images.length ? (
            <ImageIcon
              onClick={() => {
                setOnPicture(!onPicture);
              }}
            />
          ) : null}
          {onPicture ? (
            <>
              <div className="absolute right-0 top-0 flex flex-col bg-white border border-black/20 rounded-lg overflow-hidden">
                <div className="w-full h-10 bg-cyan-500"></div>
                <div className="p-10 pb-14">
                  <div className="flex justify-center bg-black">
                    <PostCardSlider img={notice?.notice_images} />
                  </div>
                </div>
              </div>
              <div className="absolute right-0 top-0">
                <CloseIcon
                  onClick={() => {
                    setOnPicture(!onPicture);
                  }}
                />
              </div>
            </>
          ) : null}
        </div>
        <div dangerouslySetInnerHTML={{ __html: notice?.content || "" }} />
      </div>
      <div className="flex gap-4">
        <ListBtn
          value="修正"
          color="bg-sky-400/90"
          onClick={() => {
            navigate(`/main/admin/modifying/${id}`, {
              state: { type: "Post" },
            });
          }}
        />
        <ListBtn
          value="削除"
          color="bg-red-400/90"
          onClick={() => {
            if (window.confirm("삭제하시겠습니까?")) {
              alert("삭제되었습니다");
              noticeDeleteMutation();
            } else {
              alert("취소되었습니다.");
            }
          }}
        />
        <div className="flex flex-1 justify-end">
          <ListBtn
            value="close"
            color="bg-gray-400/90"
            onClick={() => {
              navigate("/main/admin/notice");
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ReadPost;
