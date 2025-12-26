import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function loadEmailTemplate(
  templateName: string,
  props: Record<string, string>,
) {
  const filePath = path.join(__dirname, "..", "html-templates", templateName);

  let template = fs.readFileSync(filePath, "utf-8");

  for (const [key, value] of Object.entries(props)) {
    template = template.replace(new RegExp(`{{${key}}}`, "g"), value);
  }

  return template;
}
