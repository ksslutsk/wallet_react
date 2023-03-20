import { ButtonHTMLAttributes, FunctionComponent, MouseEvent } from "react"
import { Button, ButtonProps } from "../../../../shared/components"
import styles from './ConfirmButton.module.scss';

interface ConfirmButtonProps extends Pick<ButtonProps, 'disabled' | 'onClick' | 'children'> { }

export const ConfirmButton: FunctionComponent<ConfirmButtonProps> = (props) => {
    return (
        <div className={styles['bottom-buttons-container']}>
            <div className={styles['bottom-button']}>
                <Button
                    {...props}
                    rounded
                ></Button>
            </div>
        </div>
    )
}