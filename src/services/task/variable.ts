// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { V1 } from '@/services/version';

export async function variableList(params: object, options?: { [key: string]: any }) {
  return request(`${V1}/task/variable`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function variableDetailById(id: string | undefined, options?: { [key: string]: any }) {
  return request(`${V1}/task/variable/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function createVariable(data: object, options?: { [key: string]: any }) {
  return request(`${V1}/task/variable`, {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

export async function updateVariable(
  id: string | undefined,
  data: object,
  options?: { [key: string]: any },
) {
  return request(`${V1}/task/variable/${id}`, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

export async function deleteVariable(id: string | undefined, options?: { [key: string]: any }) {
  return request(`${V1}/task/variable/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
