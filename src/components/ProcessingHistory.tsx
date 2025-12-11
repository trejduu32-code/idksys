import { motion } from "framer-motion";
import { History, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface HistoryItem {
  id: string;
  fileName: string;
  timestamp: number;
  fileSize: number;
  status: "success" | "error";
}

interface ProcessingHistoryProps {
  history: HistoryItem[];
  onClearHistory: () => void;
}

export function ProcessingHistory({ history, onClearHistory }: ProcessingHistoryProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-8">
        <History className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
        <p className="text-muted-foreground">No processing history yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          Processing History
        </h3>
        <Button
          onClick={onClearHistory}
          size="sm"
          variant="ghost"
          className="text-destructive hover:bg-destructive/20"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear History
        </Button>
      </div>

      <ScrollArea className="h-[250px]">
        <div className="space-y-2 pr-4">
          {history.slice(0, 10).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className="p-3 rounded-lg glass"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {item.status === "success" ? (
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  ) : (
                    <XCircle className="w-4 h-4 text-destructive" />
                  )}
                  <div>
                    <p className="text-sm font-medium truncate max-w-[200px]">{item.fileName}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(item.timestamp)}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{formatFileSize(item.fileSize)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
