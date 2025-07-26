// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { V1 } from '@/services/version';

// router.GET("", api.VariableList)
// router.GET("/:id", api.VariableDetailById)
// router.POST("", api.CreateVariable)
// router.PUT("/:id", api.UpdateVariable)
// router.DELETE("/:id", api.DeleteVariable)

export async function getModels(params: object, options?: { [key: string]: any }) {
  return request(`${V1}/resource/model/list`, {
    method: 'GET',
    params,
  });
}
