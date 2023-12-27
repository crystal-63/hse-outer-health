import { instance } from "../../plugins/request/request";
import { systemArchives } from "../apiUrl";

export function uploadFilesToServer(params) {
  return instance.post(systemArchives.uploadFiles, params);
}
