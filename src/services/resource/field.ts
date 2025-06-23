// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { V1 } from '@/services/version';

/** create a field GET ${V1}/resource/model/list */
export async function getModelFieldList(
  id: string | undefined,
  params: object,
  options?: { [key: string]: any },
) {
  return request(`${V1}/resource/field/list/${id}`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/** create a field POST ${V1}/resource/field/create */
export async function createModelField(data: object, options?: { [key: string]: any }) {
  return request(`${V1}/resource/field`, {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

/** update a field PUT ${V1}/resource/field/:id */
export async function updateModelField(
  id: string | undefined,
  data: object,
  options?: { [key: string]: any },
) {
  return request(`${V1}/resource/field/${id}`, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

/** delete a field DELETE ${V1}/resource/field/:id */
export async function deleteModelField(id: string | undefined, options?: { [key: string]: any }) {
  return request(`${V1}/resource/field/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
