// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { KubeApi } from '@/services/version';

export async function getNamespaces(params: object, options: { [key: string]: any }) {
  return request(`${KubeApi}/api/v1/namespaces`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}
