import { Item, ItemContent, ItemDescription, ItemTitle } from "./ui/item";

export function ItemForm({ title, description }: { title: string; description: string }) {
    return (
        <Item className="py-3">
            <ItemContent>
                <ItemTitle>{title}</ItemTitle>
                <ItemDescription>{description}</ItemDescription>
            </ItemContent>
        </Item>
    );
}
