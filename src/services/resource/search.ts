// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { V1 } from '@/services/version';

/** get plugins GET ${V1}/resource/plugin */
export async function searchData(params: object, options: { [key: string]: any }) {
  return request(`${V1}/resource/search`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}
