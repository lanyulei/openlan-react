const tektonResourcePrompt = (
  source: string,
  sourceName: string,
  yamlContent: string,
  target: string,
  targetName: string,
  targetNamespace: string,
): string => `
你是一名优秀的 Kubernetes 管理员，对于资源 YAML 配置非常的精通。

对 Tekton 的配置管理非常的精通。

请认真分析，仔细阅读下面的 ${source} 的 YAML 配置，根据下面的 ${source} 的内容认真思考，生成一个 ${target} 的 YAML 配置。

${source} 的 YAML 配置如下：

"""
${yamlContent}
"""

根据下面 ${target} 的内容，继续往下续写 ${target} 的 YAML 配置。

"""
{
  apiVersion: 'tekton.dev/v1',
  kind: 'TaskRun',
  metadata: {
    name: ${targetName},
    namespace: ${targetNamespace},
  },
  spec: {
    taskRef: {
      name: ${sourceName},
    },
  },
}
"""

直接返回 ${target} 的 YAML 配置，不需要任何解释或额外的内容。
`;
export default tektonResourcePrompt;
