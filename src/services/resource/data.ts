// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { V1 } from '@/services/version';

/** get data list GET ${V1}/resource/data */
export async function getDataList(
  id: string | undefined,
  params: object,
  options: { [key: string]: any },
) {
  return request(`${V1}/resource/data/${id}`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/** create a data GET ${V1}/resource/data */
export async function createData(data: object, options: { [key: string]: any }) {
  return request(`${V1}/resource/data`, {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

/** update a data PUT ${V1}/resource/data/:id */
export async function updateData(id: string, data: object, options: { [key: string]: any }) {
  return request(`${V1}/resource/data/${id}`, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

/** batch delete data DELETE ${V1}/resource/data/batch */
export async function batchDeleteData(data: object, options: { [key: string]: any }) {
  return request(`${V1}/resource/data/batch`, {
    method: 'DELETE',
    data,
    ...(options || {}),
  });
}

/** get data details GET ${V1}/resource/data/:modelId/:id */
export async function getDataDetails(id: string | undefined, options: { [key: string]: any }) {
  return request(`${V1}/resource/data/detail/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}
