import styles from './Avatar.module.scss';
import { FunctionComponent } from "react";

interface AvatarProps {
    character: string
}
export const Avatar: FunctionComponent<AvatarProps> = ({character}) => {
    return (
        <div className={styles['avatar__container']}>
            <p className={styles['avatar__symbol']}>{character}</p>
        </div>
    )
}