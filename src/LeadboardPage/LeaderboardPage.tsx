import './LeaderboardPage.css';
import '../Shared/Styles/Button.css';
import Leaderboard from "./Leaderboard";
import {gql, useQuery} from "@apollo/client";
import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import {AuthContext} from "../AuthProvider";

const SCORES_QUERY = gql`
    {
        allScores(first:10, sortBy: score_DESC, where: {score_not: null}) {
            id
            player {
                name
            }
            score
        }
    }
`;

interface Props {
    onShowLogin: () => void;
}

export default function LeaderboardPage({onShowLogin}: Props) {
    const {data, loading, error} = useQuery(SCORES_QUERY);
    const {userToken, logout} = useContext(AuthContext);
    const navigate = useNavigate();

    return (<div className="leaderboard-page">
        <h1 className="leaderboard-page__header">Leaderboard</h1>
        {!loading && !error && <Leaderboard scores={data.allScores}></Leaderboard>}
        <div className="leaderboard-page__actions">
            {userToken && <button onClick={() => navigate('/game')} className="button" type="button">New Game</button>}
            {!userToken && <button onClick={onShowLogin} className="button" type="button">Log in</button>}
            {!userToken && <button onClick={() => navigate('/registration')} className="button button--dark"
                                   type="button">Register</button>}
            {userToken && <button onClick={() => logout()} className="button button--dark"
                                  type="button">Logout</button>}
        </div>
        {!userToken && <div className="leaderboard-page__hint">Login or register to start new game.</div>}
    </div>)
}
