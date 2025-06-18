// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** get plugins GET /api/v1/resource/plugin */
export async function searchData(params: object, options: { [key: string]: any }) {
  return request(`/api/v1/resource/search`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}
