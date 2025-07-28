// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { V1 } from '@/services/version';

export async function secretList(params: object, options?: { [key: string]: any }) {
  return request(`${V1}/task/secret`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function secretDetailById(id: string | undefined, options?: { [key: string]: any }) {
  return request(`${V1}/task/secret/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function createSecret(data: object, options?: { [key: string]: any }) {
  return request(`${V1}/task/secret`, {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

export async function updateSecret(
  id: string | undefined,
  data: object,
  options?: { [key: string]: any },
) {
  return request(`${V1}/task/secret/${id}`, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

export async function deleteSecret(id: string | undefined, options?: { [key: string]: any }) {
  return request(`${V1}/task/secret/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
