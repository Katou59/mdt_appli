export interface HistoryToAddType {
    userId: string;
    entityType: string | null;
    entityId: string | null;
    action: "create" | "read" | "update" | "delete";
    oldData: object | null;
    newData: object | null;
}
