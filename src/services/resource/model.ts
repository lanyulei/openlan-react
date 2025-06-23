// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { V1 } from '@/services/version';

/** Get model GET ${V1}/resource/model/list */
export async function getModels(params: object, options?: { [key: string]: any }) {
  return request(`${V1}/resource/model/list`, {
    method: 'GET',
    params,
  });
}

/** create model POST ${V1}/resource/model */
export async function createModel(data: object, options?: { [key: string]: any }) {
  return request(`${V1}/resource/model`, {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

/** get details GET ${V1}/resource/model/:id */
export async function getModelDetails(id: string | undefined, options?: { [key: string]: any }) {
  return request(`${V1}/resource/model/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** delete model DELETE ${V1}/resource/model/:id */
export async function deleteModel(id: string | undefined, options?: { [key: string]: any }) {
  return request(`${V1}/resource/model/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** update model PUT ${V1}/resource/model/:id */
export async function updateModel(
  id: string | undefined,
  data: object,
  options?: { [key: string]: any },
) {
  return request(`${V1}/resource/model/${id}`, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}
