// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { V1 } from '@/services/version';

/* 获取角色列表 GET /api/v1/system/role */
export async function roleList(params?: object, options?: { [key: string]: any }) {
  return request(`${V1}/system/role`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}
