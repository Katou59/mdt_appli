import { Item, ItemContent, ItemDescription, ItemTitle } from "./ui/item";

export function ItemForm({ title, description }: { title: string; description: string }) {
    return (
        <Item className="">
            <ItemContent>
                <ItemTitle>{title}</ItemTitle>
                <ItemDescription>{description}</ItemDescription>
            </ItemContent>
        </Item>
    );
}
