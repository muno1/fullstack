import { useEffect, useRef, useState } from "react";
import loader from "@monaco-editor/loader";
import { Button } from "@/components/ui/button";
import { PlayIcon, TerminalIcon } from "lucide-react";
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
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const monacoEditorRef = useRef<MonacoEditor | null>(null);

  const sampleCode = {
    javascript:
      'function hello() {\n\tconsole.log("Hello world!");\n}\n\nhello();',
    python: 'def hello():\n    print("Hello world!")\n\nhello()',
  };

  useEffect(() => {
    loader.init().then((monaco) => {
      if (!editorRef.current) return;

      if (monacoEditorRef.current) {
        monacoEditorRef.current.dispose();
      }

      monacoEditorRef.current = monaco.editor.create(editorRef.current, {
        value: sampleCode[language],
        language: language,
        theme: "vs-dark",
        automaticLayout: true,
        minimap: { enabled: false },
      });
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
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
      setError(
        "Error running code: " +
          (error instanceof Error ? error.message : "Unknown error occurred")
      );
      setOutput("");
    } finally {
      setIsRunning(false);
    }

    setIsConsoleOpen(true);
  };

  return (
    <div className="relative flex flex-col w-full h-full gap-4">
      <div className="relative flex flex-col flex-1 border border-gray-300 rounded-md shadow-lg bg-[#1e1e1e] overflow-hidden">
        {/* Language Selector */}
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

        <div className="absolute top-0 py-2 right-6 z-10">
          <Button
            onClick={handleRun}
            disabled={isRunning}
            className="flex py-1 items-center bg-green-600 hover:bg-green-700 text-white shadow-lg h-8"
          >
            <PlayIcon size={16} />
            {isRunning ? "Running..." : "Run"}
          </Button>
        </div>

        <div
          className="absolute bottom-0 left-0 w-full h-6 bg-gray-800 text-white text-xs flex items-center justify-center cursor-pointer hover:bg-gray-700"
          onClick={() => setIsConsoleOpen(!isConsoleOpen)}
        >
          <TerminalIcon size={14} className="mr-2" />
          {isConsoleOpen ? "Hide Console" : "Show Console"}
        </div>

        <div
          className={`absolute left-0 w-full bg-black text-white font-mono text-sm rounded-md overflow-auto transition-all duration-300 ${
            isConsoleOpen ? "bottom-6 h-32" : "bottom-0 h-0"
          }`}
        >
          <div className="p-4">
            {error ? (
              <pre className="text-red-500">{error}</pre>
            ) : (
              <pre>{output}</pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
