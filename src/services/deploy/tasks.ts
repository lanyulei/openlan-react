// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { KubeApi } from '@/services/version';

export async function taskList(params: object, options: { [key: string]: any }) {
  return request(`${KubeApi}/apis/tekton.dev/v1/tasks`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function taskListByNamespace(
  namespace: string,
  params: object,
  options: { [key: string]: any },
) {
  return request(`${KubeApi}/apis/tekton.dev/v1/namespaces/${namespace}/tasks`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function createTask(namespace: string, data: object, options: { [key: string]: any }) {
  return request(`${KubeApi}/apis/tekton.dev/v1/namespaces/${namespace}/tasks`, {
    method: 'POST',
    data,
    ...(options || {}),
  });
}
