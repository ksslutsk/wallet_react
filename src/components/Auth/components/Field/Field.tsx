import { FunctionComponent } from "react";
import { Input, InputProps } from "../../../../shared/components";
import styles from './Field.module.scss';

interface FieldProps extends Pick<InputProps, 'type' | 'id' | 'label' | 'placeholder' | 'inputErrorMessage' | 'onChange' | 'onBlur'> {}

export const Field: FunctionComponent<FieldProps> = (props) => {
    return (
        <div className={styles['input-group']}>
            <Input {...props} inputClassName={styles['input']} required/>
        </div>
    )
}