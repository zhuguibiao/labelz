"use client";

import { Button } from "@labelz/ui/components/button";
import { ScrollArea } from "@labelz/ui/components/scroll-area";
import { Badge } from "@labelz/ui/badge";
import { Trash2, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@labelz/ui/components/collapsible";
import { useI18n } from "@/components/i18n-provider";

interface AnnotationListProps {
  annotations: any[];
  selectedId?: number | null;
  onAnnotationSelect: (annotation: any) => void;
  onAnnotationDelete: (id: number) => void;
}

export function AnnotationList({
  annotations,
  selectedId,
  onAnnotationSelect,
  onAnnotationDelete,
}: AnnotationListProps) {
  const { t } = useI18n();
  return (
    <div className="w-60 h-full border-l flex flex-col bg-background">
      <div className="p-5 border-b">
        <h3 className="font-medium">
          {t("annotations")} ({annotations.length})
        </h3>
      </div>

      <ScrollArea className="flex-1 max-h-[calc(100vh_-_150px)]">
        <div className="p-2 space-y-3">
          {annotations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                {t("no_annotations_yet")}
              </p>
            </div>
          ) : (
            annotations.map((annotation, index) => {
              const isSelected = annotation.id === selectedId;

              return (
                <Collapsible key={annotation.id}>
                  <div
                    className={`border rounded-lg p-2 cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-muted/100 shadow-sm"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <div
                      className="flex-1 flex items-center gap-2"
                      onClick={() => onAnnotationSelect(annotation)}
                    >
                      <span className="text-xs text-muted-foreground">
                        #{index + 1}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-xs truncate max-w-[80px]"
                        style={{
                          borderColor: annotation.color,
                          color: annotation.color,
                        }}
                      >
                        {annotation.label}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {annotation.type}
                      </span>
                    </div>

                    <div className="flex gap-1 items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAnnotationDelete(annotation.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                      <CollapsibleTrigger asChild>
                        <ChevronDown className="h-5 w-5" />
                      </CollapsibleTrigger>
                    </div>
                  </div>

                  <CollapsibleContent className=" pt-0 text-xs text-muted-foreground">
                    {JSON.stringify(annotation, null, 2)}
                  </CollapsibleContent>
                </Collapsible>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
