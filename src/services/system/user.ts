// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { V1 } from '@/services/version';

/* 获取当前用户信息 GET /api/v1/login */
export async function getCurrentUser(options?: { [key: string]: any }) {
  return request(`${V1}/system/user/details`, {
    method: 'GET',
    ...(options || {}),
  });
}

/* 获取用户列表 GET /api/v1/system/user/list */
export async function getUserList(params: object, options?: { [key: string]: any }) {
  return request(`${V1}/system/user`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}
