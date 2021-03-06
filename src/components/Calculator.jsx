import { Button, makeStyles} from '@material-ui/core';
import Slider from '@material-ui/core/Slider';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Calculator.css';
import { PaymentList } from './PaymentList';

const useStyles = makeStyles({
    sliderButton: {
        color: 'rgba(0, 0, 0, 0.87)',
        padding: 0,
        minWidth: 0,
        boxSizing: 'border-box',
        margin: 4,
        fontSize: 11,
        backgroundColor: 'rgba(21, 34, 66, 0.06)',
        borderRadius: 16,
        '&:focus': {
            backgroundColor: '#cecece'
        }
    },
    applyButton: {
        backgroundColor: '#0468FF',
        color: '#fff',
        height: 48,
        fontSize: 14,
        font: 'Lato, Roboto, Arial, sans-serif',
        fontWeight: 'bold',
        '&:hover': {
            backgroundColor: '#0248b2'
        }
    },
    switchCalculatorButton: {
        padding: '6px 8px',
        fontWeight: 400,
        color: '#0468FF',
        flexGrow: 1,
        fontSize: 14
    }
})
export const Calculator = () => {
    const styles = useStyles();
    const [estateValue, setEstateValue] = useState(500000);
    const [firstDepositValue, setFirstDepositValue] = useState(0);
    const [loanPeriodValue, setLoanPeriodValue] = useState(1);
    const [interestRateValue, setInterestRateValue] = useState(1);

    let monthlyRate = interestRateValue / 12 / 100;
    let loanPeriodMonths = (loanPeriodValue * 12);
    let totalBid = ((1 + monthlyRate) ** loanPeriodMonths);
    let monthlyPayment = ((estateValue - firstDepositValue) * monthlyRate * (totalBid / (totalBid - 1)));
    let percents = Math.round((monthlyPayment * loanPeriodMonths - (estateValue - firstDepositValue)));
    let minIncome = Math.round(((estateValue - firstDepositValue + percents) / 12) * 1.667);
    // const numberWithSpaces = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    if (firstDepositValue < 0) setFirstDepositValue(0);
    if (loanPeriodValue < 0) setLoanPeriodValue(0);
    if (interestRateValue < 0) setInterestRateValue(0);
    const isStartsWithZero = (event) => event.target.value = Number.parseInt(event.target.value.toString());
    const isValidEstateValue = (event) => {
        if (estateValue < 500000) setEstateValue(500000);
        isStartsWithZero(event);
    };
    const handleEstateSliderChange = (event, newEstateValue) => {
        firstDepositValue >= newEstateValue - 500000 ? setFirstDepositValue(newEstateValue - 500000) : setFirstDepositValue(firstDepositValue);
        setEstateValue(newEstateValue);
    };
    const handleEstateInputChange = (event) => {
        firstDepositValue >= +event.target.value - 500000
            ? setFirstDepositValue(+event.target.value - 500000)
            : setFirstDepositValue(firstDepositValue);
        +event.target.value >= 99999999 ? setEstateValue(99999999) : setEstateValue(+event.target.value);
    };
    const handleFirstDepositSliderChange = (event, newFirstDepositValue) => setFirstDepositValue(newFirstDepositValue);
    const handleFirstDepositInputChange = (event) => {
        +event.target.value > estateValue - 500000
            ? setFirstDepositValue(estateValue - 500000)
            : setFirstDepositValue(+event.target.value);
    };
    const firstDepositPercentCounter = (event) => setFirstDepositValue((estateValue >500000 ? estateValue * event.currentTarget.value : 0).toFixed())
    const handleLoanPeriorSliderChange = (event, newLoanPeriodValue) => setLoanPeriodValue(newLoanPeriodValue);
    const handleLoanPeriodInputChange = (event) => {
        +event.target.value > 30
            ? setLoanPeriodValue(30)
            : setLoanPeriodValue(+event.target.value)
    };
    const changeLoanPeriod = (event) => setLoanPeriodValue(+event.currentTarget.value);
    const handleInterestRateSliderChange = (event, newInterestRateValue) => setInterestRateValue(newInterestRateValue);
    const handleInterestRateInputChange = (event) => {
        +event.target.value > 30
            ? setInterestRateValue(30)
            : setInterestRateValue(+event.target.value)
    };
    const changeInterestRate = (event) => setInterestRateValue(+event.currentTarget.value);
    return (
        <>
            <div className='container'>
                <div className='leftPanel'>
                    <div className='switchCalculator'>
                        <Button className={styles.switchCalculatorButton}>????????????????????????</Button>
                        <Button className={styles.switchCalculatorButton}>????????????</Button>
                        <Button className={styles.switchCalculatorButton}>????????????</Button>
                    </div>
                    <div className='estateCost'>
                        <p>?????????????????? ????????????????????????</p>
                        <input className='estateInput'
                            type="number"
                            inputMode='numeric'
                            value={estateValue}
                            onChange={handleEstateInputChange}
                            onBlur={isValidEstateValue} />
                        <Slider
                            min={500000}
                            max={99999999}
                            step={280000}
                            defaultValue={500000}
                            onChange={handleEstateSliderChange}
                            value={estateValue} />
                    </div>
                    <div className='firstDeposit'>
                        <p>???????????????????????????? ??????????</p>
                        <input
                            className='firstDepositInput'
                            type="number"
                            inputMode='numeric'
                            value={firstDepositValue}
                            onChange={handleFirstDepositInputChange}
                            onBlur={isStartsWithZero} />
                        <Slider
                            min={0}
                            max={estateValue - 500000}
                            step={10000}
                            defaultValue={0}
                            onChange={handleFirstDepositSliderChange}
                            value={firstDepositValue <= estateValue - 500000 ? firstDepositValue : estateValue - 500000} />
                        <div className='firstDepositButtons'>
                            <Button className={styles.sliderButton} onClick={firstDepositPercentCounter} value={0}>0%</Button>
                            <Button className={styles.sliderButton} onClick={firstDepositPercentCounter} value={0.1}>10%</Button>
                            <Button className={styles.sliderButton} onClick={firstDepositPercentCounter} value={0.15}>15%</Button>
                            <Button className={styles.sliderButton} onClick={firstDepositPercentCounter} value={0.2}>20%</Button>
                            <Button className={styles.sliderButton} onClick={firstDepositPercentCounter} value={0.25}>25%</Button>
                            <Button className={styles.sliderButton} onClick={firstDepositPercentCounter} value={0.3}>30%</Button>
                        </div>
                    </div>
                    <div className='loanPeriod'>
                        <p>???????? ??????????????</p>
                        <input className='loanPeriodInput'
                            type="number"
                            inputMode='numeric'
                            onChange={handleLoanPeriodInputChange}
                            value={loanPeriodValue}
                            onBlur={isStartsWithZero} />
                        <Slider
                            min={1}
                            max={30}
                            step={1}
                            defaultValue={1}
                            onChange={handleLoanPeriorSliderChange}
                            value={loanPeriodValue} />
                        <div className='loanPeriodButtons'>
                            <Button className={styles.sliderButton} onClick={changeLoanPeriod} value={5}>5 ??????</Button>
                            <Button className={styles.sliderButton} onClick={changeLoanPeriod} value={10}>10 ??????</Button>
                            <Button className={styles.sliderButton} onClick={changeLoanPeriod} value={15}>15 ??????</Button>
                            <Button className={styles.sliderButton} onClick={changeLoanPeriod} value={20}>20 ??????</Button>
                        </div>
                    </div>
                    <div className='interestRate'>
                        <p>???????????????????? ????????????</p>
                        <input className='interestRateInput'
                            type="number"
                            inputMode='numeric'
                            value={interestRateValue}
                            onChange={handleInterestRateInputChange}
                            onBlur={isStartsWithZero} />
                        <Slider
                            min={1}
                            max={30}
                            step={0.1}
                            defaultValue={1}
                            onChange={handleInterestRateSliderChange}
                            value={interestRateValue} />
                        <div className='loanPeriodButtons'>
                            <Button className={styles.sliderButton} onClick={changeInterestRate} value={4.5}>4,5%</Button>
                            <Button className={styles.sliderButton} onClick={changeInterestRate} value={6}>6%</Button>
                            <Button className={styles.sliderButton} onClick={changeInterestRate} value={7.5}>7,5%</Button>
                            <Button className={styles.sliderButton} onClick={changeInterestRate} value={9.1}>9,1%</Button>
                            <Button className={styles.sliderButton} onClick={changeInterestRate} value={10}>10%</Button>
                        </div>
                    </div>
                </div>
                <div className='rightPanel'>
                    <p>?????? ?????????????????????? ????????????</p>
                    <div className='monthlyPaymentCounter'>
                        <h1>{loanPeriodValue > 0 && interestRateValue > 0 ? Number(monthlyPayment.toFixed()).toLocaleString() : '41 893'} ???</h1>
                    </div>
                    <div className='rightPanelElement'>
                        <p>????????????</p>
                        <div >
                            <p>{loanPeriodValue > 0 && interestRateValue > 0   ? (estateValue - firstDepositValue).toLocaleString() : '500 000'} ???</p>
                        </div>
                    </div>
                    <div className='rightPanelElement'>
                        <p>????????????????</p>
                        <div >
                            <p>{loanPeriodValue > 0 && interestRateValue > 0  ? Number(percents).toLocaleString() : '2 712'} ???</p>
                        </div>
                    </div>
                    <div className='rightPanelElement'>
                        <p>????????????????+????????????</p>
                        <div >
                            <p>{loanPeriodValue > 0 && interestRateValue > 0  ? (estateValue - firstDepositValue + percents).toLocaleString() : '502 712'} ???</p>
                        </div>
                    </div>
                    <div className='rightPanelElement'>
                        <p>?????????????????????? ??????????</p>
                        <div >
                            <p>{loanPeriodValue > 0 && interestRateValue > 0  ? Number(minIncome).toLocaleString() : '69 835'} ???</p>
                        </div>
                    </div>
                    <Button href='http://www.yandex.ru' target='_blank' variant='contained' className={styles.applyButton}>
                        ???????????? ???????????? ????????????
                    </Button>
                    <br />
                    <Link to='/date' >
                        <Button variant='contained' className={styles.applyButton}>Go back</Button>
                    </Link>
                </div>
            </div>
            <PaymentList monthlyPayment={monthlyPayment}
                         loanPeriodValue={loanPeriodValue}
                         estateValue={estateValue}
                         interestRateValue={interestRateValue}
                         loanPeriodMonths={loanPeriodMonths}
                         firstDepositValue={firstDepositValue} />
        </>
    );
}

