import "./BoardItem.css"
import {useEffect, useRef} from "react";

interface Props {
    digit: number;
}

export default function BoardItem({digit}: Props) {

    const prevDigitRef = useRef(0);
    useEffect(() => {
        prevDigitRef.current = digit;
    }, [digit]);

    function getClassNameByDigit(digit: number): string {
        const animateClassName = digit !== 0 && digit !== prevDigitRef.current ? 'board-item--anim' : '';
        return digit ? `board-item value-${digit} ${animateClassName}` : `board-item ${animateClassName}`;
    }

    return (<div className={getClassNameByDigit(digit)}>{digit === 0 ? '' : digit}</div>)
}
