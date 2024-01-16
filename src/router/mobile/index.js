const detailedList = require("../../views/mobile/occupHealhPages/detailedList");
const deptUseRecord = require("../../views/mobile/occupHealhPages/deptUseRecord");
const healthInformation = require("../../views/mobile/occupHealhPages/healthInformation");
const occupTaboos = require("../../views/mobile/occupHealhPages/occupTaboos");
const hazardNotice = require("../../views/mobile/occupHealhPages/hazardNotice");
const labourGoods = require("../../views/mobile/occupHealhPages/labourGoods");
const auditList = require("../../views/mobile/occupHealhPages/auditList");

export const mobileRoutes = [
  {
    path: "/healthInformation",
    name: "员工健康信息列表",
    component: healthInformation.default,
    meta: {
      title: "员工健康信息列表",
    },
  },
  {
    path: "/occupTaboos",
    name: "职业禁忌人员列表",
    component: occupTaboos.default,
    meta: {
      title: "职业禁忌人员列表",
    },
  },
  {
    path: "/hazardNotice",
    name: "职业健康体检报告",
    component: hazardNotice.default,
    meta: {
      title: "职业健康体检报告",
    },
  },
  {
    path: "/labourGoods",
    name: "劳动防护用品",
    component: labourGoods.default,
    meta: {
      title: "劳动防护用品",
    },
  },
  {
    path: "/detailedList",
    name: "劳动防护清单",
    component: detailedList.default,
    meta: {
      title: "劳动防护清单",
    },
  },
  {
    path: "/deptUseRecord",
    name: "部门领用记录",
    component: deptUseRecord.default,
    meta: {
      title: "部门领用记录",
    },
  },
  {
    path: "/auditList",
    name: "领用清单审核列表",
    component: auditList.default,
    meta: {
      title: "领用清单审核列表",
    },
  },
];
