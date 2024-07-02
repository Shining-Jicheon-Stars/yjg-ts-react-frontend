import { useNavigate } from "react-router-dom";
import PostImg from "../../components/post/PostImg";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Editor from "../../components/post/Editor";
import FormInput from "../../components/auth/FormInput";
import { ListBtn } from "../../components/table/Table";
import { PostFormType } from "../../types/post";
import { useMutation } from "@tanstack/react-query";
import { privateApi } from "../../services/customAxios";

function Writing() {
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm<PostFormType>();
  const navigate = useNavigate();

  // 공지사항 작성 Api
  const noticeApi = async (data: PostFormType) => {
    const formData = new FormData();
    if (data.images && data.images.length > 0) {
      data.images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });
    }
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("tag", data.tag);
    if (data.urgent) {
      formData.append("urgent", "1");
    } else {
      formData.append("urgent", "0");
    }
    const response = await privateApi.post("/api/notice", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  };

  // 공지사항 mutation
  const { mutate: noticeMutation } = useMutation({
    mutationFn: (data: PostFormType) => noticeApi(data),
    // Api 연결 성공
    onSuccess() {
      navigate("/main/admin/notice");
    },
  });

  // 공지사항 제출 함수
  const onSubmit: SubmitHandler<PostFormType> = async (data) => {
    noticeMutation(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-4">
      <div className="flex">
        <div className="font-bold text-3xl mb-10">お知らせの作成</div>
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
            タグの選択
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

export default Writing;
