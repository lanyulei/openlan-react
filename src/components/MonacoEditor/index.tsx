import { FC, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import styles from './index.less';

interface MonacoEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  height?: string | number;
  width?: string | number;
  codeType?: string;
  readOnly?: boolean;
  placeholder?: string;
}

const MonacoEditor: FC<MonacoEditorProps> = ({
  value = '',
  onChange,
  height = Math.max(200, (value || '').split('\n').length * 21),
  width = '100%',
  codeType = 'shell',
  readOnly = false,
  placeholder = '请输入内容...',
}) => {
  const [editorCode, setEditorCode] = useState(value);

  const handleEditorChange = (newValue: string | undefined) => {
    const code = newValue || '';
    setEditorCode(code);
    onChange?.(code);
  };

  useEffect(() => {
    setEditorCode(value);
  }, [value]);

  const iniMonarch = {
    tokenizer: {
      root: [
        [/\[[^\]]+\]/, 'keyword'], // 区块
        [/^\s*[;#].*$/, 'comment'], // 注释
        [/^([\w.\-\u4e00-\u9fa5]+)\s*=/, 'attribute.name', '@value'], // 键值对
        [/^\s*$/, ''], // 空行
      ],
      value: [
        [/^\s*(true|false)\s*$/, 'constant.language.boolean', '@pop'], // 布尔
        [/^\s*\d+\s*$/, 'number', '@pop'], // 数字
        [/^\s*".*"\s*$/, 'string', '@pop'], // 双引号字符串
        [/^\s*.*\s*$/, 'string', '@pop'], // 普通字符串
      ],
    },
  };

  return (
    <div className={styles.editorContainer} style={{ width: width }}>
      <Editor
        height={height}
        language={codeType}
        value={editorCode}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          fontSize: 14,
          lineNumbers: 'on',
          folding: true,
          tabSize: 2,
          insertSpaces: true,
          matchBrackets: 'always',
          theme: 'vs-light',
          readOnly: readOnly,
          placeholder: placeholder, // 支持 placeholder
        }}
        onMount={(editor, monaco) => {
          if (codeType === 'ini') {
            if (!monaco.languages.getLanguages().some((lang) => lang.id === 'ini')) {
              monaco.languages.register({ id: 'ini' });
              // @ts-ignore
              monaco.languages.setMonarchTokensProvider('ini', iniMonarch);
            }
          }
          // 可选：添加自定义快捷键
        }}
      />
    </div>
  );
};

export default MonacoEditor;
