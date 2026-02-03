export const STATUS_TEXT = {
  healthy: '正常',
  warning: '注意',
  critical: '異常',
  unknown: '不明',
} as const;

export type StatusType = keyof typeof STATUS_TEXT;

export function getStatusText(status: string | undefined): string {
  if (!status || !STATUS_TEXT[status as StatusType]) return '不明';
  return STATUS_TEXT[status as StatusType];
}
