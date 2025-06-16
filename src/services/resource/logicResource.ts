// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** get logic resource list GET /api/v1/resource/logic-resource */
export async function getLogicResourceList(params: object, options: { [key: string]: any }) {
  return request(`/api/v1/resource/logic-resource`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/** get logic resource details GET /api/v1/resource/logic-resource/:id */
export async function getLogicResourceDetails(
  id: string | undefined,
  options: { [key: string]: any },
) {
  return request(`/api/v1/resource/logic-resource/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}
