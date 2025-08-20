// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { V1 } from '@/services/version';

export async function taskHistoryList(params: object, options?: { [key: string]: any }) {
  return request(`${V1}/task/history`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}
