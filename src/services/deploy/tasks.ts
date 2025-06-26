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

export async function updateTask(
  name: string,
  namespace: string,
  data: object,
  options: { [key: string]: any },
) {
  return request(`${KubeApi}/apis/tekton.dev/v1/namespaces/${namespace}/tasks/${name}`, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

export async function taskDetails(
  name: string | undefined,
  namespace: string | undefined,
  options: { [key: string]: any },
) {
  return request(`${KubeApi}/apis/tekton.dev/v1/namespaces/${namespace}/tasks/${name}`, {
    method: 'GET',
    ...(options || {}),
  });
}
