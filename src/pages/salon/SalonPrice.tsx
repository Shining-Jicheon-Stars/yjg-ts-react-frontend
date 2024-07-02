import { useEffect, useState } from "react";
import { SalonCategoryType } from "../../types/salon";
import { privateApi } from "../../services/customAxios";
import PriceTag from "../../components/salon/PriceTag";
import { ListBtn } from "../../components/table/Table";
import PriceIcon from "../../icons/PriceTag";
import SalonCategoryList from "../../components/salon/SalonCategoryList";
import SetBusinessTime from "../../components/salon/SetBusinessTime";

function SalonPrice() {
  // 전체 가격표 상태
  const [priceTag, setPriceTag] = useState(false);
  // 카테고리 데이터
  const [category, setCategory] = useState<SalonCategoryType[]>([]);
  // 카테고리 생성 명 입력 값
  const [newCategoryName, setNewCategoryName] = useState("");
  // 리스트종류 스테이트
  const [listKind, setListKind] = useState("male");
  const kind = [
    {
      state: "male",
      head: "男性",
    },
    {
      state: "female",
      head: "女性",
    },
  ];

  // 페이지 렌더링할 시
  useEffect(() => {
    getCategoryData();
  }, []);

  // 카테고리 리스트 가져오기
  const getCategoryData = async () => {
    try {
      const categoryData = await privateApi.get("/api/salon/category");
      setCategory(categoryData.data.categories);
    } catch (error) {
      console.log(error);
    }
  };

  // 카테고리 생성
  const createCategory = async () => {
    try {
      await privateApi.post("/api/salon/category", {
        category: newCategoryName,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // 카테고리 이름 수정하기
  const modifyCategory = async (id: string, newName: string) => {
    try {
      await privateApi.patch("/api/salon/category", {
        category_id: id,
        category: newName,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // 카테고리 삭제
  const deleteCategory = async (id: string) => {
    try {
      await privateApi.delete(`/api/salon/category/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <PriceTag
        priceTag={priceTag}
        setPriceTag={setPriceTag}
        category={category}
      />
      <div className="relative flex border-b-2 border-black">
        <div className="flex items-end gap-2 flex-1 text-4xl font-bold p-4 tracking-tighter text-left">
          <span className="mr-6">💈 値札管理</span>
          {kind.map((v) => {
            return (
              <span
                className={`${
                  listKind === v.state
                    ? "font-bold text-2xl text-blue-500"
                    : "text-gray-400 text-xl"
                } cursor-pointer`}
                onClick={() => {
                  setListKind(v.state);
                }}
              >
                {v.head}
              </span>
            );
          })}
        </div>
        <div className="absolute right-2 -bottom-16 flex gap-2 justify-end items-end py-4">
          <div>
            <input
              type="text"
              className="p-2 w-32 text-center focus:outline-none focus:ring-2 focus:rounded-xl focus:ring-blue-400 rounded-md shadow-md"
              placeholder="カテゴリー"
              onChange={(e) => {
                setNewCategoryName(e.target.value);
              }}
              value={newCategoryName}
            />
          </div>
          <div>
            <ListBtn
              value="生成"
              color="bg-blue-400/90"
              onClick={() => {
                createCategory().then(() => {
                  getCategoryData();
                });
                setNewCategoryName("");
              }}
            />
          </div>
        </div>
        <div className="flex flex-col mb-2 mr-1 bg-cyan-500/60 rounded-lg my-auto px-2 py-1 shadow-lg text-gray-700 hover:bg-cyan-400/80 hover:text-black cursor-pointer">
          <PriceIcon
            onClick={() => {
              setPriceTag(true);
            }}
          />
          <div className="text-xs font-bold text-center">値札</div>
        </div>
      </div>
      <div className="mt-16">
        {category.map((v) => (
          <SalonCategoryList
            id={v.id}
            category={v.category}
            gender={listKind}
            getCategoryFuc={getCategoryData}
            deleteCategoryFuc={deleteCategory}
            modifyCategoryFuc={modifyCategory}
          />
        ))}
      </div>
      <div className="flex border-b-2 border-black my-10">
        <div className="flex items-end gap-2 flex-1 text-4xl font-bold p-4 tracking-tighter text-left">
          <span className="mr-6">💈 営業時間の設定</span>
        </div>
      </div>
      <div className="flex flex-col gap-6 p-8 w-1/2 bg-white rounded-2xl shadow-lg">
        <SetBusinessTime />
      </div>
    </div>
  );
}

export default SalonPrice;
