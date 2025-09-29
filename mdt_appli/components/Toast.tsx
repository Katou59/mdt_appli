"use client";

export default function Toast(params: { message: string, type: 'success' | 'info' }) {
    if (params.type == "success") {
        return (<div className="toast toast-end">
            <div className="alert alert-success font-bold">
                <span>{params.message}</span>
            </div>
        </div>);
    }

    return (<div className="toast toast-end">
        <div className="alert alert-info font-bold">
            <span>{params.message}</span>
        </div>
    </div>);
}