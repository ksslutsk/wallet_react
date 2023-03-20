import { FunctionComponent, RefObject, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { pennyToGrn } from "../../../../shared/libs";
import styles from './Summary.module.scss';

export interface TotalByMoth {
    //sum?: number,
    total: number,
    group_month?: string
}

interface SummaryProps {
    totals: TotalByMoth[],
    domNode: HTMLElement
}

const getMonthName = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'long' });

    return month;
}

export const Summary: FunctionComponent<SummaryProps> = ({ totals, domNode }) => ReactDOM.createPortal(
    <>
        <div className={styles['summary']}>
            <div className={styles['summary__header']}>
                SUMMARY
            </div>
            {
                totals.map((t: TotalByMoth, index: number) => (
                    <div className={styles['summary__row']} key={index}>
                        <span>{t.group_month && getMonthName(t.group_month)}</span>
                        <span>{pennyToGrn(t.total)?.toFixed(2)}</span>
                    </div>
                ))
            }

        </div>
        <div className={styles['bottom-indent']}></div>
    </>,
    domNode
)

interface SummaryWrapperProps {
    totals: TotalByMoth[],
    tabletContainerRef: RefObject<HTMLElement>,
    desktopContainerRef: RefObject<HTMLElement>
}

export const SummaryWrapper: FunctionComponent<SummaryWrapperProps> = ({ totals, tabletContainerRef, desktopContainerRef }) => {

    const [width, setWidth] = useState(window.innerWidth);

    const [domReady, setDomReady] = useState(false);

    const minDesktop = 1280;

    const minTablet = 768;

    useEffect(() => {
        const handleWindowResize = () => setWidth(window.innerWidth)
        window.addEventListener('resize', handleWindowResize);

        setDomReady(true);

        return () => window.removeEventListener("resize", handleWindowResize);
    }, []);

    return (domReady && width > minTablet) ?
        <Summary totals={totals}
            domNode={(width < minDesktop) ? tabletContainerRef.current! : desktopContainerRef.current!}
        ></Summary> : null;
}