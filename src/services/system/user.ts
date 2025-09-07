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

/* 创建用户 POST /api/v1/system/user */
export async function createUser(data: object, options?: { [key: string]: any }) {
  return request(`${V1}/system/user`, {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

/* 更新用户 PUT /api/v1/system/user */
export async function updateUser(id: string, data: object, options?: { [key: string]: any }) {
  return request(`${V1}/system/user/${id}`, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

/* 删除用户 DELETE /api/v1/system/user */
export async function deleteUser(id: string, options?: { [key: string]: any }) {
  return request(`${V1}/system/user/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
