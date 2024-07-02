import { useEffect, useState } from "react";
import { ListBtn } from "../table/Table";
import {
  SalonCategoryType,
  GetServiceType,
  SalonServiceType,
} from "../../types/salon";
import { privateApi } from "../../services/customAxios";
import SalonServiceList from "./SalonServiceList";
import { AxiosRequestConfig } from "axios";

function SalonCategoryList(props: SalonCategoryType) {
  const {
    id,
    category,
    gender,
    deleteCategoryFuc,
    modifyCategoryFuc,
    getCategoryFuc,
  } = props;
  // 카테고리 이름 수정 상태
  const [modify, setModify] = useState(false);
  // 수정 내용
  const [newName, setNewName] = useState("");
  // 서비스 드롭다운 상태
  const [dropdown, setDropdown] = useState(false);
  // 서비스 리스트
  const [service, setService] = useState<SalonServiceType[]>([]);

  // 수정할 시
  useEffect(() => {
    if (modify) {
      setNewName(category);
    }
  }, [modify]);

  // 성별 바뀔 시
  useEffect(() => {
    getServiceData({ category_id: id, gender: gender });
  }, [gender]);

  // 서비스 리스트 가져오기
  const getServiceData = async (data: GetServiceType) => {
    try {
      const config: AxiosRequestConfig = {
        params: data,
      };
      const serviceData = await privateApi.get("/api/salon/service", config);
      setService(serviceData.data.services);
    } catch (error) {
      console.log(error);
    }
  };

  // 서비스 리스트 추가하기
  const createService = async (id: string, service: string, price: string) => {
    try {
      await privateApi.post("/api/salon/service", {
        category_id: id,
        service: service,
        gender: gender,
        price: price,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // 서비스 리스트 삭제하기
  const deleteService = async (service_id: string) => {
    try {
      await privateApi.delete(`/api/salon/service/${service_id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="bg-white flex gap-3 items-center border-2 border-gray-300 p-4 rounded-lg mt-10 text-2xl font-bold shadow-md">
        {modify ? (
          <>
            <input
              type="text"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
              }}
              className="w-32 text-center outline-none border-b-2 border-gray-400"
            />
            <ListBtn
              value="完了"
              color="bg-sky-400/90"
              onClick={() => {
                setModify(false);
                modifyCategoryFuc(id, newName).then(() => {
                  getCategoryFuc();
                });
              }}
            />
            <ListBtn
              value="キャンセル"
              color="bg-red-400/90"
              onClick={() => {
                setModify(false);
              }}
            />
          </>
        ) : (
          <>
            <div className="w-32 text-center">{category}</div>
            <ListBtn
              value="修整"
              color="bg-orange-400/90"
              onClick={() => {
                setModify(true);
              }}
            />
            <ListBtn
              value="削除"
              color="bg-red-400/90"
              onClick={() => {
                if (window.confirm("삭제하시겠습니까?")) {
                  alert("삭제되었습니다");
                  deleteCategoryFuc(id).then(() => {
                    getCategoryFuc();
                  });
                } else {
                  alert("취소되었습니다.");
                }
              }}
            />
          </>
        )}
        <div className="flex-1 flex justify-end">
          <span
            className="text-sm items-center underline underline-offset-4 cursor-pointer text-gray-500"
            onClick={() => {
              setDropdown(!dropdown);
              if (!dropdown)
                getServiceData({ category_id: id, gender: gender });
            }}
          >
            {dropdown ? "close" : "open"}
          </span>
        </div>
      </div>
      {dropdown ? (
        <SalonServiceList
          id={id}
          service={service}
          gender={gender}
          createServiceFuc={createService}
          deleteServiceFuc={deleteService}
          getServiceFuc={getServiceData}
        />
      ) : null}
    </div>
  );
}

export default SalonCategoryList;
