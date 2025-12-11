import { motion } from "framer-motion";
import { Code2, Bot, Sparkles } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface ScriptConfig {
  exploitBot: boolean;
  aiWidget: boolean;
  customEnabled: boolean;
  customScript: string;
}

interface ScriptSelectorProps {
  config: ScriptConfig;
  onChange: (config: ScriptConfig) => void;
}

const scripts = [
  {
    id: "exploitBot",
    label: "ExploitZ3r0BOT",
    description: "Game bot automation script",
    icon: Bot,
    script: '<script src="https://trejduu32-code.github.io/games/bot/exploitz3r0bot.js"></script>',
  },
  {
    id: "aiWidget",
    label: "AI Chatbot Widget",
    description: "Interactive AI assistant widget",
    icon: Sparkles,
    script: '<script src="https://trejduu32-code.github.io/ww/ai.js"></script>',
  },
];

export function ScriptSelector({ config, onChange }: ScriptSelectorProps) {
  const handleToggle = (key: keyof ScriptConfig) => {
    if (key === "customScript") return;
    onChange({ ...config, [key]: !config[key] });
  };

  const handleCustomScriptChange = (value: string) => {
    onChange({ ...config, customScript: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {scripts.map((script, index) => {
          const Icon = script.icon;
          const isChecked = config[script.id as keyof ScriptConfig] as boolean;
          
          return (
            <motion.div
              key={script.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg glass glass-hover cursor-pointer transition-all ${
                isChecked ? "border-primary/50 glow-sm" : ""
              }`}
              onClick={() => handleToggle(script.id as keyof ScriptConfig)}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  id={script.id}
                  checked={isChecked}
                  onCheckedChange={() => handleToggle(script.id as keyof ScriptConfig)}
                  className="mt-1 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isChecked ? "text-primary" : "text-muted-foreground"}`} />
                    <Label
                      htmlFor={script.id}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {script.label}
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{script.description}</p>
                  <code className="text-xs text-primary/70 font-mono block mt-2 truncate">
                    {script.script}
                  </code>
                </div>
              </div>
            </motion.div>
          );
        })}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-4 rounded-lg glass transition-all ${
            config.customEnabled ? "border-primary/50 glow-sm" : ""
          }`}
        >
          <div className="flex items-start gap-3">
            <Checkbox
              id="customEnabled"
              checked={config.customEnabled}
              onCheckedChange={() => handleToggle("customEnabled")}
              className="mt-1 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Code2 className={`w-4 h-4 ${config.customEnabled ? "text-primary" : "text-muted-foreground"}`} />
                <Label
                  htmlFor="customEnabled"
                  className="text-sm font-medium cursor-pointer"
                >
                  Custom Script
                </Label>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Add your own script tag</p>
              {config.customEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3"
                >
                  <Textarea
                    placeholder='<script src="your-script.js"></script>'
                    value={config.customScript}
                    onChange={(e) => handleCustomScriptChange(e.target.value)}
                    className="font-mono text-xs min-h-[80px] bg-background/50 border-border focus:border-primary resize-none"
                  />
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
