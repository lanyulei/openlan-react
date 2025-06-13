// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** get data list GET /api/v1/resource/data */
export async function getDataList(
  id: string | undefined,
  params: object,
  options: { [key: string]: any },
) {
  return request(`/api/v1/resource/data/${id}`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/** create a data GET /api/v1/resource/data */
export async function createData(data: object, options: { [key: string]: any }) {
  return request(`/api/v1/resource/data`, {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

/** update a data PUT /api/v1/resource/data/:id */
export async function updateData(id: string, data: object, options: { [key: string]: any }) {
  return request(`/api/v1/resource/data/${id}`, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

/** batch delete data DELETE /api/v1/resource/data/batch */
export async function batchDeleteData(data: object, options: { [key: string]: any }) {
  return request(`/api/v1/resource/data/batch`, {
    method: 'DELETE',
    data,
    ...(options || {}),
  });
}
