import {React, useState} from 'react';
import moment from 'moment';
import { makeStyles, Tab, Tabs  } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles({
    tableContainer: {
        width: 970,
        margin: 'auto'
    }
})
export let PaymentList = ({ monthlyPayment, loanPeriodValue, estateValue, interestRateValue, loanPeriodMonths, firstDepositValue, ...props}) => {
    const [tableValue, setTableValue] = useState(null)
    const tableClickHandler = (e, val) => tableValue === 0 ? setTableValue(null) : setTableValue(val)
    const styles = useStyles()
    const columns = [
        { id: 'index', label: '№' },
        { id: 'paymentDate', label: 'Дата платежа'},
        { id: 'debt', label: 'Задолженность'},
        { id: 'percents',label: 'Погашение процентов'},
        { id: 'netDebt',label: 'Погашение основного долга'},
        { id: 'paymentAmount',label: 'Сумма платежа'}
    ];
    const rows = [];
    let totalPrice = estateValue - firstDepositValue
    if(loanPeriodValue > 0 && interestRateValue > 0 ){
        for(let i =1; i<=loanPeriodMonths; i++) {
            let monthlyPercentMinus = (totalPrice * interestRateValue/100/12)
            let monthlyDebtMinus = (monthlyPayment - monthlyPercentMinus)
            rows.push({
                index: i, 
                paymentDate: `${moment().set('date', 1).add('month', i).format("DD.MM.YYYY")}`, 
                debt: `${(totalPrice.toFixed() - monthlyDebtMinus.toFixed()).toLocaleString()} ₽`, 
                percents: `${Number(monthlyPercentMinus.toFixed()).toLocaleString()} ₽`, 
                netDebt: `${Number(monthlyDebtMinus.toFixed()).toLocaleString()} ₽`,
                paymentAmount: `${Number(monthlyPayment.toFixed()).toLocaleString()} ₽`})
            totalPrice -= monthlyDebtMinus
        }
    }
    return(
        <>
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
    )
}
let TabPanel = ({children, value, index}) => {
    return(
        <div>
            {value===index && (
                    <>{children} </>
                )}
        </div>
    )
}