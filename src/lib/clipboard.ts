export async function copyText(text: string, onCopied?: () => void): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    onCopied?.();
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    onCopied?.();
  }
}

export function copyEl(id: string, onCopied?: () => void): Promise<void> {
  const text = document.getElementById(id)?.textContent || '';
  return copyText(text, onCopied);
}
