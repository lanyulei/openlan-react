import yaml from 'js-yaml';

// 导出 formatDate 函数
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 生成一个 json 转 yaml 的函数
export const jsonToYaml = (json: object | string) => {
  try {
    if (typeof json !== 'object' || json === null || Array.isArray(json)) {
      return json;
    }
    return yaml.dump(json);
  } catch (e) {
    console.error('Error converting JSON to YAML:', e);
    return '';
  }
};

// 生成一个 yaml 转 json 的函数
export const yamlToJson = (yamlString: any) => {
  try {
    return yaml.load(yamlString);
  } catch (e) {
    console.error('Error converting YAML to JSON:', e);
    return {};
  }
};
