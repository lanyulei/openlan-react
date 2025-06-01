// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** Get model GET /api/v1/resource/model/list */
export async function getModels() {
  return request('/api/v1/resource/model/list', {
    method: 'GET',
  });
}
