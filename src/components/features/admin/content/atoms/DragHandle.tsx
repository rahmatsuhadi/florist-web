import { GripVertical } from "lucide-react";

export const DragHandle = () => (
  <div className="drag-handle cursor-grab active:cursor-grabbing p-1.5 text-gray-500 hover:text-brand transition-colors">
    <GripVertical size={16} />
  </div>
);
