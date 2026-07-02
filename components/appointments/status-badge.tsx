import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { STATUS_COLORS, STATUS_LABELS, type Status } from "@/types";

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  return (
    <Badge variant="outline" className={cn(STATUS_COLORS[status], className)}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
