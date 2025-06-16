// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** get account list GET /api/v1/resource/cloud-account */
export async function getAccountList(params: object, options: { [key: string]: any }) {
  return request(`/api/v1/resource/cloud-account`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/** create a cloud account POST /api/v1/resource/cloud-account */
export async function createCloudAccount(data: object, options: { [key: string]: any }) {
  return request(`/api/v1/resource/cloud-account`, {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

/** update a cloud account PUT /api/v1/resource/cloud-account/:id */
export async function updateCloudAccount(
  id: string,
  data: object,
  options: { [key: string]: any },
) {
  return request(`/api/v1/resource/cloud-account/${id}`, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

/** delete a cloud account DELETE /api/v1/resource/cloud-account/:id */
export async function deleteCloudAccount(id: string, options: { [key: string]: any }) {
  return request(`/api/v1/resource/cloud-account/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** sync cloud resource POST /api/v1/resource/cloud-account/sync-resource */
export async function syncCloudResource(data: object, options: { [key: string]: any }) {
  return request(`/api/v1/resource/cloud-account/sync-resource`, {
    method: 'POST',
    data,
    ...(options || {}),
  });
}
