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
    console.log(diffDays)
    let diffYears = differenceInYears(testDate2, testDate1)                       
    let diffMonths = differenceInMonths(testDate2, testDate1) - diffYears*12      

    const daysInMonthCounter = (date1, date2) => {
      let date1Month = getMonth(date1)
      let date2Month = getMonth(date2)
      let date1Year = getYear(date1)
      let date2Year = getYear(date2)
      let fullMonthsList = 0

      for(let i = date1Year; i < date2Year; i++) {
        if(i === date1Year){
          for(let j = date1Month+1; j<=11; j++) {
            fullMonthsList += getDaysInMonth(new Date(i, j, 1))
          }
        } else if (i === date2Year) {
          for(let j = 0; j<date2Month; j++) {
            fullMonthsList += getDaysInMonth(new Date(i, j, 1))
          }
        } else {
          for(let j = 0; j<=11; j++) {
            fullMonthsList += getDaysInMonth(new Date(i, j, 1))
          }
        }
      }
      console.log(fullMonthsList);
      return fullMonthsList;
    }
    diffDays -= daysInMonthCounter(testDate1, testDate2)
    if(diffHours < 0) {
      diffDays--
      diffHours +=24
    }
    if(diffMinutes < 0) {
      diffHours--
      diffMinutes += 60
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