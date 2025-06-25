import { FC, useState } from 'react';
import Editor from '@monaco-editor/react';
import styles from './index.less';

interface MonacoEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  height?: string | number;
  width?: string | number;
  codeType?: string;
}

const MonacoEditor: FC<MonacoEditorProps> = ({
  value = '',
  onChange,
  height = '200px',
  width = '100%',
  codeType = 'shell',
}) => {
  const [editorCode, setEditorCode] = useState(value);

  const handleEditorChange = (newValue: string | undefined) => {
    const code = newValue || '';
    setEditorCode(code);
    onChange?.(code);
  };

  return (
    <div className={styles.editorContainer} style={{ width: width }}>
      <Editor
        height={height}
        language={codeType} // 关键：设置为Shell语言
        value={editorCode}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false }, // 关闭缩略图
          scrollBeyondLastLine: false, // 取消底部空白
          automaticLayout: true, // 自动布局
          fontSize: 14,
          lineNumbers: 'on', // 显示行号
          folding: true, // 启用代码折叠
          tabSize: 2, // Shell推荐2空格缩进
          insertSpaces: true,
          matchBrackets: 'always',
          theme: 'vs-light', // 可选：深色主题
        }}
        onMount={(
          {
            /*editor*/
          },
        ) => {
          // 可选：添加自定义快捷键
          // editor.addCommand(window.monaco.KeyMod.CtrlCmd | window.monaco.KeyCode.Enter, () =>
          //   console.log('Ctrl+Enter pressed'),
          // );
        }}
      />
    </div>
  );
};

export default MonacoEditor;
