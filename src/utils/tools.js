import { uploadFilesToServer } from "../api/common";

export const hashLen = () => {
  return (s) => {
    for (var i = 0, h = 9; i < s.length; )
      h = Math.imul(h ^ s.charCodeAt(i++), 9 ** 9);
    return h ^ (h >>> 9);
  };
};

export async function handleImport(value, type) {
  const file = value.file;
  const param = new FormData();
  // 文件对象
  param.append("file", file);
  param.append("moduleType", type);
  try {
    const result = await uploadFilesToServer(param);
    console.log("result", result);
    if (result.status === 200) {
      const { data } = result;
      if (data.code === 200) {
        return {
          name: data.data.name,
          path: data.data.path,
          url: data.data.path,
        };
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

export function expenseloadFile(value) {
  try {
    let { data, filename } = value;
    console.log("filename", filename.split("filename*=utf-8''"));
    let blob = new Blob([data]);
    let url = window.URL.createObjectURL(blob);
    let aDownload = document.createElement("a");
    aDownload.href = url;
    filename = decodeURI(filename.split("utf-8''")[1]);
    aDownload.download = `${filename}`;
    aDownload.href = url;
    document.body.appendChild(aDownload);
    aDownload.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(aDownload);
    return true;
  } catch (e) {
    return false;
  }
}
// navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
export function isMobile() {
  //判断是否为移动端
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  return /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile/.test(userAgent);
}

// 获取链接上的制定参数
export const getUrlQueryString = (name) => {
  const query_string = window.location.href.split("?")[1];
  if (!query_string) return null; // 如果无参，返回null
  const re = /[?&]?([^=]+)=([^&]*)/g;
  let tokens;
  while ((tokens = re.exec(query_string))) {
    if (decodeURIComponent(tokens[1]) === name) {
      return decodeURIComponent(tokens[2]);
    }
  }
  return null;
};
