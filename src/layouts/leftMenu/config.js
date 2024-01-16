export const defaultIcon = "el-icon-folder";
export const defaultStyle = {
  // 'background-color': 'white',
  "text-color": "#666",
  "active-text-color": "red",
};

export const menuList = [
  {
    menuName: "职业健康管理制度档案",
    id: "1",
    icon: "el-icon-document",
    url: "/pages/systemArchives",
  },
  {
    menuName: "职业危害因素项目申报",
    id: "2",
    icon: "el-icon-document",
    url: "/pages/projectDeclaration",
  },
  {
    menuName: "工作场所危害因素管理",
    id: "3",
    icon: "el-icon-s-management",
    url: "/pages/workspaceHarm",
    children: [
      {
        menuName: "职业危害因素监测报告",
        id: "3-1",
        icon: "el-icon-collection",
        url: "/pages/testReport",
      },
      {
        menuName: "职业危害因素监测数据",
        id: "3-2",
        icon: "el-icon-collection",
        url: "/pages/detectionData",
      },
      {
        menuName: "职业危害因素监测结果",
        id: "3-3",
        icon: "el-icon-collection",
        url: "/pages/testResults",
      },
    ],
  },
  {
    menuName: "健康监护管理",
    id: "4",
    icon: "el-icon-s-management",
    url: "/pages/healthSupervision",
    children: [
      {
        menuName: "危害因素设置",
        id: "4-1",
        icon: "el-icon-setting",
        url: "/pages/frequencySetUp",
      },
      {
        menuName: "岗位危害因素设置",
        id: "4-2",
        icon: "el-icon-setting",
        url: "/pages/postFrequencySetUp",
      },
      {
        menuName: "员工健康信息列表",
        id: "4-3",
        icon: "el-icon-tickets",
        url: "/pages/healthInformation",
      },
      {
        menuName: "职业健康体检报告",
        id: "4-4",
        icon: "el-icon-s-order",
        url: "/pages/hazardNotice",
      },
      {
        menuName: "职业禁忌人员列表",
        id: "4-5",
        icon: "el-icon-tickets",
        url: "/pages/occupTaboos",
      },
    ],
  },
  {
    menuName: "劳动防护管理",
    id: "5",
    icon: "el-icon-s-management",
    url: "/pages/labourInsurance",
    children: [
      {
        menuName: "劳动防护用品",
        id: "5-1",
        icon: "el-icon-tickets",
        url: "/pages/labourGoods",
      },
      {
        menuName: "劳动防护配置",
        id: "5-2",
        icon: "el-icon-setting",
        url: "/pages/defendConfig",
      },
      {
        menuName: "劳动防护清单",
        id: "5-3",
        icon: "el-icon-s-order",
        url: "/pages/detailedList",
      },
      {
        menuName: "部门领用记录",
        id: "5-4",
        icon: "el-icon-tickets",
        url: "/pages/deptUseRecord",
      },
    ],
  },
];
