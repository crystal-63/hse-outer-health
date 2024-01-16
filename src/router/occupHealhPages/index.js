const systemArchives = require("../../views/occupHealhPages/systemArchives");
const projectDeclaration = require("../../views/occupHealhPages/projectDeclaration");
const testReport = require("../../views/occupHealhPages/testReport");
const testResults = require("../../views/occupHealhPages/testResults");
const detectionData = require("../../views/occupHealhPages/detectionData");
const healthInformation = require("../../views/occupHealhPages/healthInformation");
const occupTaboos = require("../../views/occupHealhPages/occupTaboos");
const frequencySetUp = require("../../views/occupHealhPages/frequencySetUp");
const hazardNotice = require("../../views/occupHealhPages/hazardNotice");
const postFrequencySetUp = require("../../views/occupHealhPages/postFrequencySetUp");
const labourGoods = require("../../views/occupHealhPages/labourGoods");
const defendConfig = require("../../views/occupHealhPages/defendConfig");
const detailedList = require("../../views/occupHealhPages/detailedList");
const deptUseRecord = require("../../views/occupHealhPages/deptUseRecord");

const occupHealhPages = [
  {
    path: "systemArchives",
    name: "职业健康制度管理",
    component: systemArchives.default,
    meta: {
      title: "职业健康管理制度档案",
    },
  },
  {
    path: "projectDeclaration",
    name: "职业危害因素项目申报",
    component: projectDeclaration.default,
    meta: {
      title: "职业健康管理制度档案",
    },
  },
  {
    path: "testReport",
    name: "职业危害因素监测报告",
    component: testReport.default,
    meta: {
      title: "职业危害因素监测报告",
    },
  },
  {
    path: "detectionData",
    name: "职业危害因素监测数据",
    component: detectionData.default,
    meta: {
      title: "职业危害因素监测数据",
    },
  },
  {
    path: "testResults",
    name: "职业危害因素监测结果",
    component: testResults.default,
    meta: {
      title: "职业危害因素监测结果",
    },
  },
  {
    path: "healthInformation",
    name: "员工健康信息列表",
    component: healthInformation.default,
    meta: {
      title: "员工健康信息列表",
    },
  },
  {
    path: "occupTaboos",
    name: "职业禁忌人员列表",
    component: occupTaboos.default,
    meta: {
      title: "职业禁忌人员列表",
    },
  },
  {
    path: "frequencySetUp",
    name: "危害因素设置",
    component: frequencySetUp.default,
    meta: {
      title: "危害因素设置",
    },
  },
  {
    path: "postFrequencySetUp",
    name: "岗位危害因素设置",
    component: postFrequencySetUp.default,
    meta: {
      title: "岗位危害因素设置",
    },
  },
  {
    path: "hazardNotice",
    name: "职业健康体检报告",
    component: hazardNotice.default,
    meta: {
      title: "职业健康体检报告",
    },
  },
  {
    path: "labourGoods",
    name: "劳动防护用品",
    component: labourGoods.default,
    meta: {
      title: "劳动防护用品",
    },
  },
  {
    path: "defendConfig",
    name: "劳动防护配置",
    component: defendConfig.default,
    meta: {
      title: "劳动防护配置",
    },
  },
  {
    path: "detailedList",
    name: "劳动防护清单",
    component: detailedList.default,
    meta: {
      title: "劳动防护清单",
    },
  },
  {
    path: "deptUseRecord",
    name: "部门领用记录",
    component: deptUseRecord.default,
    meta: {
      title: "部门领用记录",
    },
  },
  // {
  //   path: "workspaceHarm",
  //   name: "工作场所危害因素管理",
  //   // component: layout,
  //   meta: {
  //     title: "工作场所危害因素",
  //   },
  //   // redirect: "/pages/testReport",
  //   children: [
  //     {
  //       path: "testReport",
  //       name: "职业危害因素检测报告",
  //       component: testReport.default,
  //       meta: {
  //         title: "职业危害因素检测报告",
  //       },
  //     },
  //     {
  //       path: "testResults",
  //       name: "职业危害因素检测数据",
  //       component: detectionData.default,
  //       meta: {
  //         title: "职业危害因素检测数据",
  //       },
  //     },
  //     {
  //       path: "detectionData",
  //       name: "职业危害因素检测结果",
  //       component: testResults.default,
  //       meta: {
  //         title: "职业危害因素检测结果",
  //       },
  //     },
  //   ],
  // },
];

export default occupHealhPages;
