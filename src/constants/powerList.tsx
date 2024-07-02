import AdminIcon from "../icons/AdminIcon";
import MasterIcon from "../icons/MasterIcon";
import RestaurantIcon from "../icons/RestaurantIcon";
import SalonIcon from "../icons/SalonIcon";

const basePath = (address: string): string => {
  return "/main/" + address;
};

export const master = {
  power: "総管理者",
  icon: <MasterIcon />,
  list: [
    {
      name: "全体のユーザー管理",
      path: basePath("master/management"),
    },
    {
      name: "未承認ユーザー管理",
      path: basePath("master/unapprovedUser"),
    },
  ],
};

export const salon = {
  power: "美容室",
  icon: <SalonIcon />,
  list: [
    { name: "承認予約リスト", path: basePath("salon/reservation") },
    {
      name: "未承認の予約リスト",
      path: basePath("salon/pending"),
    },
    {
      name: "営業管理",
      path: basePath("salon/priceCorrection"),
    },
  ],
};

export const admin = {
  power: "行政",
  icon: <AdminIcon />,
  list: [
    { name: "お知らせ", path: basePath("admin/notice") },
    {
      name: "外泊 / お出かけ",
      path: basePath("admin/stayOut"),
    },
    {
      name: "A/S",
      path: basePath("admin/repair"),
    },
    {
      name: "会議室",
      path: basePath("admin/meetingRoom"),
    },
    {
      name: "バスの時刻表",
      path: basePath("admin/busTimeTable"),
    },
  ],
};

export const restaurant = {
  power: "食堂",
  icon: <RestaurantIcon />,
  list: [
    {
      name: "営業管理",
      path: basePath("restaurant/management"),
    },
    {
      name: "献立表の追加",
      path: basePath("restaurant/dietPlan"),
    },
    {
      name: "週末の食事状況",
      path: basePath("restaurant/weekendMeal"),
    },
    {
      name: "学期の食事の現況",
      path: basePath("restaurant/semesterMeal"),
    },
    {
      name: "食事の申込者QRチェック",
      path: basePath("restaurant/qrCheck"),
    },
  ],
};
