// 用户
const userApi = {
  userDetail: "/pc/login/pares",
  login: "/pc/login",
  postApi: "/pc/sys/select/post",
  orgApi: "/pc/sys/select/org",
  sysOrgTree: "/pc/sys/select/org/tree",
  sysUserList: "/pc/sys/select/user/list",
};

// 职业健康档案制度
const systemArchives = {
  sysArchivesList: "/pc/file/page",
  addArchives: "/pc/file/add",
  deleteArchives: "/pc/file/remove",
  uploadFiles: "/pc/cloud/upload",
};

// 职业健康体检报告
const physicalReport = {
  exportTemplate: "/pc/health/physical/download/template",
  importExcel: "/pc/health/physical/import/data",
  physicalReportList: "/pc/health/physical/page",
  deletePhysicalReport: "/pc/health/physical/remove",
};

// 工作场所危害因素： 职业危害因素检测报告  职业危害因素检测数据  职业危害因素检测结果
const workplaceHazardFactors = {
  addExamineReport: "/pc/health/test/report/add",
  examineReportList: "/pc/health/test/report/page",
  deleteExamineReport: "/pc/health/test/report/remove",
  addExamineData: "/pc/health/test/add",
  editExamineData: "/pc/health/test/edit",
  exportExamineData: "/pc/health/test/export/template",
  importExamineData: "/pc/health/test/import/data",
  examineDataList: "/pc/health/test/page",
  deleteExamineData: "/pc/health/test/remove",
  addExamineResult: "/pc/health/test/result/add",
  examineResultList: "/pc/health/test/result/page",
  deleteExamineResult: "/pc/health/test/result/remove",
  delTestResult: "/pc/health/test/result/remove",
};

// 危害因素设置
const hazardFactorsConfig = {
  addHazardFactors: "/pc/health/hazardous/factor/add",
  editHazardFactors: "/pc/health/hazardous/factor/edit",
  hazardFactorsList: "/pc/health/hazardous/factor/list",
  deleteHazardFactors: "/pc/health/hazardous/factor/remove",
};

// 岗位危害因素设置
const postHazardFactorsConfig = {
  addPostHazardFactors: "/pc/health/post/hazardous/factor/add",
  postHazardFactorsList: "/pc/health/post/hazardous/factor/list",
};

// 职业健康人员列表
const healthUserConfig = {
  exportHealthUser: "/pc/health/user/export/taboo",
  importInformCard: "/pc/health/user/import/card",
  healthUserList: "/pc/health/user/page",
  deleletInformCard: "/pc/health/user/remove/card",
  healthUserTabooList: "/pc/health/user/taboo/page",
};

// 劳保用品
const labourInsurance = {
  addLabourGoods: "/pc/health/config/goods/add",
  labourGoodsList: "/pc/health/config/goods/list",
  defendConfig: "/pc/health/config/post/goods/add",
  defendConfigList: "/pc/health/config/post/goods/list",
  addGoodsIssueRecord: "/pc/goods/issue/record/add",
  issuesNumCalculate: "/pc/goods/issue/record/calculate",
  issueRecordDetail: "/pc/goods/issue/record/detail",
  deptIssueRecord: "/pc/goods/issue/record/list",
  auditList: "/pc/goods/issue/record/audit/flow",
};

export {
  userApi,
  systemArchives,
  physicalReport,
  workplaceHazardFactors,
  hazardFactorsConfig,
  postHazardFactorsConfig,
  healthUserConfig,
  labourInsurance,
};
