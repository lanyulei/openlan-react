// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** Create a model group POST /api/modelGroup */
export async function createModelGroup(data: object) {
  return request('/api/v1/resource/model-group', {
    method: 'post',
    data,
  });
}
