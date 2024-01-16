import { instance } from "../../plugins/request/request";
import {
  systemArchives,
  workplaceHazardFactors,
  hazardFactorsConfig,
  postHazardFactorsConfig,
  healthUserConfig,
  physicalReport,
  labourInsurance,
} from "../apiUrl";

const httpserve = instance;
// 职业健康管理制度档案列表
function getSysArchivesList(params) {
  return httpserve.get(systemArchives.sysArchivesList, { params });
}
// 职业健康管理制度档案添加
function setSysArchivesData(params) {
  return httpserve.post(systemArchives.addArchives, params);
}
// 职业健康管理制度档案删除
function delSysArchivesData(params) {
  return httpserve.get(systemArchives.deleteArchives, { params });
}

// 职业危害因素检测报告列表
function getTestReportList(params) {
  return httpserve.get(workplaceHazardFactors.examineReportList, { params });
}
// 职业危害因素检测报告添加
function setTestReportList(params) {
  return httpserve.post(workplaceHazardFactors.addExamineReport, params);
}
// 职业危害因素检测报告删除
function delTestReport(params) {
  return httpserve.get(workplaceHazardFactors.deleteExamineReport, { params });
}
// 职业危害因素检测数据列表
function getTestDataList(params) {
  return httpserve.get(workplaceHazardFactors.examineDataList, { params });
}
// 职业危害因素检测数据添加
function setTestDataList(params) {
  return httpserve.post(workplaceHazardFactors.addExamineData, params);
}
// 职业危害因素检测数据编辑
function editTestDataList(params) {
  return httpserve.post(workplaceHazardFactors.editExamineData, params);
}
// 职业危害因素检测数据删除
function delTestData(params) {
  return httpserve.get(workplaceHazardFactors.deleteExamineData, { params });
}
// 职业危害因素检测数据导入数据
function importTestData(data) {
  return httpserve.post(workplaceHazardFactors.importExamineData, data);
}
// 职业危害因素检测数据导出模版
function exportTestDataTemp() {
  return httpserve.get(workplaceHazardFactors.exportExamineData, {
    responseType: "blob",
  });
}

// 职业危害因素检测结果列表
function getTestResultList(params) {
  return httpserve.get(workplaceHazardFactors.examineResultList, { params });
}
// 职业危害因素检测结果添加
function setTestResult(data) {
  return httpserve.post(workplaceHazardFactors.addExamineResult, data);
}
// 职业危害因素检测结果删除
function delTestResult(params) {
  return httpserve.get(workplaceHazardFactors.delTestResult, { params });
}

// 危害因素列表
function getHazardFactorsList(params) {
  return httpserve.get(hazardFactorsConfig.hazardFactorsList, { params });
}
// 危害因素添加
function setHazardFactors(data) {
  return httpserve.post(hazardFactorsConfig.addHazardFactors, data);
}
// 危害因素编辑
function editHazardFactors(data) {
  return httpserve.post(hazardFactorsConfig.editHazardFactors, data);
}
// 危害因素删除
function delHazardFactors(params) {
  return httpserve.get(hazardFactorsConfig.deleteHazardFactors, { params });
}

// 岗位危害因素设置列表
function getPostHazardList(params) {
  return httpserve.get(postHazardFactorsConfig.postHazardFactorsList, {
    params,
  });
}
// 岗位危害因素设置添加
function addPostHazardFactors(data) {
  return httpserve.post(postHazardFactorsConfig.addPostHazardFactors, data);
}

// 职业健康人员列表
function getHealthUserList(params) {
  return httpserve.get(healthUserConfig.healthUserList, { params });
}
// 职业健康人员导入告知卡
function importInformCard(data) {
  return httpserve.post(healthUserConfig.importInformCard, data);
}
// 职业健康人员导出禁忌人员
function exportHealthUserList(params) {
  return httpserve.get(healthUserConfig.exportHealthUser, {
    params,
    responseType: "blob",
  });
}
// 删除告知卡
function delInformCard(params) {
  return httpserve.get(healthUserConfig.deleletInformCard, { params });
}
// 职业健康人员禁忌列表
function getHealthUserTabooList(params) {
  return httpserve.get(healthUserConfig.healthUserTabooList, { params });
}
// 职业健康体检报告列表
function getPhysicalReportList(params) {
  return httpserve.get(physicalReport.physicalReportList, { params });
}
// 职业健康体检报告删除
function delPhysicalReport(params) {
  return httpserve.get(physicalReport.deletePhysicalReport, { params });
}
// 职业健康体检报告导入数据
function importPhysicalReport(data) {
  return httpserve.post(physicalReport.importExcel, data);
}
// 职业健康体检报告导出模版
function exportPhysicalReport(params) {
  return httpserve.get(physicalReport.exportTemplate, {
    params,
    responseType: "blob",
  });
}

// 劳动防护用品添加
function setLabourGoods(data) {
  return httpserve.post(labourInsurance.addLabourGoods, data);
}
// 劳动防护用品列表
function getLabourGoodsList(params) {
  return httpserve.get(labourInsurance.labourGoodsList, { params });
}

// 劳动防护用品添加
function setDefendConfig(data) {
  return httpserve.post(labourInsurance.defendConfig, data);
}
// 劳动防护用品列表
function getDefendConfigList(params) {
  return httpserve.get(labourInsurance.defendConfigList, { params });
}

// 劳防清单人员配置
function setDetailedListUser(data) {
  return httpserve.post(labourInsurance.addGoodsIssueRecord, data);
}
// 计算发放数量
function calculateGrantCount(params) {
  return httpserve.get(labourInsurance.issuesNumCalculate, { params });
}
// 详情
function getIssueRecordDetail(params) {
  return httpserve.get(labourInsurance.issueRecordDetail, { params });
}
// 部门领用记录
function getDeptIssueRecord(params) {
  return httpserve.get(labourInsurance.deptIssueRecord, { params });
}
// 审核列表
function getAuditList(params) {
  return httpserve.get(labourInsurance.auditList, { params });
}

export {
  getSysArchivesList,
  setSysArchivesData,
  delSysArchivesData,
  getTestReportList,
  setTestReportList,
  delTestReport,
  getTestDataList,
  setTestDataList,
  editTestDataList,
  delTestData,
  importTestData,
  exportTestDataTemp,
  getTestResultList,
  setTestResult,
  delTestResult,
  getHazardFactorsList,
  setHazardFactors,
  editHazardFactors,
  delHazardFactors,
  getPostHazardList,
  addPostHazardFactors,
  getHealthUserList,
  importInformCard,
  exportHealthUserList,
  delInformCard,
  getHealthUserTabooList,
  getPhysicalReportList,
  delPhysicalReport,
  importPhysicalReport,
  exportPhysicalReport,
  setLabourGoods,
  getLabourGoodsList,
  setDefendConfig,
  getDefendConfigList,
  setDetailedListUser,
  calculateGrantCount,
  getIssueRecordDetail,
  getDeptIssueRecord,
  getAuditList,
};
