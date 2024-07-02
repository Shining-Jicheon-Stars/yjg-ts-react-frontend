import { useState } from "react";
import { MealType } from "../../types/restaurant";
import { useHorizontalScroll } from "../../hook/useSideScroll";
import { privateApi } from "../../services/customAxios";
import { ListBtn } from "../../components/table/Table";
import CloseIcon from "../../icons/CloseIcon";
import { formatCurrency } from "../../utils/formatCurrency";
import SemesterList from "../../components/restaurant/semesterStatus/SemesterList";

function RestaurantSemesterMeal() {
  // 유형 모달 on/off
  const [onModal, setOnModal] = useState<boolean>(false);
  // 유형 작업 상태
  const [modalStatus, setModalStatus] = useState<string | null>();
  // 식수 유형 값
  const [mealType, setMealType] = useState<MealType[]>([]);
  // 선택 된 유형
  const [selectedType, setSelectedType] = useState<MealType>({
    meal_type: "",
    content: "",
    price: "",
  });
  // 새로운 유형 값
  const [newMealType, setNewMealType] = useState<MealType>({
    meal_type: "",
    content: "",
    price: "",
  });
  // 가로스크롤 훅
  const scrollRef = useHorizontalScroll<HTMLDivElement>();

  // 주말 식수 유형 가져오기
  const getWeekendMealTypeData = async () => {
    try {
      const weekendMealTypeData = await privateApi.get(
        "/api/restaurant/semester/meal-type/get"
      );
      setMealType(weekendMealTypeData.data.semester_meal_type);
    } catch (error) {
      console.log(error);
    }
  };

  // 학기 식수 유형 생성하기
  const createSemesterMealTypeData = async () => {
    try {
      await privateApi.post("/api/semester/meal-type", newMealType);
    } catch (error) {
      console.log(error);
    }
  };

  // 주말 식수 유형 삭제하기
  const deleteSemesterMealTypeData = async (id: string) => {
    try {
      await privateApi.delete(`/api/restaurant/semester/m/delete/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  // 주말 식수 유형 수정하기
  const patchSemesterMealTypeData = async (id: string) => {
    try {
      await privateApi.patch(`/api/restaurant/semester/m/update/${id}`, {
        meal_type: newMealType.meal_type,
        content: newMealType.content,
        price: newMealType.price,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // 유형 CRUD 상태에 따른 창 가져오기
  const onModalFuc = () => {
    if (modalStatus === null) {
      return;
    } else if (modalStatus === "create") {
      return (
        <div className="absolute right-0 bg-white w-7/12 mt-3 p-10 rounded-md shadow-lg">
          <div className="flex items-center gap-10 mb-7">
            <div className="font-bold text-2xl">タイプ作成</div>
            <ListBtn
              value="追加完了"
              color="bg-sky-400/90"
              onClick={() => {
                createSemesterMealTypeData().then(() => {
                  setModalStatus(null);
                  getWeekendMealTypeData();
                });
              }}
            />
            <div className="absolute right-1 top-1">
              <CloseIcon
                onClick={() => {
                  setModalStatus(null);
                }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-7">
            <input
              type="text"
              placeholder="タイプ名の作成"
              value={newMealType.meal_type}
              onChange={(e) => {
                let copy = { ...newMealType };
                copy.meal_type = e.target.value;
                setNewMealType(copy);
              }}
              className="w-full p-2 outline-none border-b-2 border-black/50"
            />
            <input
              type="text"
              placeholder="タイプ構成の作成"
              value={newMealType.content}
              onChange={(e) => {
                let copy = { ...newMealType };
                copy.content = e.target.value;
                setNewMealType(copy);
              }}
              className="w-full p-2 outline-none border-b-2 border-black/50"
            />
            <input
              type="text"
              placeholder="タイプ価格の作成"
              value={newMealType.price}
              onChange={(e) => {
                let copy = { ...newMealType };
                copy.price = e.target.value;
                setNewMealType(copy);
              }}
              className="w-full p-2 outline-none border-b-2 border-black/50"
            />
          </div>
        </div>
      );
    } else if (modalStatus === "manage") {
      return (
        <div className="absolute right-0 bg-white w-fit mt-3 p-10 rounded-md shadow-lg">
          <div className="flex items-center gap-5 mb-7">
            <div className="font-bold text-2xl">タイプ管理</div>

            <ListBtn
              value="修正完了"
              color="bg-blue-400/90"
              onClick={() => {
                if (selectedType.id) {
                  patchSemesterMealTypeData(selectedType.id).then(() => {
                    getWeekendMealTypeData();
                    setModalStatus(null);
                  });
                }
              }}
            />
            <ListBtn
              value="削除"
              color="bg-red-400/90"
              onClick={() => {
                if (selectedType.id) {
                  deleteSemesterMealTypeData(selectedType.id).then(() => {
                    getWeekendMealTypeData();
                    setModalStatus(null);
                  });
                }
              }}
            />

            <div className="absolute right-1 top-1">
              <CloseIcon
                onClick={() => {
                  setModalStatus(null);
                }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-7">
            <input
              type="text"
              placeholder="タイプ名の修正"
              value={newMealType.meal_type}
              onChange={(e) => {
                let copy = { ...newMealType };
                copy.meal_type = e.target.value;
                setNewMealType(copy);
              }}
              className="w-full p-2 outline-none border-b-2 border-black/50"
            />
            <input
              type="text"
              placeholder="タイプ構成の修正"
              value={newMealType.content}
              onChange={(e) => {
                let copy = { ...newMealType };
                copy.content = e.target.value;
                setNewMealType(copy);
              }}
              className="w-full p-2 outline-none border-b-2 border-black/50"
            />
            <input
              type="text"
              placeholder="タイプ価格の修正"
              value={newMealType.price}
              onChange={(e) => {
                let copy = { ...newMealType };
                copy.price = e.target.value;
                setNewMealType(copy);
              }}
              className="w-full p-2 outline-none border-b-2 border-black/50"
            />
          </div>
        </div>
      );
    }
  };

  return (
    <div className="relative">
      {onModal ? (
        <div className="absolute z-20 right-0 w-1/2">
          <div className="bg-white w-full p-10 rounded-md shadow-lg">
            <div className="flex items-center gap-10 mb-7">
              <div className="font-bold text-2xl">学期の植樹タイプリスト</div>
              <div>
                <ListBtn
                  value="追加"
                  color="bg-blue-400/90"
                  onClick={() => {
                    setModalStatus("create");
                    setNewMealType({
                      meal_type: "",
                      content: "",
                      price: "",
                    });
                  }}
                />
              </div>
            </div>
            <div className="absolute right-1 top-1">
              <CloseIcon
                onClick={() => {
                  setOnModal(false);
                }}
              />
            </div>
            <div
              ref={scrollRef}
              className="flex gap-7 w-full justify-start overflow-auto"
            >
              {mealType.map((v) => {
                return (
                  <div
                    className="flex flex-col whitespace-nowrap min-w-fit bg-white border border-black/20 py-5 px-8 tracking-tighter rounded-2xl font-bold shadow-md cursor-pointer"
                    onClick={() => {
                      setSelectedType(v);
                      setModalStatus("manage");
                      setNewMealType(v);
                    }}
                  >
                    <div className="text-xl text-cyan-600">
                      {v.meal_type}類型
                    </div>
                    <div className="flex flex-col gap-2 text-sm mt-2 text-gray-500 ">
                      <div>構成 : {v.content}</div>
                      <div>価格 : {formatCurrency(v.price)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {onModalFuc()}
        </div>
      ) : null}
      <div className="absolute right-0">
        <ListBtn
          value="学期の植樹タイプ"
          color="bg-cyan-500/90"
          onClick={() => {
            setOnModal(true);
            getWeekendMealTypeData();
          }}
        />
      </div>
      <SemesterList />
    </div>
  );
}

export default RestaurantSemesterMeal;
