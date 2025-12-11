export interface InjectionConfig {
  exploitBot: boolean;
  aiWidget: boolean;
  customEnabled: boolean;
  customScript: string;
}

const EXPLOIT_BOT_SCRIPT = '<script src="https://trejduu32-code.github.io/games/bot/exploitz3r0bot.js"></script>';
const AI_WIDGET_SCRIPT = '<script src="https://trejduu32-code.github.io/ww/ai.js"></script>';

export function injectScripts(html: string, config: InjectionConfig): string {
  const scriptsToInject: string[] = [];
  
  // Add preconfigured scripts first
  if (config.exploitBot) {
    scriptsToInject.push(EXPLOIT_BOT_SCRIPT);
  }
  if (config.aiWidget) {
    scriptsToInject.push(AI_WIDGET_SCRIPT);
  }
  
  // Add custom script last
  if (config.customEnabled && config.customScript.trim()) {
    scriptsToInject.push(config.customScript.trim());
  }
  
  if (scriptsToInject.length === 0) {
    return html;
  }
  
  const scriptsString = '\n    ' + scriptsToInject.join('\n    ') + '\n';
  
  // Case 1: Has <head> tag
  const headMatch = html.match(/<head[^>]*>/i);
  if (headMatch) {
    const headTag = headMatch[0];
    const headIndex = html.indexOf(headTag) + headTag.length;
    return html.slice(0, headIndex) + scriptsString + html.slice(headIndex);
  }
  
  // Case 2: Has <html> but no <head>
  const htmlMatch = html.match(/<html[^>]*>/i);
  if (htmlMatch) {
    const htmlTag = htmlMatch[0];
    const htmlIndex = html.indexOf(htmlTag) + htmlTag.length;
    const headBlock = `\n  <head>${scriptsString}  </head>`;
    return html.slice(0, htmlIndex) + headBlock + html.slice(htmlIndex);
  }
  
  // Case 3: No proper HTML structure - wrap everything
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">${scriptsString}  </head>
  <body>
${html}
  </body>
</html>`;
}

export async function processFile(
  file: File,
  config: InjectionConfig
): Promise<{ content: string; originalSize: number; modifiedSize: number }> {
  const originalContent = await file.text();
  const modifiedContent = injectScripts(originalContent, config);
  
  return {
    content: modifiedContent,
    originalSize: file.size,
    modifiedSize: new Blob([modifiedContent]).size,
  };
}
