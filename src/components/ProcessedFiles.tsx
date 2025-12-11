import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Eye, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface ProcessedFile {
  name: string;
  originalSize: number;
  modifiedSize: number;
  content: string;
  status: "processing" | "success" | "error";
  error?: string;
}

interface ProcessedFilesProps {
  files: ProcessedFile[];
  onDownload: (file: ProcessedFile) => void;
  onDownloadAll: () => void;
}

export function ProcessedFiles({ files, onDownload, onDownloadAll }: ProcessedFilesProps) {
  const [previewFile, setPreviewFile] = useState<ProcessedFile | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const successfulFiles = files.filter((f) => f.status === "success");

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Processed Files</h3>
          {successfulFiles.length >= 2 && (
            <Button
              onClick={onDownloadAll}
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 glow-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Download All (ZIP)
            </Button>
          )}
        </div>

        <ScrollArea className="h-[300px]">
          <div className="space-y-2 pr-4">
            <AnimatePresence mode="popLayout">
              {files.map((file, index) => (
                <motion.div
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-lg glass glass-hover group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {file.status === "processing" && (
                        <Loader2 className="w-5 h-5 text-primary animate-spin" />
                      )}
                      {file.status === "success" && (
                        <CheckCircle2 className="w-5 h-5 text-success" />
                      )}
                      {file.status === "error" && (
                        <XCircle className="w-5 h-5 text-destructive" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{formatFileSize(file.originalSize)}</span>
                          <span>→</span>
                          <span className="text-primary">{formatFileSize(file.modifiedSize)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={file.status === "success" ? "default" : file.status === "error" ? "destructive" : "secondary"}
                        className={file.status === "success" ? "bg-success/20 text-success border-success/30" : ""}
                      >
                        {file.status}
                      </Badge>
                      {file.status === "success" && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setPreviewFile(file)}
                            className="h-8 w-8 hover:bg-primary/20 hover:text-primary"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onDownload(file)}
                            className="h-8 w-8 hover:bg-primary/20 hover:text-primary"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  {file.error && (
                    <p className="text-xs text-destructive mt-2">{file.error}</p>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </div>

      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent className="max-w-4xl h-[80vh] glass border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Preview: {previewFile?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden rounded-lg border border-border bg-background">
            {previewFile && (
              <iframe
                srcDoc={previewFile.content}
                sandbox="allow-scripts"
                className="w-full h-full"
                title={`Preview of ${previewFile.name}`}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
