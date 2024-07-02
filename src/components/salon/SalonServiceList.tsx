import { useEffect, useState } from "react";
import PlusIcon from "../../icons/PlusIcon";
import { SalonServiceListType, ServiceListType } from "../../types/salon";
import { ListBtn, ListHead } from "../table/Table";
import { privateApi } from "../../services/customAxios";
import { formatCurrency } from "../../utils/formatCurrency";

function SalonServiceList(props: SalonServiceListType) {
  const {
    service,
    id,
    gender,
    createServiceFuc,
    deleteServiceFuc,
    getServiceFuc,
  } = props;
  const headList = [
    { value: "施術名", col: "col-span-1" },
    { value: "値段", col: "col-span-1" },
    { value: "", col: "col-span-1" },
  ];

  // 서비스 생성 상태
  const [createService, setCreateService] = useState(false);
  // 새로운 서비스 명
  const [newName, setNewName] = useState("");
  // 새로운 서비스 값
  const [newValue, setNewValue] = useState("");

  // 생성 칸 열릴 시 초기화 작업
  useEffect(() => {
    setNewName("");
    setNewValue("");
  }, [createService]);

  return (
    <>
      <div className="bg-white relative grid grid-cols-3 mt-2 text-center border-x border-black/10 shadow-lg overflow-hidden rounded-2xl">
        {<ListHead headList={headList} />}
        <div className="absolute right-0 pt-1 pr-2">
          <PlusIcon
            onClick={() => {
              setCreateService(true);
            }}
          />
        </div>
        {createService ? (
          <>
            <input
              id="name"
              type="text"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
              }}
              className="p-2 mx-5 my-3 text-center font-bold text-xl border border-black rounded-md"
            />
            <input
              id="value"
              type="text"
              value={newValue}
              onChange={(e) => {
                setNewValue(e.target.value);
              }}
              className="p-2 mx-5 my-3 text-center font-bold text-xl border border-black rounded-md"
            />
            <div className="flex gap-3 items-center justify-center">
              <ListBtn
                value="生成"
                color="bg-blue-400/90"
                onClick={() => {
                  createServiceFuc(id, newName, newValue).then(() => {
                    getServiceFuc({ category_id: id, gender: gender });
                  });
                  setCreateService(false);
                }}
              />
              <ListBtn
                value="キャンセル"
                color="bg-red-400/90"
                onClick={() => {
                  setCreateService(false);
                }}
              />
            </div>
          </>
        ) : null}

        {service.map((service) => (
          <ServiceList
            category_id={id}
            service={service}
            gender={gender}
            getServiceFuc={getServiceFuc}
            deleteServiceFuc={deleteServiceFuc}
          />
        ))}
      </div>
    </>
  );
}

export default SalonServiceList;

function ServiceList(props: ServiceListType) {
  const { category_id, service, gender, getServiceFuc, deleteServiceFuc } =
    props;
  // 수정 상태
  const [onModify, setOnModify] = useState(false);
  // 수정된 시술명
  const [newService, setNewService] = useState("");
  // 수정된 가격
  const [newPrice, setNewPrice] = useState("");

  // 서비스 수정하기
  const patchService = async (id: string) => {
    try {
      await privateApi.patch(`/api/salon/service/${id}`, {
        service: newService,
        price: newPrice,
        gender: gender,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {onModify ? (
        <>
          <div className="border-b border-r py-5 px-6 font-semibold text-lg">
            <input
              type="text"
              className="flex-1 border-b border-black/20 text-center outline-none"
              value={newService}
              onChange={(e) => {
                setNewService(e.target.value);
              }}
            />
          </div>
          <div className="border-b border-r py-5 px-6 font-semibold text-lg">
            <input
              type="text"
              className="flex-1 border-b border-black/20 text-center outline-none"
              value={newPrice}
              onChange={(e) => {
                setNewPrice(e.target.value);
              }}
            />
          </div>
          <div className="m-auto border-b py-4 w-full space-x-5 text-center">
            <ListBtn
              value="修正完了"
              color="bg-sky-400/90"
              onClick={() => {
                patchService(service.id).then(() => {
                  setOnModify(false);
                  getServiceFuc({ category_id: category_id, gender: gender });
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
        </>
      ) : (
        <>
          <div className="border-b border-r py-5 px-6 font-semibold text-lg">
            {service.service}
          </div>
          <div className="border-b border-r py-5 px-6 font-semibold text-lg">
            {formatCurrency(service.price)}
          </div>
          <div className="m-auto border-b py-4 w-full space-x-5 text-center">
            <ListBtn
              value="修正"
              color="bg-sky-400/90"
              onClick={() => {
                setOnModify(true);
                setNewService(service.service);
                setNewPrice(service.price);
              }}
            />
            <ListBtn
              value="削除"
              color="bg-red-400/90"
              onClick={() => {
                deleteServiceFuc(service.id).then(() => {
                  if (window.confirm("삭제하시겠습니까?")) {
                    alert("삭제되었습니다");
                    getServiceFuc({ category_id: category_id, gender: gender });
                  } else {
                    alert("취소되었습니다.");
                  }
                });
              }}
            />
          </div>
        </>
      )}
    </>
  );
}
