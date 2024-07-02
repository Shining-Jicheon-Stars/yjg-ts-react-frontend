import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ModifyFormType, NoticeType } from "../../types/post";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { privateApi } from "../../services/customAxios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ListBtn } from "../../components/table/Table";
import FormInput from "../../components/auth/FormInput";
import Editor from "../../components/post/Editor";
import PostPrevImg from "../../components/post/PostPrevImg";
import PostImg from "../../components/post/PostImg";

function Modifying() {
  // 수정하는 게시글 ID
  const { id } = useParams();
  // 수정하는 게시글 DATA
  const [notice, setNotice] = useState<NoticeType>();
  const {
    handleSubmit,
    control,
    register,
    setValue,
    formState: { errors },
  } = useForm<ModifyFormType>();
  const navigate = useNavigate();

  // 공지사항 마운트 시
  useEffect(() => {
    if (notice) {
      setValue("title", notice.title);
      setValue("tag", notice.tag);
      setValue("urgent", notice.urgent);
      setValue("content", notice.content);
    }
  }, [notice]);

  // 공지사항 상세 조회 APi
  const getNoticeContentApi = async () => {
    const response = await privateApi.get(`/api/notice/${id}`);

    return response.data;
  };

  // 공지사항 수정 Api
  const postNoticeApi = async (data: ModifyFormType) => {
    const formData = new FormData();
    if (data.images && data.images.length > 0) {
      data.images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });
    }
    if (data.delete_images && data.delete_images.length > 0) {
      data.delete_images.forEach((id, index) => {
        formData.append(`delete_images[${index}]`, id);
      });
    }
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("tag", data.tag);
    formData.append("_method", "PATCH");
    if (data.urgent) {
      formData.append("urgent", "1");
    }
    const response = await privateApi.post(`/api/notice/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  };

  // 상세 공지사항 query
  const { data } = useQuery({
    queryKey: ["noticeContent"],
    queryFn: getNoticeContentApi,
  });

  useEffect(() => {
    if (data) setNotice(data.notice);
  }, [data]);

  // 공지사항 수정 mutation
  const { mutate: postNoticeMutation } = useMutation({
    mutationFn: (data: ModifyFormType) => postNoticeApi(data),
    onSuccess() {
      navigate(`/main/admin/reading/${id}`, { state: { type: "Post" } });
    },
  });

  // 공지사항 수정 제출 함수
  const onSubmit: SubmitHandler<ModifyFormType> = async (data) => {
    postNoticeMutation(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-4">
      <div className="flex">
        <div className="font-bold text-3xl mb-10">お知らせの修正</div>
        <div className="flex-1"></div>
        <div className="flex gap-5 h-fit">
          <ListBtn
            value="完了"
            color="bg-blue-400/90"
            type="submit"
            onClick={() => {}}
          />
          <ListBtn
            value="キャンセル"
            color="bg-red-400/90"
            onClick={() => {
              navigate(-1);
            }}
          />{" "}
        </div>
      </div>
      <FormInput
        type="text"
        name="title"
        label="タイトル"
        placeholder="タイトルの入力をお願いします"
        register={register("title", {
          required: "タイトルの入力をお願いします",
        })}
        errorMessage={errors?.title && errors.title.message}
      />
      <div className="flex gap-10">
        <div className="w-1/3">
          <label htmlFor="tag" className="block mb-2 text-cyan-600 font-bold">
            태그 선택
          </label>
          <select
            {...register("tag", {
              required: "タグの選択をお願いします",
            })}
            id="tag"
            className="bg-gray-50 mb-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 shadow-md"
          >
            <option value="admin">行政</option>
            <option value="restaurant">食堂</option>
            <option value="salon">美容室</option>
            <option value="bus">バス</option>
          </select>
        </div>
        <div className="flex">
          <label className="flex items-center mt-3">
            <input
              {...register("urgent")}
              type="checkbox"
              className="form-checkbox h-5 w-5 text-gray-600 shadow-sm"
            />
            <span className="ml-2 text-gray-700">緊急のお知らせ</span>
          </label>
        </div>
      </div>
      {errors?.content && (
        <span className="text-red-500 text-xs font-bold translate-x-2 tracking-tight mb-2">
          {errors.content.message}
        </span>
      )}
      <div className="bg-white mb-4 shadow-md">
        <Controller
          control={control}
          name="content"
          defaultValue=""
          rules={{
            validate: (value) =>
              (value && value.trim() !== "" && value !== "<p><br></p>") ||
              "本文の入力をお願いします",
          }}
          render={({ field }) => (
            <Editor value={field.value} setValue={field.onChange} />
          )}
        />
      </div>
      {notice?.notice_images ? (
        <Controller
          control={control}
          name="delete_images"
          defaultValue={[]}
          render={({ field }) => (
            <PostPrevImg
              prevImgData={notice.notice_images}
              prevImg={field.value}
              setPrevImg={field.onChange}
            />
          )}
        />
      ) : null}
      <Controller
        control={control}
        name="images"
        defaultValue={[]}
        render={({ field }) => (
          <PostImg selectedImg={field.value} setSelectedImg={field.onChange} />
        )}
      />
    </form>
  );
}

export default Modifying;
