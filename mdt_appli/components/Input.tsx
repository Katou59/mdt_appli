import React from "react";

type Props = {
    label: string;
    name: string;
    type: string;
    placeHolder: string;
    minLenght?: number;
    maxLenght?: number;
    max?: number;
    min?: number;
};
export default function Input(props: Props) {
    return (
        <fieldset className="fieldset">
            <legend className="fieldset-legend">{props.label}</legend>
            <input
                type={props.type}
                name={props.name}
                className="input w-full"
                placeholder={props.placeHolder}
                minLength={props.minLenght}
                maxLength={props.maxLenght}
                max={props.max}
                min={props.min}
            />
        </fieldset>
    );
}
