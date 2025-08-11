// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { V1 } from '@/services/version';

export async function executeTask(data: object, options?: { [key: string]: any }) {
  return request(`${V1}/task/execute`, {
    method: 'POST',
    data,
    ...(options || {}),
  });
}
