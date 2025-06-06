// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** Get model GET /api/v1/resource/model/list */
export async function getModels(params: object, options?: { [key: string]: any }) {
  return request('/api/v1/resource/model/list', {
    method: 'GET',
    params,
  });
}

/** create model POST /api/v1/resource/model */
export async function createModel(data: object, options?: { [key: string]: any }) {
  return request('/api/v1/resource/model', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}
