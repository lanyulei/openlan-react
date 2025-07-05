import { request } from '@@/exports';
import { KubeApi } from '@/services/version';

export async function podsLog(
  name: string | undefined,
  namespace: string | undefined,
  params: object,
  options: { [key: string]: any },
) {
  return request(`${KubeApi}/api/v1/namespaces/${namespace}/pods/${name}/log`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}
