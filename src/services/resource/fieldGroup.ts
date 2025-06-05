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
