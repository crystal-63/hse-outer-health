import { instance } from "../../plugins/request/request";
import { systemArchives, userApi } from "../apiUrl";

function loginMethod(params) {
  return instance.post(userApi.login, params);
}

function loginResolveToken(params) {
  return instance.get(userApi.userDetail, { params });
}

// 上传文件到服务器
function uploadFilesToServer(params) {
  return instance.post(systemArchives.uploadFiles, params);
}

// 获取岗位下拉列表
function GetPostSelectList() {
  return instance.get(userApi.postApi);
}

// 获取机构下拉列表
function GetOrgSelectList() {
  return instance.get(userApi.orgApi);
}

// 获取机构树下拉列表
function GetOrgTreeList() {
  return instance.get(userApi.sysOrgTree);
}

// 获取用户下拉列表
function GetUserSelectList(params) {
  return instance.get(userApi.sysUserList, { params });
}

export {
  loginMethod,
  uploadFilesToServer,
  GetPostSelectList,
  GetOrgSelectList,
  GetUserSelectList,
  GetOrgTreeList,
  loginResolveToken,
};
