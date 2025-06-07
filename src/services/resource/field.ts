// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** create a field GET /api/v1/resource/model/list */
export async function getModelFieldList(
  id: string | undefined,
  params: object,
  options?: { [key: string]: any },
) {
  return request(`/api/v1/resource/field/list/${id}`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/** create a field POST /api/v1/resource/field/create */
export async function createModelField(data: object, options?: { [key: string]: any }) {
  return request('/api/v1/resource/field', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

/** update a field PUT /api/v1/resource/field/:id */
export async function updateModelField(
  id: string | undefined,
  data: object,
  options?: { [key: string]: any },
) {
  return request(`/api/v1/resource/field/${id}`, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

/** delete a field DELETE /api/v1/resource/field/:id */
export async function deleteModelField(id: string | undefined, options?: { [key: string]: any }) {
  return request(`/api/v1/resource/field/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
