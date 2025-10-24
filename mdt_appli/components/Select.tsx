import { KeyValueType } from "@/types/utils/key-value";

type Props = {
    label: string;
    name: string;
    defaulValue: string;
    items: KeyValueType<unknown, unknown>[];
    emptyValue?: string;
};

export default function Select(props: Props) {
    return (
        <fieldset className="fieldset">
            <legend className="fieldset-legend">{props.label}</legend>
            <select className="select w-full" name={props.name} defaultValue={props.defaulValue}>
                {props.emptyValue && (
                    <option value={""} disabled>
                        Choisir
                    </option>
                )}
                {props.items.map((x) => (
                    <option key={String(x.key)} value={String(x.key)}>
                        {String(x.value)}
                    </option>
                ))}
            </select>
        </fieldset>
    );
}
