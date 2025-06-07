// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** create a field group GET /api/v1/resource/model/list */
export async function createFieldGroup(data: object, options?: { [key: string]: any }) {
  return request('/api/v1/resource/field-group', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

/** delete a field group DELETE /api/v1/resource/model/delete */
export async function deleteFieldGroup(id: string | undefined, options?: { [key: string]: any }) {
  return request(`/api/v1/resource/field-group/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** update a field group PUT /api/v1/resource/model/update */
export async function updateFieldGroup(
  id: string | undefined,
  data: object,
  options?: { [key: string]: any },
) {
  return request(`/api/v1/resource/field-group/${id}`, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}
