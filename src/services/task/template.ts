// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { V1 } from '@/services/version';

export async function templateList(params: object, options?: { [key: string]: any }) {
  return request(`${V1}/task/template`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function templateDetailById(id: string | undefined, options?: { [key: string]: any }) {
  return request(`${V1}/task/template/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function createTemplate(data: object, options?: { [key: string]: any }) {
  return request(`${V1}/task/template`, {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

export async function updateTemplate(
  id: string | undefined,
  data: object,
  options?: { [key: string]: any },
) {
  return request(`${V1}/task/template/${id}`, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

export async function deleteTemplate(id: string | undefined, options?: { [key: string]: any }) {
  return request(`${V1}/task/template/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
