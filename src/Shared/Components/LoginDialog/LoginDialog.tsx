import "./LoginDialog.css"
import '../../Styles/Button.css';
import '../../Styles/Field.css';
import {SyntheticEvent, useContext, useState} from "react";
import {AuthContext} from "../../../AuthProvider";

interface Props {
    onClose: () => void;
}

export default function LoginDialog({onClose}: Props) {
    const {login} = useContext(AuthContext);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    async function onSubmit(event: SyntheticEvent): Promise<void> {
        event.preventDefault();
        const success = await login(formData.email, formData.password)
        if (success) {
            onClose();
        }
    }

    function fieldChange(event: SyntheticEvent): void {
        const target = (event.target as HTMLInputElement);
        setFormData({...formData, [target.name]: target.value});
    }

    function close(event: SyntheticEvent): void {
        if ((event.target as HTMLDivElement).className === 'login-backdrop') {
            onClose();
        }
    }

    return (<div className="login-backdrop" onMouseDown={close}>
        <div className="login-container">
            <h3 className="login-container__header">Login</h3>
            <form onSubmit={onSubmit} className="form">
                <div className="form__fields">
                    <div className="multi-fields">
                        <input className="field" value={formData.email} onChange={fieldChange} name="email" type="text"
                               placeholder="Email"/>
                        <input className="field" value={formData.password} onChange={fieldChange} name="password"
                               type="password" placeholder="Password"/>
                    </div>
                </div>
                <div className="form__actions">
                    <button className="button button--dark" type="submit">Login</button>
                </div>
            </form>
        </div>
    </div>)
}
