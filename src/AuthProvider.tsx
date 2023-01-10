import {createContext, ReactNode, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import {gql, useMutation} from "@apollo/client";

interface AuthContextData {
    userToken: string | null,
    login: (email: string, password: string) => Promise<boolean> | void
    logout: () => void
    register: (name: string, email: string, password: string) => void
}

interface Props {
    children: ReactNode;
}

const LOGIN_MUTATION = gql`
    mutation Login($email: String!, $password: String!) {
        authenticateUserWithPassword(
            email: $email
            password: $password
        ) {
            token
            item {
                id
            }
        }
    }
`;

const LOGOUT_MUTATION = gql`
    mutation Logout {
        unauthenticateUser {
            success
        }
    }
`;

const REGISTER_MUTATION = gql`
    mutation Register($name: String!, $email: String!, $password: String!) {
        createUser(data: {
            name: $name
            email: $email
            password: $password
        }) {
            id
        }
    }
`;

export const AuthContext = createContext<AuthContextData>({
    userToken: null,
    login: () => {
    },
    logout: () => {
    },
    register: () => {
    }
});

export const AuthProvider = ({children}: Props) => {
    const [userToken, setUserToken] = useState<string | null>(getInitialUserToken());
    const [loginUser] = useMutation(LOGIN_MUTATION);
    const [registerNewUser] = useMutation(REGISTER_MUTATION);
    const [logoutUser] = useMutation(LOGOUT_MUTATION);
    const navigate = useNavigate();

    function getInitialUserToken(): string | null {
        let output = null;
        if (window.localStorage.getItem('token')) {
            output = JSON.parse(window.localStorage.getItem('token') as string);
        }
        return output;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    async function login(email: string, password: string, redirectTo: string = '/game'): Promise<boolean> {
        try {
            const {
                data: {
                    authenticateUserWithPassword: {token}
                }
            } = await loginUser({variables: {email, password}})
            setUserToken(token);
            window.localStorage.setItem('token', JSON.stringify(token));
            navigate(redirectTo);
            return true;
        } catch (e: any) {
            alert(e.message)
            return false;
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    async function logout(): Promise<void> {
        try {
            const {data: {unauthenticateUser: {success}}} = await logoutUser()
            if (success) {
                window.localStorage.removeItem('token');
                setUserToken(null);
                navigate("/");
            } else {
                throw new Error("Logout failed!")
            }
        } catch (e: any) {
            alert(e.message)
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    async function register(name: string, email: string, password: string): Promise<void> {
        try {
            await registerNewUser({variables: {name, email, password}})
            await login(email, password, '/');
            navigate('/')
        } catch (e: any) {
            alert(e.message)
        }
    }

    // eslint-disable-next-line
    const value = useMemo(() => ({userToken, login, logout, register}), [userToken]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
