export interface StatType {
    user: ItemType;
    citizen: ItemType;
    citizenFineCount: number;
}

interface ItemType {
    count: number;
    countToday: number;
}
