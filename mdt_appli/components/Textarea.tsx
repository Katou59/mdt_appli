import React from "react";

type Props = {
    label: string;
    name: string;
    placeHolder: string;
    className?: string;
};
export default function Textarea(props: Props) {
    return (
        <fieldset className={`${props.className} fieldset w-full`}>
            <legend className="fieldset-legend">{props.label}</legend>
            <textarea className="textarea w-full" placeholder={props.placeHolder}></textarea>
        </fieldset>
    );
}
