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

/* 创建角色 POST /api/v1/system/role */
export async function createRole(data: object, options?: { [key: string]: any }) {
  return request(`${V1}/system/role`, {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

/* 更新角色 PUT /api/v1/system/role */
export async function updateRole(id: string, data: object, options?: { [key: string]: any }) {
  return request(`${V1}/system/role/${id}`, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

/* 删除角色 DELETE /api/v1/system/role */
export async function deleteRole(id: string, options?: { [key: string]: any }) {
  return request(`${V1}/system/role/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
