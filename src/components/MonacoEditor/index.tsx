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
}

const MonacoEditor: FC<MonacoEditorProps> = ({
  value = '',
  onChange,
  height = Math.max(200, (value || '').split('\n').length * 21),
  width = '100%',
  codeType = 'shell',
  readOnly = false,
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

  // ini 高亮规则（完善支持 ini 格式，包括区块、注释、键值、转义、布尔、数字等）
  const iniMonarch = {
    tokenizer: {
      root: [
        // 区块 [section]
        [/\[[^\]]+\]/, 'keyword'],
        // 注释 ; 或 #
        [/^\s*[;#].*$/, 'comment'],
        // 键值对 key = value
        [
          /^\s*([\w.\-\u4e00-\u9fa5]+)\s*=\s*(.*)$/,
          [
            'attribute.name', // key
            '', // =
            {
              // value
              cases: {
                '^true$|^false$': 'constant.language.boolean',
                '^[0-9]+$': 'number',
                '^".*"$': 'string',
                '^.*$': 'string',
              },
            },
          ],
        ],
        // 空行
        [/^\s*$/, ''],
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
        }}
        onMount={(editor, monaco) => {
          if (codeType === 'ini') {
            if (!monaco.languages.getLanguages().some((lang) => lang.id === 'ini')) {
              monaco.languages.register({ id: 'ini' });
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
