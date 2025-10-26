type Props = {
    title: string;
    items: { label: string; value?: string; colSpan?: number }[];
};

export default function CitizenBlock({ title, items }: Props) {
    console.log(title, items);
    return (
        <div className="rounded p-2 grid gap-2">
            <h2 className="text-xl text-primary">{title}</h2>
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-2">
                {items.map((x) => (
                    <div key={x.label} className={x.colSpan ? `col-span-${x.colSpan}` : ""}>
                        <h3 className="font-bold text-lg text-gray-500">{x.label}</h3>
                        <p className="text-justify whitespace-pre-line">{x.value ?? "Inconnu"}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
