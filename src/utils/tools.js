import { uploadFilesToServer } from "../api/common";

export const hashLen = () => {
  return (s) => {
    for (var i = 0, h = 9; i < s.length; )
      h = Math.imul(h ^ s.charCodeAt(i++), 9 ** 9);
    return h ^ (h >>> 9);
  };
};

export async function handleExport(value, type) {
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
