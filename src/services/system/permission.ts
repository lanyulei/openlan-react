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

/* 创建权限元素 POST /api/v1/system/permission */
export async function createPermission(data: object, options?: { [key: string]: any }) {
  return request(`${V1}/system/permission`, {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

/* 更新权限元素 PUT /api/v1/system/permission/:id */
export async function updatePermission(id: string, data: object, options?: { [key: string]: any }) {
  return request(`${V1}/system/permission/${id}`, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

/* 删除权限元素 DELETE /api/v1/system/permission */
export async function deletePermission(
  data: { ids: string[] | undefined },
  options?: { [p: string]: any },
) {
  return request(`${V1}/system/permission`, {
    method: 'DELETE',
    data,
    ...(options || {}),
  });
}
