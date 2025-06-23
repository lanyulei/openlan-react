// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { V1 } from '@/services/version';

/** get plugins GET ${V1}/resource/plugin */
export async function getPlugins(params: object, options: { [key: string]: any }) {
  return request(`${V1}/resource/plugin`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/** update plugin PUT ${V1}/resource/plugin/:name */
export async function updatePlugin(name: string, body: object, options: { [key: string]: any }) {
  return request(`${V1}/resource/plugin/${name}`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
