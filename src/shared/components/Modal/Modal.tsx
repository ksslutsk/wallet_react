import { Dispatch, FunctionComponent, SetStateAction } from "react";
import { Button, ButtonVariant } from "../Button";
import styles from './Modal.module.scss';
import ReactDOM from "react-dom";

interface ModalProps {
    question?: string,
    doConfirm?: () => void,
    doCancel?: () => void,
    closeModal?: () => void,
    closeAfterAction?: boolean
}

export const Modal: FunctionComponent<ModalProps> = ({ question, doConfirm, doCancel, closeModal, closeAfterAction }) => ReactDOM.createPortal(
    <>
        <div className={styles['modal__container']}>
            <div className={styles['modal__window']}>
                <img className={styles['modal__cross']} onClick={closeModal} />
                <p className={styles['modal__question']}>{question}</p>
                <div className={styles['modal__buttons']}>
                    {/* naming doCnfirm doCancel */}
                    <div className={styles['modal__button']}>
                        <Button rounded onClick={() => {
                            doConfirm?.();
                            closeAfterAction && closeModal?.();
                        }}>Yes</Button>
                    </div>
                    <div className={styles['modal__button']}>
                        <Button rounded onClick={() => {
                            doCancel?.();
                            closeAfterAction && closeModal?.();
                        }} color={ButtonVariant.TRANSPARENT}>No</Button>
                    </div>
                </div>
            </div>
        </div>
    </>
    , document.body
);