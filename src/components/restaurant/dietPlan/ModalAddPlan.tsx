import { ChangeEvent, useRef, useState } from "react";
import CloseIcon from "../../../icons/CloseIcon";
import PlusIcon from "../../../icons/PlusIcon";
import { ListBtn } from "../../table/Table";
import { privateApi } from "../../../services/customAxios";

function ModalAddPlan(props: { setOnModal: (onModal: boolean) => void }) {
  const { setOnModal } = props;
  // 파일 상태
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 식단표 엑셀파일 업로드
  const postExcelFile = async () => {
    if (files.length > 0) {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("excel_file", file);
      });
      console.log(formData.get("excel_file"));
      try {
        await privateApi.post("/api/restaurant/menu", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("업로드 완료");
        setOnModal(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // 버튼 input 연결
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // 파일 첨부 시
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files;
    const updatedFiles = [...files];
    if (file) {
      for (let i = 0; i < file.length; i++) {
        updatedFiles.push(file[i]);
      }
    }
    setFiles(updatedFiles);
  };

  // 선택된 파일 삭제 시
  const handleImageDelete = (index: number) => {
    const updatedImages = [...files];
    updatedImages.splice(index, 1);
    setFiles(updatedImages);
  };

  // 이미지 미리보기 생성
  const renderImagePreviews = () => {
    return (
      <div id="gallery" className="flex flex-col gap-4">
        {files.length > 0 ? (
          files.map((file, index) => (
            <div className="flex border-b-2 border-green-700 font-bold">
              <div className="flex-1 p-2">{file.name}</div>
              <div className="">
                <CloseIcon
                  onClick={() => {
                    handleImageDelete(index);
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <div
            id="empty"
            className="h-full w-full text-center flex flex-col mt-20 justify-center"
          >
            <img
              className="mx-auto w-32"
              src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
              alt="no data"
            />
            <span className="text-small text-gray-500">No files selected</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed flex items-center justify-center z-40 inset-0 bg-black/35">
      <div className="bg-white w-4/6 h-4/5 py-12 overflow-auto rounded-xl">
        <section className="relative px-8 gap-6 w-full h-5/6 flex flex-col">
          <div className="font-bold text-3xl">献立表追加</div>
          <div
            className="border-dashed border-2 border-gray-400 py-12 flex flex-col justify-center items-center cursor-pointer"
            onClick={handleButtonClick}
          >
            <input
              ref={fileInputRef}
              id="hidden-input"
              type="file"
              multiple
              accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              className="hidden"
              onChange={handleFileChange}
            />
            <PlusIcon />
          </div>
          <h1 className="absolute translate-y-52 bg-white px-2 translate-x-2 font-semibold sm:text-lg text-gray-900">
            To Upload
          </h1>
          <div
            className={`${
              files.length > 0 ? "border-2 border-green-600" : null
            } h-96 overflow-auto rounded-md p-6`}
          >
            {renderImagePreviews()}
          </div>
        </section>

        <footer className="flex flex-1 justify-end bottom-0 px-8 gap-2 mt-16 ">
          <ListBtn
            value="アップロード"
            color="bg-blue-400/90"
            onClick={() => {
              postExcelFile();
            }}
          />
          <ListBtn
            value="キャンセル"
            color="bg-red-400/90"
            onClick={() => {
              setOnModal(false);
            }}
          />
        </footer>
      </div>
    </div>
  );
}

export default ModalAddPlan;
