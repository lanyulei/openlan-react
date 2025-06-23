// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { V1 } from '@/services/version';

/** create a field group GET ${V1}/resource/model/list */
export async function createFieldGroup(data: object, options?: { [key: string]: any }) {
  return request(`${V1}/resource/field-group`, {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

/** delete a field group DELETE ${V1}/resource/model/delete */
export async function deleteFieldGroup(id: string | undefined, options?: { [key: string]: any }) {
  return request(`${V1}/resource/field-group/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** update a field group PUT ${V1}/resource/model/update */
export async function updateFieldGroup(
  id: string | undefined,
  data: object,
  options?: { [key: string]: any },
) {
  return request(`${V1}/resource/field-group/${id}`, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}
