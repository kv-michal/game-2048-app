import './Leaderboard.css';

interface Props {
    scores: Array<{
        id: number,
        player: {
            name: string
        },
        score: number
    }>;
}

export default function Leaderboard({scores}: Props) {
    function formatScore(score: number): string {
        return score.toLocaleString();
    }

    return (
        <ol className="users-list">
            {scores.map(user => (
                <li key={user.id} className="users-list__item">
                    <div className="user">
                        <div className="user__name">{user.player.name}</div>
                        <div className="user__score">{formatScore(user.score)}</div>
                    </div>
                </li>))}
        </ol>)
}
