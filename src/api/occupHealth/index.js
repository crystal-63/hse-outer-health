import httpserve from "../../plugins/request/request";
import { systemArchives } from "../apiUrl";

export function getSysArchivesList(params) {
  return httpserve.get(systemArchives.sysArchivesList, { params });
}
