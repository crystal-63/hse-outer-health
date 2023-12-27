import { instance } from "../../plugins/request/request";
import { systemArchives, userApi } from "../apiUrl";

// 上传文件到服务器
function uploadFilesToServer(params) {
  return instance.post(systemArchives.uploadFiles, params);
}

// 获取岗位下拉列表
function GetPostSelectList() {
  return instance.get(userApi.postApi);
}

export {
  uploadFilesToServer,
  GetPostSelectList
}