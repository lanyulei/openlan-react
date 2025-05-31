// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

export async function login(data: object) {
  return request('/api/v1/login', {
    method: 'POST',
    data,
  });
}

export async function logout(options?: { [key: string]: any }) {
  return request('/api/v1/logout', {
    method: 'POST',
    ...(options || {}),
  });
}
