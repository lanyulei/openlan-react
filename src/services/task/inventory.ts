// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { V1 } from '@/services/version';

export async function inventoryList(params: object, options?: { [key: string]: any }) {
  return request(`${V1}/task/inventory`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function inventoryDetailById(
  id: string | undefined,
  options?: { [key: string]: any },
) {
  return request(`${V1}/task/inventory/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function createInventory(data: object, options?: { [key: string]: any }) {
  return request(`${V1}/task/inventory`, {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

export async function updateInventory(
  id: string | undefined,
  data: object,
  options?: { [key: string]: any },
) {
  return request(`${V1}/task/inventory/${id}`, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

export async function deleteInventory(id: string | undefined, options?: { [key: string]: any }) {
  return request(`${V1}/task/inventory/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
