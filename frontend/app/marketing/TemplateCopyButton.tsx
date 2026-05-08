"use client";

import { useState } from "react";
import { trackEvent } from "../../lib/analytics";

type TemplateCopyButtonProps = {
  title: string;
  template: string;
};

export function TemplateCopyButton({ title, template }: TemplateCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(template);
    setCopied(true);
    trackEvent("template_copied", { template_title: title });
  }

  return (
    <button className="secondary" onClick={handleCopy}>
      {copied ? "Copied" : "Copy template"}
    </button>
  );
}
