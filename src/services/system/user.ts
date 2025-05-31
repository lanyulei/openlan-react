// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/* 获取当前用户信息 GET /api/v1/login */
export async function getCurrentUser(options?: { [key: string]: any }) {
  return request('/api/v1/system/user/details', {
    method: 'GET',
    ...(options || {}),
  });
}
