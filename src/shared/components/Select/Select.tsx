import clsx from "clsx";
import { FunctionComponent, useEffect, useState } from "react";
import { Category } from "../../../components/AccountingPage";
import { Input, InputProps } from "../Input";
import styles from './Select.module.scss';

export interface SelectProps extends InputProps {
    items?: any,
    selectStyle?: string,
    onChangeValue?: (value: Category) => void,
    needClear?: boolean
}

export const Select: FunctionComponent<SelectProps> = ({ selectStyle, items, onChangeValue, needClear, ...props }) => {

    const [isOpen, setIsOpen] = useState(false);
    const [activeElement, setActiveElement] = useState<Category>({});

    const handleClickSelect = () => {
        setIsOpen(prev => (!prev));
    }

    //MouseEventHandler<HTMLParagraphElement>
    const handleClickSelectItem = (element: Category) => {
        onChangeValue?.(element);
        setActiveElement(element);
        setIsOpen(false);
    }

    const handleBlurSelect = () => {
        setIsOpen(false);
    }

    useEffect(() => {
        if (needClear) setActiveElement({});
    }, [needClear]);

    return (
        <div className={styles['select-container']}>
            <div className={clsx([styles['select'], selectStyle])}>
                <Input {...props}
                    inputClassName={styles['select-input']}
                    onClick={(e) => {
                        handleClickSelect();
                    }}
                    value={activeElement.nameCategory || ''}
                    readOnly
                />
                <span className={clsx(
                    styles['select-icon'],
                    { [styles['select-icon--active']]: isOpen }
                )}
                    onClick={handleClickSelect}
                ></span>
            </div>

            <div className={clsx([
                styles['select-list'],
                { [styles['select-list--open']]: isOpen }
            ])}
                onBlur={handleBlurSelect}
            >
                {items?.map((element: Category) => (
                    <div key={element.id} className={styles['select-list__item']}
                        onClick={() => handleClickSelectItem(element)} >
                        <p className={styles['select-list__item-text']} >{element.nameCategory}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}