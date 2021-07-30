import { Button, makeStyles, Tab, Tabs } from '@material-ui/core';
import Slider from '@material-ui/core/Slider';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Calculator.css';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment';


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
    },
    tableContainer: {
        width: 970,
        margin: 'auto'
    }
})

export const Calculator = () => {
    const styles = useStyles()
    const [estateValue, setEstateValue] = useState(500000);
    const [firstDepositValue, setFirstDepositValue] = useState(0);
    const [loanPeriodValue, setLoanPeriodValue] = useState(1);
    const [interestRateValue, setInterestRateValue] = useState(1);
    const [tableValue, setTableValue] = useState(null)

    let monthlyRate = interestRateValue / 12 / 100;
    let loanPeriodMonths = (loanPeriodValue * 12);
    let totalBid = ((1 + monthlyRate) ** loanPeriodMonths);
    let monthlyPayment = ((estateValue - firstDepositValue) * monthlyRate * (totalBid / (totalBid - 1)));
    let percents = Math.round((monthlyPayment * loanPeriodMonths - (estateValue - firstDepositValue)));
    let minIncome = Math.round(((estateValue - firstDepositValue + percents) / 12) * 1.667);
    const numberWithSpaces = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    const columns = [
        { id: 'index', label: '№' },
        { id: 'paymentDate', label: 'Дата платежа'},
        { id: 'debt', label: 'Задолженность'},
        { id: 'percents',label: 'Погашение процентов'},
        { id: 'netDebt',label: 'Погашение основного долга'},
        { id: 'paymentAmount',label: 'Сумма платежа'}
    ];
    function createData(index, paymentDate, debt, percents, netDebt, paymentAmount) {
        return { index, paymentDate, debt, percents, netDebt, paymentAmount };
    }
    const rows = [];
    let totalPrice = estateValue
    if(loanPeriodValue > 0 && interestRateValue > 0 ){
        for(let i =1; i<=loanPeriodMonths; i++) {
            let monthlyDebtMinus = (monthlyPayment - (totalPrice * interestRateValue/100/12))
            let monthlyPercentMinus = (totalPrice * interestRateValue/100/12)
            rows.push(createData(
                i, 
                `${moment().set('date', 1).add('month', i).format("DD.MM.YYYY")}`, 
                `${numberWithSpaces(totalPrice.toFixed() - monthlyDebtMinus.toFixed())} ₽`, 
                `${numberWithSpaces(monthlyPercentMinus.toFixed())} ₽`, 
                `${numberWithSpaces(monthlyDebtMinus.toFixed())} ₽`,
                `${numberWithSpaces(monthlyPayment.toFixed())} ₽`))
            totalPrice -= monthlyDebtMinus
        }
    }

    const tableClickHandler = (e, val) => tableValue === 0 ? setTableValue(null) : setTableValue(val)
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
    const firstDepositPercentCounter = (event) => setFirstDepositValue((estateValue - 500000) * event.currentTarget.value)
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
                        <Button className={styles.switchCalculatorButton}>Недвижимость</Button>
                        <Button className={styles.switchCalculatorButton}>Кредит</Button>
                        <Button className={styles.switchCalculatorButton}>Платеж</Button>
                    </div>
                    <div className='estateCost'>
                        <p>Стоимость недвижимости</p>
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
                        <p>Первоначальный взнос</p>
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
                        <p>Срок кредита</p>
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
                            <Button className={styles.sliderButton} onClick={changeLoanPeriod} value={5}>5 лет</Button>
                            <Button className={styles.sliderButton} onClick={changeLoanPeriod} value={10}>10 лет</Button>
                            <Button className={styles.sliderButton} onClick={changeLoanPeriod} value={15}>15 лет</Button>
                            <Button className={styles.sliderButton} onClick={changeLoanPeriod} value={20}>20 лет</Button>
                        </div>
                    </div>
                    <div className='interestRate'>
                        <p>Процентная ставка</p>
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
                    <p>Ваш ежемесячный платеж</p>
                    <div className='monthlyPaymentCounter'>
                        <h1>{loanPeriodValue > 0 && interestRateValue > 0 ? numberWithSpaces(monthlyPayment.toFixed()) : '41 893'} ₽</h1>
                    </div>
                    <div className='rightPanelElement'>
                        <p>Кредит</p>
                        <div >
                            <p>{loanPeriodValue > 0 && interestRateValue > 0   ? numberWithSpaces(estateValue - firstDepositValue) : '500 000'} ₽</p>
                        </div>
                    </div>
                    <div className='rightPanelElement'>
                        <p>Проценты</p>
                        <div >
                            <p>{loanPeriodValue > 0 && interestRateValue > 0  ? numberWithSpaces(percents) : '2 712'} ₽</p>
                        </div>
                    </div>
                    <div className='rightPanelElement'>
                        <p>Проценты+кредит</p>
                        <div >
                            <p>{loanPeriodValue > 0 && interestRateValue > 0  ? numberWithSpaces(estateValue - firstDepositValue + percents) : '502 712'} ₽</p>
                        </div>
                    </div>
                    <div className='rightPanelElement'>
                        <p>Необходимый доход</p>
                        <div >
                            <p>{loanPeriodValue > 0 && interestRateValue > 0  ? numberWithSpaces(minIncome) : '69 835'} ₽</p>
                        </div>
                    </div>
                    <Button href='http://www.yandex.ru' target='_blank' variant='contained' className={styles.applyButton}>
                        Подать заявку онлайн
                    </Button>
                    <br />
                    <Link to='/date' >
                        <Button variant='contained' className={styles.applyButton}>Go back</Button>
                    </Link>
                </div>
            </div>
            <Tabs value={tableValue} onChange={tableClickHandler}>
                <Tab label='График платежей'></Tab>
            </Tabs>
            <TabPanel value={tableValue} index={0}>
                <Paper>
                    <TableContainer className={styles.tableContainer}>
                        <Table stickyHeader aria-label="sticky table" >
                            <TableHead >
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {column.format && typeof value === 'number' ? column.format(value) : value}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </TabPanel>
        </>
    );
}

let TabPanel = (props) => {
    const {children, value, index} = props;
    return(
        <div>
            {
                value===index && (
                    <>{children} </>
                )
            }
        </div>
    )
}