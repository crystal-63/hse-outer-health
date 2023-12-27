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
    icon: "el-icon-collection",
    url: "/pages/systemArchives",
  },
  {
    menuName: "职业危害因素项目申报",
    id: "2",
    icon: "el-icon-collection",
    url: "/pages/projectDeclaration",
  },
  {
    menuName: "工作场所危害因素管理",
    id: "3",
    icon: "el-icon-collection",
    url: "/pages/workspaceHarm",
    children: [
      {
        menuName: "职业危害因素检测报告",
        id: "3-1",
        icon: "el-icon-collection",
        url: "/pages/workspaceHarm/testReport",
      },
      {
        menuName: "职业危害因素检测数据",
        id: "3-2",
        icon: "el-icon-collection",
        url: "/pages/workspaceHarm/testResults",
      },
      {
        menuName: "职业危害因素检测结果",
        id: "3-3",
        icon: "el-icon-collection",
        url: "/pages/workspaceHarm/detectionData",
      },
    ],
  },
];
