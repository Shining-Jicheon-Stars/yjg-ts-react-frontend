import { useEffect, useState } from "react";
import CloseIcon from "../../icons/CloseIcon";
import { privateApi } from "../../services/customAxios";
import {
  PriceTagType,
  ServiceTagType,
  SalonServiceType,
} from "../../types/salon";

function PriceTag(props: PriceTagType) {
  const { priceTag, setPriceTag, category } = props;
  // 서비스 데이터
  const [service, setService] = useState<SalonServiceType[]>([]);

  // 서비스 리스트 가져오기
  const getServiceData = async () => {
    try {
      const serviceData = await privateApi.get("/api/salon/service");
      setService(serviceData.data.services);
    } catch (error) {
      console.log(error);
    }
  };

  // 페이지 렌더링할 시
  useEffect(() => {
    if (priceTag) getServiceData();
  }, [priceTag]);

  return (
    <div>
      {priceTag ? (
        <div className="fixed flex items-center justify-center inset-0 z-30 bg-black/35">
          <div className="relative flex flex-col bg-emerald-900 w-3/4 h-5/6 py-10 px-10 text-white text-center font-bold overflow-auto">
            <div className="absolute right-4 top-4">
              <CloseIcon
                onClick={() => {
                  setPriceTag(false);
                }}
              />
            </div>
            <div className="text-3xl">✨ 美容室価格表 ✨</div>
            <div className="flex mt-7 text-lg border-b border-white pb-6">
              <div className="flex-1 flex flex-col gap-4">
                <div>MAN</div>
                <ServiceTag
                  category={category}
                  service={service}
                  gender="male"
                />
              </div>
              <div className="bg-white w-1 mx-10"></div>
              <div className="flex-1 flex flex-col gap-4">
                <div>WOMAN</div>
                <ServiceTag
                  category={category}
                  service={service}
                  gender="female"
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default PriceTag;

function ServiceTag(props: ServiceTagType) {
  const { category, service, gender } = props;
  return (
    <>
      {category.map((category) => {
        return (
          <div className="flex flex-col">
            <div className="text-yellow-300 text-2xl text-left mb-2">
              {category.category}
            </div>
            <div>
              {service.map((service) => {
                if (
                  service.salon_category_id === category.id &&
                  service.gender === gender
                ) {
                  return (
                    <div className="flex pl-8">
                      <div>{service.service}</div>
                      <div className="flex-1"></div>
                      <div>...... {service.price}</div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}
