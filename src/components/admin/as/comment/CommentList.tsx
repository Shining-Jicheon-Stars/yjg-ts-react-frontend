import { useEffect, useState } from "react";
import { privateApi } from "../../../../services/customAxios";
import { GetCommentDataType } from "../../../../types/admin";
import Comments from "./Comments";
import SendIcon from "../../../../icons/SendIcon";

function CommentList(props: { id?: string }) {
  const { id } = props;
  // 현재 작성된 댓글
  const [comment, setComment] = useState<string>("");
  // 게시글 댓글 데이터
  const [commentData, setCommentData] = useState<GetCommentDataType[]>([]);

  // 페이지 렌더링 시
  useEffect(() => {
    getComment();
  }, []);

  // 댓글 가져오기
  const getComment = async () => {
    try {
      const commentData = await privateApi.get(
        `/api/after-service/${id}/comment`
      );
      setCommentData(commentData.data.after_service_comments);
    } catch (error) {
      console.log(error);
    }
  };

  // 댓글 작성하기
  const postComment = async () => {
    try {
      await privateApi.post(`/api/after-service/${id}/comment`, {
        comment: comment,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // 댓글 삭제하기
  const deleteComment = async (id: string) => {
    try {
      await privateApi.delete(`/api/after-service/comment/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-wrap -mx-3 mb-6 py-2 px-4">
      <h2 className="px-4 text-gray-800 text-sm font-bold">コメントを書き</h2>
      <div className="relative w-full px-3 mb-2 mt-1">
        <div
          className="bg-gray-100 absolute right-5 bottom-3 border border-black rounded-full border-opacity-40 p-1 cursor-pointer hover:bg-slate-200"
          onClick={() => {
            postComment().then(() => {
              getComment();
            });
            setComment("");
          }}
        >
          <SendIcon />
        </div>
        <textarea
          className="bg-white rounded border border-gray-400 leading-normal resize-none w-full h-20 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white"
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
          }}
        ></textarea>
      </div>

      {/* <div className="flex items-end py-3">
          <div className="ml-auto">
            <input
              type="button"
              className="bg-sky-100/60 text-gray-700 font-medium py-1 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-gray-300 cursor-pointer"
              value="작성"
              onClick={() => {
                postComment().then(() => {
                  getComment();
                });
                setComment("");
              }}
            />
          </div>
        </div> */}
      <h2 className="px-4 mb-2 text-gray-800 text-xl font-bold">
        コメント({commentData.length})
      </h2>
      <div className="bg-white border border-black/30 flex flex-col gap-3 rounded-lg h-[20rem] w-full overflow-auto px-5 py-3">
        {commentData.map((comment) => {
          return (
            <Comments
              comment={comment}
              getComment={getComment}
              deleteComment={deleteComment}
            />
          );
        })}
      </div>
    </div>
  );
}

export default CommentList;
