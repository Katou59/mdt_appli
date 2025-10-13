import React from "react";

type Props = {
    label: string;
    name: string;
    checkBoxLabel: string;
    className?: string;
};
export default function CheckBox(props: Props) {
    return (
        <fieldset className={`${props.className} fieldset bg-base-100 border-base-300`}>
            <legend className="fieldset-legend">{props.label}</legend>
            <label className="label">
                <input type="checkbox" className="checkbox checked:bg-primary" name={props.name} />
                {props.checkBoxLabel}
            </label>
        </fieldset>
    );
}
