// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { OpenLeiApi } from '@/services/version';

export async function invoke(data: object, options: { [key: string]: any }) {
  return request(`${OpenLeiApi}/api/v1/invoke`, {
    method: 'POST',
    data,
    ...(options || {}),
  });
}
