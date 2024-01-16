const list = require("../../../assets/img/list.png");
const tijianbaogao = require("../../../assets/img/tijianbaogao.png");
const healthInfo = require("../../../assets/img/healthInfo.png");
const jinji = require("../../../assets/img/jinji.png");

export const menuListIcon = new Map([
  ["list", list],
  ["tijianbaogao", tijianbaogao],
  ["healthInfo", healthInfo],
  ["jinji", jinji],
]);

export const mobileMenuList = [
  {
    menuName: "员工健康信息",
    id: "1",
    icon: "healthInfo",
    url: "/healthInformation",
  },
  {
    menuName: "体检报告",
    id: "2",
    icon: "tijianbaogao",
    url: "/hazardNotice",
  },
  {
    menuName: "职业禁忌人员",
    id: "3",
    icon: "jinji",
    url: "/occupTaboos",
  },
  {
    menuName: "劳动防护用品",
    id: "4",
    icon: "list",
    url: "/labourGoods",
  },
  {
    menuName: "劳动防护清单",
    id: "5",
    icon: "list",
    url: "/detailedList",
  },
  {
    menuName: "部门领用记录",
    id: "6",
    icon: "list",
    url: "/deptUseRecord",
  },
];
export const mobileMenuList1 = [
  {
    menuName: "领用清单审核",
    id: "7",
    icon: "list",
    url: "/auditList",
  },
];
