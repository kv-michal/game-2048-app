import "./RegistrationPage.css"
import '../Shared/Styles/Button.css';
import '../Shared/Styles/Field.css';
import {SyntheticEvent, useContext, useState} from "react";
import {AuthContext} from "../AuthProvider";


export default function RegistrationPage() {
    const {register} = useContext(AuthContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
    });

    async function onSubmit(event: SyntheticEvent): Promise<void> {
        event.preventDefault();
        setLoading(true);
        await register(`${formData.firstname} ${formData.lastname}`, formData.email, formData.password)
        setLoading(false);
    }

    function fieldChange(event: SyntheticEvent): void {
        const target = (event.target as HTMLInputElement);
        setFormData({...formData, [target.name]: target.value});
    }

    function getFormClassName(disabled: boolean): string {
        return `form ${disabled && 'form--disabled'}`;
    }

    return (<div className="registration-container">
        <h1>Registration</h1>
        <form onSubmit={onSubmit} className={getFormClassName(loading)}>
            <div className="form__fields">
                <div className="multi-fields">
                    <input className="field" value={formData.firstname} onChange={fieldChange} name="firstname"
                           type="text" placeholder="First name"/>
                    <input className="field" value={formData.lastname} onChange={fieldChange} name="lastname"
                           type="text" placeholder="Last name"/>
                </div>
                <input className="field" value={formData.email} onChange={fieldChange} name="email" type="text"
                       placeholder="Email address"/>
                <input className="field" value={formData.password} onChange={fieldChange} name="password"
                       type="password" placeholder="Create password"/>
            </div>
            <div className="form__row">
                <button className="button button--dark" type="submit">Register</button>
            </div>
        </form>
    </div>)
}
