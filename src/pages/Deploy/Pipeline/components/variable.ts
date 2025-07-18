const tektonPipelinePrompt = (
  yamlContent: string,
  targetName: string,
  targetNamespace: string,
): string => {
  let source = 'Pipeline';
  let target = 'PipelineRun';

  return `
你是一名资深 Kubernetes 管理员，精通 Tekton 资源配置管理。请严格遵循以下流程：

1. 深度解析 ${source} 的完整 YAML 配置，全面理解其结构和内容。
2. 识别并提取与 ${target} 相关的关键配置元素：
    * params: 指定 Pipeline 需要的 Parameters。
    * workspaces: 指定 Pipeline 所需的一组工作区。
    * tasks:
        - name: Task 在 Pipeline 上下文中的名称。
        - displayName: Task 在 Pipeline 上下文中面向用户的名称。
        - description: Task 在 Pipeline 上下文中的描述。
        - taskRef: 对已定义 Task 的引用。
        - taskSpec: Task 的规范定义。
        - runAfter: 表示 Task 应在一个或多个其他 Tasks 之后执行，无需输出链接。
        - retries: 指定 Task 失败后重试执行的次数，不适用于取消执行。
        - when: 指定 when 表达式保护 Task 执行；仅当所有表达式为真时允许执行。
        - timeout: 指定 Task 失败前的超时时间。
        - params: 指定 Task 需要的 Parameters。
        - workspaces: 指定 Task 需要的 Workspaces。
        - matrix: 指定 Parameters 用于将 Task 展开为多个 TaskRuns 或 Runs。
    * results: Pipeline 指定发出执行结果的位置。
    * displayName: 面向用户的 Pipeline 名称，用于填充 UI。
    * description: Pipeline 对象的详细描述。
    * finally: 指定在所有其他 Tasks 完成后并行执行的一个或多个 Tasks。
        - name: Task 在 Pipeline 上下文中的名称。
        - displayName: Task 在 Pipeline 上下文中面向用户的名称。
        - description: Task 在 Pipeline 上下文中的描述。
        - taskRef: 对已定义 Task 的引用。
        - taskSpec: Task 的规范定义。
        - retries: 指定 Task 失败后重试执行的次数，不适用于取消执行。
        - when: 指定 when 表达式保护 Task 执行；仅当所有表达式为真时允许执行。
        - timeout: 指定 Task 失败前的超时时间。
        - params: 指定 Task 需要的 Parameters。
        - workspaces: 指定 Task 需要的 Workspaces。
        - matrix: 指定 Parameters 用于将 Task 展开为多个 TaskRuns 或 Runs。
3. 基于提取的元素，生成符合 Tekton v1 API 规范的 ${target} 配置。
4. 确保生成的 ${target} 配置与 ${source} 配置完全兼容。

${source} YAML 配置：
"""
${yamlContent}
"""

生成 ${target} 的基础框架：
"""
apiVersion: tekton.dev/v1
kind: ${target}
metadata:
  name: ${targetName}
  namespace: ${targetNamespace}
spec:
  # 在此续写完整配置
"""

请直接输出完整的 ${target} YAML 配置，禁止解释性内容及其他非 YAML 的内容。
`;
};

export default tektonPipelinePrompt;
