// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** get model group list GET /api/v1/resource/model-group */
export async function getModelGroupList(params: object, options?: { [key: string]: any }) {
  return request('/api/v1/resource/model-group', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/** Create a model group POST /api/v1/resource/model-group */
export async function createModelGroup(data: object) {
  return request('/api/v1/resource/model-group', {
    method: 'POST',
    data,
  });
}

/** update a model group POST /api/v1/resource/model-group/:id */
// 修改 id 的类型为 number 或者 undefined
export async function updateModelGroup(id: number | undefined, data: object) {
  return request(`/api/v1/resource/model-group/${id}`, {
    method: 'PUT',
    data,
  });
}

/** delete model group GET /api/v1/resource/model-group/:id */
export async function deleteModelGroup(id: number | undefined) {
  return request(`/api/v1/resource/model-group/${id}`, {
    method: 'DELETE',
  });
}
