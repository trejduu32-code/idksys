import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, RefreshCw, FileCode2 } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/FileUploader";
import { ScriptSelector, ScriptConfig } from "@/components/ScriptSelector";
import { ProcessedFiles, ProcessedFile } from "@/components/ProcessedFiles";
import { ProcessingHistory, HistoryItem } from "@/components/ProcessingHistory";
import { InfoCards } from "@/components/InfoCards";
import { processFile } from "@/lib/htmlInjector";

const HISTORY_KEY = "html-injector-history";

const Index = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [scriptConfig, setScriptConfig] = useState<ScriptConfig>({
    exploitBot: true,
    aiWidget: false,
    customEnabled: false,
    customScript: "",
  });

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history:", e);
      }
    }
  }, []);

  // Save history to localStorage
  const saveHistory = useCallback((newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  }, []);

  const handleFilesSelected = useCallback((newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleRemoveFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleProcess = useCallback(async () => {
    if (files.length === 0) return;
    
    const hasScript = scriptConfig.exploitBot || scriptConfig.aiWidget || 
      (scriptConfig.customEnabled && scriptConfig.customScript.trim());
    
    if (!hasScript) return;

    setIsProcessing(true);
    setProcessedFiles(files.map((f) => ({
      name: f.name,
      originalSize: f.size,
      modifiedSize: 0,
      content: "",
      status: "processing" as const,
    })));

    const newHistoryItems: HistoryItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const result = await processFile(file, scriptConfig);
        setProcessedFiles((prev) => {
          const updated = [...prev];
          updated[i] = {
            name: file.name,
            originalSize: result.originalSize,
            modifiedSize: result.modifiedSize,
            content: result.content,
            status: "success",
          };
          return updated;
        });
        newHistoryItems.push({
          id: `${Date.now()}-${i}`,
          fileName: file.name,
          timestamp: Date.now(),
          fileSize: result.modifiedSize,
          status: "success",
        });
      } catch (error) {
        setProcessedFiles((prev) => {
          const updated = [...prev];
          updated[i] = {
            name: file.name,
            originalSize: file.size,
            modifiedSize: 0,
            content: "",
            status: "error",
            error: error instanceof Error ? error.message : "Unknown error",
          };
          return updated;
        });
        newHistoryItems.push({
          id: `${Date.now()}-${i}`,
          fileName: file.name,
          timestamp: Date.now(),
          fileSize: file.size,
          status: "error",
        });
      }
    }

    saveHistory([...newHistoryItems, ...history].slice(0, 50));
    setIsProcessing(false);
  }, [files, scriptConfig, history, saveHistory]);

  const handleDownload = useCallback((file: ProcessedFile) => {
    const blob = new Blob([file.content], { type: "text/html" });
    saveAs(blob, `injected_${file.name}`);
  }, []);

  const handleDownloadAll = useCallback(async () => {
    const successfulFiles = processedFiles.filter((f) => f.status === "success");
    if (successfulFiles.length < 2) return;

    const zip = new JSZip();
    successfulFiles.forEach((file) => {
      zip.file(`injected_${file.name}`, file.content);
    });

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "injected_files.zip");
  }, [processedFiles]);

  const handleNewBatch = useCallback(() => {
    setFiles([]);
    setProcessedFiles([]);
  }, []);

  const handleClearHistory = useCallback(() => {
    saveHistory([]);
  }, [saveHistory]);

  const canProcess = files.length > 0 && !isProcessing && (
    scriptConfig.exploitBot || 
    scriptConfig.aiWidget || 
    (scriptConfig.customEnabled && scriptConfig.customScript.trim())
  );

  return (
    <div className="min-h-screen gradient-bg grid-pattern">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/20 glow animate-glow-pulse">
              <FileCode2 className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-glow">
            HTML Script Injector
          </h1>
          <p className="text-muted-foreground">
            used for <span className="text-primary font-semibold">ExploitZ3r0BOT</span> by{" "}
            <span className="text-primary">ExploitZ3r0</span>
          </p>
        </motion.header>

        {/* Info Cards */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <InfoCards />
        </motion.section>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Upload & Scripts */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-xl glass">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-primary" />
                Upload HTML Files
              </h2>
              <FileUploader
                onFilesSelected={handleFilesSelected}
                files={files}
                onRemoveFile={handleRemoveFile}
              />
            </div>

            <div className="p-6 rounded-xl glass">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Select Scripts
              </h2>
              <ScriptSelector config={scriptConfig} onChange={setScriptConfig} />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleProcess}
                disabled={!canProcess}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 glow disabled:opacity-50 disabled:glow-none"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Inject Scripts
                  </>
                )}
              </Button>
              {processedFiles.length > 0 && (
                <Button
                  onClick={handleNewBatch}
                  variant="outline"
                  size="lg"
                  className="border-border hover:bg-secondary"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  New Batch
                </Button>
              )}
            </div>
          </motion.div>

          {/* Right Column - Results & History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {processedFiles.length > 0 && (
              <div className="p-6 rounded-xl glass">
                <ProcessedFiles
                  files={processedFiles}
                  onDownload={handleDownload}
                  onDownloadAll={handleDownloadAll}
                />
              </div>
            )}

            <div className="p-6 rounded-xl glass">
              <ProcessingHistory
                history={history}
                onClearHistory={handleClearHistory}
              />
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-muted-foreground py-8 border-t border-border/30"
        >
          <p>
            © {new Date().getFullYear()} HTML Script Injector by{" "}
            <span className="text-primary">ExploitZ3r0</span>. Client-side processing only.
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default Index;
