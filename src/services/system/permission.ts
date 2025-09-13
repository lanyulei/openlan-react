// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { V1 } from '@/services/version';

/* 获取权限元素树 GET /api/v1/system/permission */
export async function permissionTree(options?: { [key: string]: any }) {
  return request(`${V1}/system/permission`, {
    method: 'GET',
    ...(options || {}),
  });
}
