// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { KubeApi } from '@/services/version';

export async function resourceList(
  resource: string,
  params: object,
  options: { [key: string]: any },
  apiVersion: string = 'tekton.dev/v1',
) {
  return request(`${KubeApi}/apis/${apiVersion}/${resource}`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function resourceListByNamespace(
  resource: string,
  namespace: string,
  params: object,
  options: { [key: string]: any },
  apiVersion: string = 'tekton.dev/v1',
) {
  return request(`${KubeApi}/apis/${apiVersion}/namespaces/${namespace}/${resource}`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function createResource(
  resource: string,
  namespace: string,
  data: object,
  options: { [key: string]: any },
  apiVersion: string = 'tekton.dev/v1',
) {
  return request(`${KubeApi}/apis/${apiVersion}/namespaces/${namespace}/${resource}`, {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

export async function createClusterResource(
  resource: string,
  data: object,
  options: { [key: string]: any },
  apiVersion: string = 'tekton.dev/v1',
) {
  return request(`${KubeApi}/apis/${apiVersion}/${resource}`, {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

export async function updateResource(
  resource: string,
  name: string,
  namespace: string,
  data: object,
  options: { [key: string]: any },
  apiVersion: string = 'tekton.dev/v1',
) {
  return request(`${KubeApi}/apis/${apiVersion}/namespaces/${namespace}/${resource}/${name}`, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

export async function updateClusterResource(
  resource: string,
  name: string,
  data: object,
  options: { [key: string]: any },
  apiVersion: string = 'tekton.dev/v1',
) {
  return request(`${KubeApi}/apis/${apiVersion}/${resource}/${name}`, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

export async function deleteResource(
  resource: string,
  name: string,
  namespace: string,
  options: { [key: string]: any },
  apiVersion: string = 'tekton.dev/v1',
) {
  return request(`${KubeApi}/apis/${apiVersion}/namespaces/${namespace}/${resource}/${name}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

export async function deleteClusterResource(
  resource: string,
  name: string,
  options: { [key: string]: any },
  apiVersion: string = 'tekton.dev/v1',
) {
  return request(`${KubeApi}/apis/${apiVersion}/${resource}/${name}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

export async function resourceDetails(
  resource: string,
  name: string | undefined,
  namespace: string | undefined,
  options: { [key: string]: any },
  apiVersion: string = 'tekton.dev/v1',
) {
  return request(`${KubeApi}/apis/${apiVersion}/namespaces/${namespace}/${resource}/${name}`, {
    method: 'GET',
    ...(options || {}),
  });
}
