// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { V1 } from '@/services/version';

/** get logic handle list GET ${V1}/resource/logic-handle */
export async function getLogicHandleList(
  id: string | undefined,
  params: object,
  options: { [key: string]: any },
) {
  return request(`${V1}/resource/logic-handle/${id}`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}
