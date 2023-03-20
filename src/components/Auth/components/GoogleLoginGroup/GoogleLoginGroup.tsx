import { FunctionComponent } from "react";
import { Button, ButtonVariant } from "../../../../shared/components";
import styles from './GoogleLoginGroup.module.scss';

export const GoogleLoginGroup: FunctionComponent = () => {
    return (
        <div className={styles['google-group']}>
                <p className={styles['google-group__top-text']}>You can log in with your Google Account:</p>
                <div className={styles['google-button__container']}>
                    <Button rounded color={ButtonVariant.SECONDARY} type='button'>
                        <div className={styles['google-button__content']}>
                            <span className={styles['google-symbol']}></span>
                            <label className={styles['google-label']}>Google</label>
                        </div>
                    </Button>
                </div>
                <label>Or register using an email and password:</label>
            </div>
    )
}