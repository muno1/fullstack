import { useEffect, useRef, useState } from "react";
import loader from "@monaco-editor/loader";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";
import type * as Monaco from "monaco-editor";
import dynamic from "next/dynamic";
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

type Language = "javascript" | "python";
type MonacoEditor = Monaco.editor.IStandaloneCodeEditor;

const Editor = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [language, setLanguage] = useState<Language>("javascript");
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string>("");
  const monacoEditorRef = useRef<MonacoEditor | null>(null);

  const sampleCode = {
    javascript:
      'function hello() {\n\tconsole.log("Hello world!");\n}\n\nhello();',
    python: 'def hello():\n    print("Hello world!")\n\nhello()',
  };

  useEffect(() => {
    loader.init().then((monaco) => {
      if (!editorRef.current) return;

      // Cleanup previous instance
      if (monacoEditorRef.current) {
        monacoEditorRef.current.dispose();
      }

      const properties = {
        value: sampleCode[language],
        language: language,
        theme: "vs-dark",
        automaticLayout: true,
        minimap: {
          enabled: false,
        },
      };

      monacoEditorRef.current = monaco.editor.create(
        editorRef.current,
        properties
      );
    });

    return () => {
      if (monacoEditorRef.current) {
        monacoEditorRef.current.dispose();
      }
    };
  }, [language]);

  const handleRun = async () => {
    if (!monacoEditorRef.current) return;

    setIsRunning(true);
    setOutput("");
    setError("");

    const code = monacoEditorRef.current.getValue();

    try {
      const response = await fetch("http://localhost:8000/run-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setOutput("");
      } else {
        setOutput(data.output || "No output generated");
        setError("");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setError("Error running code: " + errorMessage);
      setOutput("");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full gap-4">
      <div className="flex flex-col flex-1 gap-4">
        <div className="flex flex-col flex-1 border border-gray-300 rounded-md shadow-lg bg-[#1e1e1e] overflow-hidden">
          <div className="h-12 border-b border-gray-600 flex items-center px-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="px-1 py-1 bg-gray-750 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
              style={{ backgroundColor: "#1e1e1e" }}
              size={1}
            >
              <option
                className="bg-[#1e1e1e] hover:bg-gray-700"
                value="javascript"
              >
                JavaScript
              </option>
              <option className="bg-[#1e1e1e] hover:bg-gray-700" value="python">
                Python
              </option>
            </select>
          </div>

          <div ref={editorRef} className="flex-1 min-h-[40vh]" />

          <div className="absolute bottom-4 right-4 z-10">
            <Button
              onClick={handleRun}
              disabled={isRunning}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white shadow-lg"
            >
              <PlayIcon size={16} />
              {isRunning ? "Running..." : "Run"}
            </Button>
          </div>
        </div>

        {(output || error) && (
          <div className="h-32 p-4 bg-black text-white font-mono text-sm rounded-md overflow-auto">
            {error ? (
              <pre className="text-red-500">{error}</pre>
            ) : (
              <pre>{output}</pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
