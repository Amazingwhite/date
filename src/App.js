import React, { useState } from "react";
import { useForm } from "react-hook-form";
import UserInfo from "./components/UserInfo";
import { ErrorMessage } from "@hookform/error-message";
import { getMinutes, getHours, getDate, getMonth, getYear, yearsToMonths, isAfter, isEqual, set, differenceInMonths, differenceInDays, differenceInYears, getDaysInYear, getDaysInMonth, monthsToYears, addYears, differenceInMinutes, } from 'date-fns'
import ru from "date-fns/locale/ru"
import './App.css'

export default function App() {
  let [isSubmited, setIsSubmited] = useState(false);
  let [age, setAge] = useState(0);
  let [untilEvent, setUntilEvent] = useState([]);
  let [beforeAfter, setBeforeAfter] = useState(true)
  const { register, formState: { errors }, handleSubmit, reset } = useForm({ criteriaMode: "all" });

  const diffDates = (d1, d2) => Math.floor((d1 - d2) / (365.25 * 24 * 60 * 60 * 1000));
  const countYears = (d1, d2) => (yearsToMonths(getYear(d1)) + (getMonth(d1) + 1) - (yearsToMonths(getYear(d2)) + (getMonth(d2) + 1))) / 12

  const timeCounter = (date1, date2) => {
    let testDate1 = new Date(date1)
    let testDate2 = new Date(date2)

    let diffMinutes = getMinutes(testDate2) - getMinutes(testDate1)
    let diffHours = getHours(testDate2) - getHours(testDate1)
    let diffDays = differenceInMinutes(testDate2, testDate1)/60/24 
    // console.log(diffDays);
    let diffYears = differenceInYears(testDate2, testDate1)                       
    let diffMonths = differenceInMonths(testDate2, testDate1) - diffYears*12      

    
    const daysInYearsCounter = (date1, date2) => {
      let date1Year = getYear(date1)
      // let date2Year = getYear(date2) 
      let yearsTotal = differenceInDays(date2, date1)
      // console.log(yearsTotal);
      let fullYearsList = 0

      for(let i = date1Year; yearsTotal >= getDaysInYear(new Date(date2)); i++) {
        yearsTotal -= getDaysInYear(new Date(i, 0, 1))
        fullYearsList += getDaysInYear(new Date(i, 0, 1))
      }
      // console.log(fullYearsList);
      return fullYearsList
    }

    const daysInMonthCounter = (date1, date2) => {
      let date1Month = getMonth(date1)
      let date2Month = getMonth(date2)
      let date1Year = getYear(date1)
      let date2Year = getYear(date2)
      let fullMonthsList = 0;
      let incompleteYear = 0

      for( let i = date1Year; i <= date2Year; i++) if(getDaysInYear(i) > differenceInDays(date2, new Date(i, 0, 1))) incompleteYear = i
    
      if(getMonth(date1) > getMonth(date2)) {
        // console.log(incompleteYear);
        console.log(1)
        for(let i = getMonth(date1) +1; i<=11; i++) {
          fullMonthsList += getDaysInMonth(new Date(incompleteYear-1, i, 1))
        }

        for(let i = 0; i<=getMonth(date2); i++) {
          fullMonthsList += getDaysInMonth(new Date(incompleteYear, i, 1))
        }
      }

      if(getMonth(date1) <= getMonth(date2)) {
        console.log(incompleteYear);

        for(let i = getMonth(date1); i<getMonth(date2); i++ ) {
          fullMonthsList += getDaysInMonth(new Date(incompleteYear, i, 1))
        }
        for(let i = 0; i<getMonth(date2); i++ ) {
          fullMonthsList += getDaysInMonth(new Date(getYear(date2), i, 1))
        }
      }
      console.log(fullMonthsList);
      return fullMonthsList
    }

    daysInMonthCounter(testDate1, testDate2)

    diffDays -= daysInYearsCounter(testDate1, testDate2)
    diffDays -= daysInMonthCounter(testDate1, testDate2)



    

    if(diffMinutes < 0) {
      diffHours--
      diffMinutes += 60
    }

    if(diffHours < 0) {
      diffDays--
      diffHours +=24
    }

    if(diffDays<0) {
      diffMonths--
      diffDays = getDaysInMonth(new Date(getYear(date2), getMonth(date2))) + diffDays
    }

    if(diffMonths<0) {
      diffYears--
      diffMonths = 12 + diffMonths
    }
    
    let countedDiff = [diffYears, diffMonths, Math.floor(diffDays), diffHours, diffMinutes]
    console.log(countedDiff)
    setUntilEvent(countedDiff)
  }

  const onSubmit = (data) => {
    let userAge = diffDates(new Date(data.currentDate), new Date(data.birthDate))
    let currentDate = set(new Date(data.currentDate), {hours: getHours(new Date()), minutes:  getMinutes(new Date())})
    let valuableEvent = new Date(data.valuableEvent)
    timeCounter(currentDate, valuableEvent)
    if (userAge > 0 && userAge < 130) {
      setAge(userAge)
      setIsSubmited(true)
    } 
  }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor='birthDate'>Birth date</label>
        <input type='date' {...register("birthDate", {
          maxLength: {
            value: 10,
            message: 'Max year is 9999'
          },
          required: "This input is required."
        })} />
        <ErrorMessage
          errors={errors}
          name="birthDate"
          render={({ messages }) => {
            return messages
              ? Object.entries(messages).map(([type, message]) => (
                <p key={type}>{message}</p>
              ))
              : null;
          }}
        />
        <label htmlFor='currentDate'>Current date</label>
        <input type='date' {...register("currentDate", {
          maxLength: {
            value: 10,
            message: 'Max year is 9999'
          },
          required: "This input is required."
        })} />
        <ErrorMessage
          errors={errors}
          name="currentDate"
          render={({ messages }) => {
            return messages
              ? Object.entries(messages).map(([type, message]) => (
                <p key={type}>{message}</p>
              ))
              : null;
          }}
        />
        <label htmlFor='valuableEvent'>Event</label>
        <input type='datetime-local' {...register("valuableEvent", {
          maxLength: {
            value: 16,
            message: 'Max year is 9999'
          },
          required: "This input is required."
        })} />
        <ErrorMessage
          errors={errors}
          name="valuableEvent"
          render={({ messages }) => {
            return messages
              ? Object.entries(messages).map(([type, message]) => (
                <p key={type}>{message}</p>
              ))
              : null;
          }}
        />
        <input type="submit" />
        <input
        type="button"
        onClick={() =>
          reset({
            birthDate: "",
            currentDate: "",
            valuableEvent: "",
          })
        }
        value="Reset inputs"
      />
      
      </form>
      {isSubmited && <UserInfo age={age} untilEvent={untilEvent} beforeAfter={beforeAfter} />}
    </>
  );
}