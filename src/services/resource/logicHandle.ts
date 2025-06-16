// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** get logic handle list GET /api/v1/resource/logic-handle */
export async function getLogicHandleList(
  id: string | undefined,
  params: object,
  options: { [key: string]: any },
) {
  return request(`/api/v1/resource/logic-handle/${id}`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}
