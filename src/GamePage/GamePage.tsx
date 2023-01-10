/*eslint no-loop-func: "off"*/
import "./GamePage.css"
import '../Shared/Styles/Button.css';
import BoardItem from "./BoardItem";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {gql, useMutation} from "@apollo/client";

export interface BoardPosition {
    rowIndex: number;
    colIndex: number
}

const SAVE_SCORE_MUTATION = gql`
    mutation SaveScore($data: ScoreCreateInput!) {
        createScore(
            data: $data
        ){
            player {
                id
                name
            }
            score
        }
    }
`;

export default function GamePage() {
    const navigate = useNavigate();
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
    const [board, setBoard] = useState<number[][]>(getInitialState());
    const [saveScore] = useMutation(SAVE_SCORE_MUTATION);
    const boardRef = useRef(board);
    const maxBoardIndex = board.length - 1;

    useEffect(() => {
        window.addEventListener('keyup', keyListener);
        return () => window.removeEventListener('keyup', keyListener);
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (isGameOver) {
            saveScore({variables: {data: {score}}});
        }
        // eslint-disable-next-line
    }, [isGameOver, score])

    function getInitialState(): number[][] {
        const board = new Array(4).fill(0).map(() => new Array(4).fill(0));
        generateTwos(board);
        return board;
    }

    function generateTwos(board: number[][]): void {
        let freeIndexes: BoardPosition[] = [];
        board.forEach((row, rowIndex) => row.forEach((item, colIndex) => {
            if (item === 0) {
                freeIndexes.push({rowIndex, colIndex});
            }
        }));
        if (freeIndexes.length === 0) return;
        let randomPosition = popRandomPosition(freeIndexes);
        if (randomPosition) {
            board[randomPosition.rowIndex][randomPosition.colIndex] = 2;
        }
        randomPosition = popRandomPosition(freeIndexes);
        if (randomPosition) {
            board[randomPosition.rowIndex][randomPosition.colIndex] = 2;
        }
    }

    function popRandomPosition(list: BoardPosition[]): BoardPosition | undefined {
        const randomIndex = Math.floor(Math.random() * list.length);
        return list.splice(randomIndex, 1)[0];
    }

    function keyListener(event: KeyboardEvent): void {
        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) return;
        const boardCopy = JSON.parse(JSON.stringify(boardRef.current));
        switch (event.code) {
            case 'ArrowUp': {
                for (let row = 0; row <= maxBoardIndex; row++) {
                    for (let col = 0; col <= maxBoardIndex; col++) {
                        gameMove(boardCopy, -1, 0, row, col);
                    }
                }
                break;
            }
            case 'ArrowDown': {
                for (let row = maxBoardIndex; row >= 0; row--) {
                    for (let col = 0; col <= maxBoardIndex; col++) {
                        gameMove(boardCopy, 1, 0, row, col);
                    }
                }
                break;
            }
            case 'ArrowLeft': {
                for (let col = 0; col <= maxBoardIndex; col++) {
                    for (let row = 0; row <= maxBoardIndex; row++) {
                        gameMove(boardCopy, 0, -1, row, col);
                    }
                }
                break;
            }
            case 'ArrowRight': {
                for (let col = maxBoardIndex; col >= 0; col--) {
                    for (let row = 0; row <= maxBoardIndex; row++) {
                        gameMove(boardCopy, 0, 1, row, col);
                    }
                }
                break;
            }
        }
        generateTwos(boardCopy);
        setBoard(boardCopy);
        boardRef.current = boardCopy;
        checkGameOver(boardCopy);
    }

    function isValidMove(board: number[][], row: number, col: number, nextRow: number, nextCol: number): boolean {
        const isInsideBoard = nextRow >= 0 && nextRow <= maxBoardIndex && nextCol >= 0 && nextCol <= maxBoardIndex;
        return isInsideBoard && (board[nextRow][nextCol] === 0 || board[row][col] === board[nextRow][nextCol]);
    }

    function checkGameOver(board: number[][]): void {
        for (let i = 0; i <= maxBoardIndex; i++) {
            for (let j = 0; j <= maxBoardIndex; j++) {
                if (board[i][j] === 0 || (j + 1 <= maxBoardIndex && board[i][j] === board[i][j + 1]) || (i + 1 <= maxBoardIndex && board[i][j] === board[i + 1][j])) {
                    return;
                }
            }
        }
        setIsGameOver(true);
    }

    function gameMove(board: number[][], rowDir: number, colDir: number, row: number, col: number): boolean | undefined {
        if (board[row][col] > 0) {
            let nextRow = row + rowDir;
            let nextCol = col + colDir;
            while (isValidMove(board, row, col, nextRow, nextCol)) {
                if (board[nextRow][nextCol] === 0) {
                    board[nextRow][nextCol] = board[row][col];
                    board[row][col] = 0;
                } else if (board[row][col] === board[nextRow][nextCol]) {
                    board[nextRow][nextCol] += board[row][col];
                    board[row][col] = 0;
                    setScore(score => score + board[nextRow][nextCol]);
                    return true;
                }
                row = nextRow;
                col = nextCol;
                nextRow += rowDir;
                nextCol += colDir;
            }
        }
    }

    function resetGame(): void {
        setIsGameOver(false);
        setBoard(getInitialState());
        setScore(0);
    }

    return (<div className="game-container">
        <div className="header">
            <div className="score">
                Score <div className="score__value">{score}</div>
            </div>
            <div className="header__buttons">
                <button onClick={() => navigate('/')} className="button" type="button">Home</button>
                <button onClick={resetGame} className="button button--dark" type="button">New Game</button>
            </div>
        </div>
        <div className="board">
            {board.map((row, rowIndex) => row.map((digit, colIndex) => (
                <BoardItem key={`${rowIndex}${colIndex}`} digit={digit}></BoardItem>)))}
        </div>
        {isGameOver && <div className="game-over">
            <h2 className="game-over__header">Game over</h2>
            <button onClick={resetGame} className="button button--dark" type="button">New Game</button>
        </div>}
    </div>);
}
