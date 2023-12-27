import { instance } from "../../plugins/request/request";
import {
  systemArchives,
  workplaceHazardFactors,
  hazardFactorsConfig,
  postHazardFactorsConfig,
  healthUserConfig,
} from "../apiUrl";

const httpserve = instance;
// 职业健康管理制度档案列表
export function getSysArchivesList(params) {
  return httpserve.get(systemArchives.sysArchivesList, { params });
}
// 职业健康管理制度档案添加
export function setSysArchivesData(params) {
  return httpserve.post(systemArchives.addArchives, params);
}
// 职业健康管理制度档案删除
export function delSysArchivesData(params) {
  return httpserve.get(systemArchives.deleteArchives, { params });
}

// 职业危害因素检测报告列表
export function getTestReportList(params) {
  return httpserve.get(workplaceHazardFactors.examineReportList, { params });
}
// 职业危害因素检测报告添加
export function setTestReportList(params) {
  return httpserve.post(workplaceHazardFactors.addExamineReport, params);
}
// 职业危害因素检测报告删除
export function delTestReport(params) {
  return httpserve.get(workplaceHazardFactors.deleteExamineReport, { params });
}
// 职业危害因素检测数据列表
export function getTestDataList(params) {
  return httpserve.get(workplaceHazardFactors.examineDataList, { params });
}
// 职业危害因素检测数据添加
export function setTestDataList(params) {
  return httpserve.post(workplaceHazardFactors.addExamineData, params);
}
// 职业危害因素检测数据编辑
export function editTestDataList(params) {
  return httpserve.post(workplaceHazardFactors.addExamineData, params);
}
// 职业危害因素检测数据删除
export function delTestData(params) {
  return httpserve.get(workplaceHazardFactors.deleteExamineData, { params });
}
// 职业危害因素检测数据导入数据
export function importTestData(data) {
  return httpserve.post(workplaceHazardFactors.importExamineData, data);
}
// 职业危害因素检测数据导出模版
export function exportTestDataTemp() {
  return httpserve.get(workplaceHazardFactors.exportExamineData);
}

// 职业危害因素检测结果列表
export function getTestResultList(params) {
  return httpserve.get(workplaceHazardFactors.examineResultList, { params });
}
// 职业危害因素检测结果添加
export function setTestResult(data) {
  return httpserve.post(workplaceHazardFactors.addExamineResult, data);
}
// 职业危害因素检测结果删除
export function delTestResult(params) {
  return httpserve.get(workplaceHazardFactors.delTestResult, { params });
}

// 危害因素列表
export function getHazardFactorsList(params) {
  return httpserve.get(hazardFactorsConfig.hazardFactorsList, { params });
}
// 危害因素添加
export function setHazardFactors(data) {
  return httpserve.post(hazardFactorsConfig.addHazardFactors, data);
}
// 危害因素编辑
export function editHazardFactors(data) {
  return httpserve.post(hazardFactorsConfig.editHazardFactors, data);
}
// 危害因素删除
export function delHazardFactors(params) {
  return httpserve.get(hazardFactorsConfig.deleteHazardFactors, { params });
}

// 岗位危害因素设置列表
export function getPostHazardList(params) {
  return httpserve.get(postHazardFactorsConfig.postHazardFactorsList, {
    params,
  });
}
// 岗位危害因素设置添加
export function addPostHazardFactors(data) {
  return httpserve.post(postHazardFactorsConfig.addPostHazardFactors, data);
}

// 职业健康人员列表
export function getHealthUserList(params) {
  return httpserve.get(healthUserConfig.healthUserList, { params });
}
// 职业健康人员导入告知卡
export function importInformCard(data) {
  return httpserve.post(healthUserConfig.importInformCard, data);
}
// 职业健康人员导出数据
export function exportHealthUserList(params) {
  return httpserve.get(healthUserConfig.exportHealthUser, { params });
}
// 删除告知卡
export function delInformCard(params) {
  return httpserve.get(healthUserConfig.deleletInformCard, { params });
}
// 职业健康人员禁忌列表
export function getHealthUserTabooList(params) {
  return httpserve.get(healthUserConfig.healthUserTabooList, { params });
}
