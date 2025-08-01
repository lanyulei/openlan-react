﻿/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/Login',
      },
    ],
  },
  {
    path: '/home',
    name: 'home',
    icon: 'home',
    component: './Home',
  },
  {
    path: '/resource',
    name: 'resource',
    icon: 'database',
    routes: [
      {
        path: '/resource',
        redirect: '/resource/search',
      },
      {
        path: '/resource/search',
        name: 'search',
        component: './Resource/Search',
      },
      {
        path: '/resource/directory',
        name: 'directory',
        component: './Resource/Directory',
      },
      {
        path: '/resource/model',
        name: 'model',
        component: './Resource/Model',
      },
      {
        path: '/resource/cloud/account',
        name: 'cloudAccount',
        component: './Resource/Cloud/Account',
      },
      {
        path: '/resource/cloud/logic-resource',
        name: 'logicResource',
        component: './Resource/Cloud/LogicResource',
      },
      {
        path: '/resource/cloud/logic-resource-details/:id',
        name: 'logicResourceDetails',
        component: './Resource/Cloud/LogicResource/details',
        hideInMenu: true,
      },
      {
        path: '/resource/plugins',
        name: 'plugins',
        component: './Resource/Plugins',
      },
      {
        path: '/resource/model-details/:id',
        name: 'modelDetails',
        component: './Resource/Model/details',
        hideInMenu: true,
      },
      {
        path: '/resource/data/:id',
        name: 'data',
        component: './Resource/Data',
        hideInMenu: true,
      },
      {
        path: '/resource/data/details/:modelId/:id',
        name: 'dataDetails',
        component: './Resource/Data/details',
        hideInMenu: true,
      },
    ],
  },
  {
    path: '/deploy',
    name: 'deploy',
    icon: 'appstore',
    routes: [
      {
        path: '/deploy',
        redirect: '/deploy/overview',
      },
      {
        path: '/deploy/overview',
        name: 'overview',
        component: './Deploy/Overview',
      },
      {
        path: '/deploy/task',
        name: 'task',
        component: './Deploy/Task',
      },
      {
        path: '/deploy/taskruns',
        name: 'taskRuns',
        component: './Deploy/TaskRun',
      },
      {
        path: '/deploy/taskruns/details/:namespace/:name',
        name: 'taskRunsDetails',
        component: './Deploy/TaskRun/Details',
        hideInMenu: true,
      },
      {
        path: '/deploy/task/create',
        name: 'createTask',
        component: './Deploy/Task/create',
        hideInMenu: true,
      },
      {
        path: '/deploy/task/edit/:namespace/:name',
        name: 'editTask',
        component: './Deploy/Task/edit',
        hideInMenu: true,
      },
      {
        path: '/deploy/pipeline',
        name: 'pipeline',
        component: './Deploy/Pipeline',
      },
      {
        path: '/deploy/pipelineruns',
        name: 'pipelineRuns',
        component: './Deploy/PipelineRun',
      },
      {
        path: '/deploy/stepactions',
        name: 'stepActions',
        component: './Deploy/StepAction',
      },
      {
        path: '/deploy/customruns',
        name: 'customRuns',
        component: './Deploy/CustomRun',
      },
      {
        path: '/deploy/eventlisteners',
        name: 'eventListeners',
        component: './Deploy/EventListener',
      },
      {
        path: '/deploy/triggers',
        name: 'triggers',
        component: './Deploy/Trigger',
      },
      {
        path: '/deploy/triggerbindings',
        name: 'triggerBindings',
        component: './Deploy/TriggerBinding',
      },
      {
        path: '/deploy/clustertriggerbindings',
        name: 'clusterTriggerBindings',
        component: './Deploy/ClusterTriggerBinding',
      },
      {
        path: '/deploy/triggertemplates',
        name: 'triggerTemplates',
        component: './Deploy/TriggerTemplate',
      },
      {
        path: '/deploy/interceptors',
        name: 'interceptors',
        component: './Deploy/Interceptor',
      },
      {
        path: '/deploy/clusterinterceptors',
        name: 'clusterInterceptors',
        component: './Deploy/ClusterInterceptor',
      },
      {
        path: '/deploy/pipelineruns/details/:namespace/:name',
        name: 'pipelineRunsDetails',
        component: './Deploy/PipelineRun/Details',
        hideInMenu: true,
      },
      {
        path: '/deploy/pipeline/create',
        name: 'createPipeline',
        component: './Deploy/Pipeline/create',
        hideInMenu: true,
      },
      {
        path: '/deploy/pipeline/edit/:namespace/:name',
        name: 'editPipeline',
        component: './Deploy/Pipeline/edit',
        hideInMenu: true,
      },
    ],
  },
  // {
  //   name: 'list.table-list',
  //   icon: 'table',
  //   path: '/list',
  //   component: './TableList',
  // },
  {
    path: '/task',
    name: 'task',
    icon: 'AlignRight',
    routes: [
      {
        path: '/task',
        redirect: '/task/overview',
      },
      {
        path: '/task/overview',
        name: 'overview',
        component: './Task/Overview',
      },
      {
        path: '/task/template',
        name: 'template',
        component: './Task/Template',
      },
      {
        path: '/task/variable',
        name: 'variable',
        component: './Task/Variable',
      },
      {
        path: '/task/inventory',
        name: 'inventory',
        component: './Task/Inventory',
      },
      {
        path: '/task/secret',
        name: 'secret',
        component: './Task/Secret',
      },
    ],
  },
  // 内置配置
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
