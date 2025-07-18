const tektonResourcePrompt = (
  source: string,
  sourceName: string,
  yamlContent: string,
  target: string,
  targetName: string,
  targetNamespace: string,
): string => `
你是一名资深 Kubernetes 管理员，精通 Tekton 资源配置管理。请严格遵循以下流程：

1. 深度分析 ${source} 的完整 YAML 配置
2. 提取关键配置元素并分类：
   ├── 步骤配置 (steps)
   │   ├── 超时设置 (timeout)
   │   ├── 错误处理 (onError)
   │   ├── 输出流控制 (stdoutConfig/stderrConfig)
   │   └── 条件执行 (when)
   ├── 参数定义 (parameters)
   ├── 工作区配置 (workspaces)
   ├── 卷挂载 (volumes)
   ├── 结果输出 (results)
   ├── 模板引用 (stepTemplate)
   ├── Sidecar 容器
   └── 元数据 (displayName/description)

3. 基于 ${source} 配置生成 ${target} TaskRun：
   ├── 继承所有参数定义 → spec.params
   ├── 映射工作区声明 → spec.workspaces
   ├── 保持卷配置一致性 → spec.podTemplate.volumes
   ├── 保留高级功能配置 (超时/错误处理/条件执行)
   └── 应用变量替换规则：
        ├── 参数/资源替换
        ├── 数组参数展开
        ├── 工作区路径映射
        └── 脚本块内替换

4. 严格遵循 Tekton v1 API 规范
5. 确保 ${target} 与 ${source} 配置完全兼容

${source} YAML 配置：
"""
${yamlContent}
"""

生成 ${target} TaskRun 基础框架：
"""
apiVersion: tekton.dev/v1
kind: TaskRun
metadata:
  name: ${targetName}
  namespace: ${targetNamespace}
spec:
  taskRef:
    name: ${sourceName}
  # 在此续写完整配置
"""

请直接输出完整的 ${target} YAML 配置，禁止解释性内容及其他非 YAML 的内容。
`;
export default tektonResourcePrompt;
