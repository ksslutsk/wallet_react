import { ChangeEvent, FunctionComponent, useContext, useEffect, useState } from "react";
import { Button, ButtonVariant, Input, InputType, InputVariant, Select } from "../../../../shared/components";
import { Category, grnToPenny, isPriceValid, Transaction, TransactionsDataContext, UserContext } from "../../../../shared/libs";
import { addExpenseTransactionRequest } from "../../../../shared/requests";
import { getCategoriesRequest } from "../../../../shared/requests/categories/getCategoriesRequest";
import { addIncomeTransactionRequest } from "../../../../shared/requests/transactions/addIncomeTransactionRequest";
import { routes } from "../../../../shared/routes";
import styles from './AccountingHeader.module.scss';

export interface Product {
    description?: string,
    category?: Category,
    price?: string
}

interface AddTransactionResponse {
    newBalance: number,
    limitLeft: number,
    transaction: Transaction,
}

interface HeaderProps {
    //true - expenses, false - incomes
    transactionVariant: boolean
}
export const AccountingHeader: FunctionComponent<HeaderProps> = ({ transactionVariant }) => {

    const [categories, setCategories] = useState<Category[]>([])

    const [product, setProduct] = useState<Product>({
        description: '',
        category: {},
        price: undefined,
    });

    const [clearSelect, setClearSelect] = useState(false);

    const data = useContext(UserContext);

    const { transactions, setTransactions } = useContext(TransactionsDataContext);

    const getCategories = (token: string) => {

        const options: RequestInit = {
            method: 'GET',
            headers: { 'authorization': `Bearer ${token}` },
        };

        getCategoriesRequest(options)
            .then((resp: Response) => {
                return resp.json()
            })
            .then((categories: Category[]) => {
                setCategories(categories.filter((e: Category) => { return e.typeCategory === (transactionVariant ? "expense" : "income") }))
            })
    }

    const addTransactionRequest = (options: RequestInit) => {
        if (transactionVariant) {
            return addExpenseTransactionRequest(options);
        }
        else {
            return addIncomeTransactionRequest(options);
        }
    }

    const checkPriceBeforeTransactions = (value: string) => {
        if (value.at(value.length - 1) === '.') {
            return Number(value + '0');
        }
        return Number(value);
    }

    const addTransaction = (token: string | undefined, url: string) => {
        if (product.description && product.price && product.category) {
            const date = new Date();

            const dataTransaction: Transaction = {
                description: product.description || 'default desc',
                amount: grnToPenny(checkPriceBeforeTransactions(product.price)),
                categoryId: product.category?.id || 3,
                date: `${date.getFullYear()}-${(date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : (date.getMonth() + 1)}-${date.getDate()}`
            }

            const options: RequestInit = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'authorization': `Bearer ${token}` },
                body: JSON.stringify(dataTransaction)
            };

            addTransactionRequest(options)
                .then((r: Response) => {
                    if (r.ok)
                        return r.json();
                })
                .then((a: AddTransactionResponse) => {
                    data.setUser?.(prev => ({
                        access_token: prev.access_token,
                        refresh_token: prev.refresh_token,
                        userData: { ...prev.userData, balance: a.newBalance }
                    }));

                    setTransactions?.((prev) => { prev.push(a.transaction); return prev; });
                })
        }
    }

    const getDate = () => {
        const curr = new Date();
        const day = curr.getDate();
        const month = (curr.getMonth() + 1) < 10 ? `0${(curr.getMonth() + 1)}` : (curr.getMonth() + 1);
        const year = curr.getFullYear();

        return `${day}.${month}.${year}`;
    }

    const handleChangeDescription = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setProduct(prev => ({ ...prev, description: value }));
    }

    const handleChangeCategory = (val: Category) => {
        setProduct({ ...product, category: val });
        setClearSelect(false);
    }

    const handleChangePrice = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        if (isPriceValid(value)) {
            setProduct(prev => ({ ...prev, price: value }));
        }
    }

    useEffect(() => {
        if (!data.user?.access_token) return;

        clearFields();
        getCategories(data.user.access_token);

    }, [transactionVariant]);

    const clearFields = () => {
        setProduct({
            description: '',
            category: {},
            price: undefined
        });

        setClearSelect(true);
    }
    const handleClearButton = () => {
        clearFields();
    }

    const handleInputButton = () => {
        addTransaction(data.user?.access_token, routes.transactions.expense);
        clearFields();
    }

    return (
        <div className={styles['acc-header']}>

            <div className={styles['acc-header__fields']}>
                <div className={styles['acc-header__date-container']}>
                    <span className={styles['acc-header__date-icon']}></span>
                    <label className={styles['acc-header__date']}>{getDate()}</label>
                </div>

                <div className={styles['acc-header__product-info']}>
                    <Input variant={InputVariant.SECONDARY} inputClassName={styles['acc-header__expense-description']}
                        placeholder="Product description" onChange={handleChangeDescription} value={product.description} />

                    <Select selectStyle={styles['acc-header__expense-category']} items={categories}
                        placeholder='Product category' onChangeValue={handleChangeCategory} needClear={clearSelect} />

                    <div className={styles['acc-header__expense-price']}>
                        <Input placeholder="0.00" variant={InputVariant.SECONDARY} inputClassName={styles['expense-price__input']}
                            type={InputType.TEXT}
                            pattern="[0-9]"
                            onChange={handleChangePrice} value={product.price || ''} />
                        <span className={styles['expense-price__input-icon']}></span>
                    </div>
                </div>
            </div>

            <div className={styles['acc-header__buttons']}>
                <div className={styles['acc-header__button']}>
                    <Button rounded onClick={handleInputButton}>Input</Button>
                </div>
                <div className={styles['acc-header__button']}>
                    <Button rounded color={ButtonVariant.TRANSPARENT} onClick={handleClearButton}>Clear</Button>
                </div>
            </div>

        </div>
    )
}