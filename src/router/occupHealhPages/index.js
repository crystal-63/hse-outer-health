const systemArchives = require("../../views/occupHealhPages/systemArchives");
const projectDeclaration = require("../../views/occupHealhPages/projectDeclaration");
const testReport = require("../../views/occupHealhPages/testReport");
const testResults = require("../../views/occupHealhPages/testResults");
const detectionData = require("../../views/occupHealhPages/detectionData");

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
    name: "职业危害因素检测报告",
    component: testReport.default,
    meta: {
      title: "职业危害因素检测报告",
    },
  },
  {
    path: "detectionData",
    name: "职业危害因素检测数据",
    component: detectionData.default,
    meta: {
      title: "职业危害因素检测数据",
    },
  },
  {
    path: "testResults",
    name: "职业危害因素检测结果",
    component: testResults.default,
    meta: {
      title: "职业危害因素检测结果",
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
