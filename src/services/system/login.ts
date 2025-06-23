// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { V1 } from '@/services/version';

export async function login(data: object) {
  return request(`${V1}/login`, {
    method: 'POST',
    data,
  });
}

export async function logout(options?: { [key: string]: any }) {
  return request(`${V1}/logout`, {
    method: 'POST',
    ...(options || {}),
  });
}
