// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** create a field group GET /api/v1/resource/model/list */
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

/** create a field group POST /api/v1/resource/field/create */
export async function createModelField(data: object, options?: { [key: string]: any }) {
  return request('/api/v1/resource/field', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}
