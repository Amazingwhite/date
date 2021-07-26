import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { UserInfo } from "./components/UserInfo";
import { ErrorMessage } from "@hookform/error-message";
import moment from 'moment';
import './App.css'

export default function App() {
  let allDiffs = []
  let [isSubmited, setIsSubmited] = useState(false);
  let [age, setAge] = useState(0);
  let [untilEvent, setUntilEvent] = useState([]);
  let [beforeAfter, setBeforeAfter] = useState(true)
  let [eventName, setEventName] = useState('')
  const { register, control, formState: { errors }, handleSubmit, reset } = useForm({
    criteriaMode: "all",
    defaultValues: {
      events: [{ eventName: "some name", eventDate: new Date(), eventTime: 0 }]
    }
  });
  const diffDates = (d1, d2) => Math.floor((d1 - d2) / (365.25 * 24 * 60 * 60 * 1000));
  const { fields, append } = useFieldArray({
    control,
    name: "events"
  });


  const timeCounter = (date1, date2) => {
    let firstDate = moment(date1)
    let secondDate = moment(date2)
    if (firstDate > secondDate) {
      let diffDate = moment().set({
        year: firstDate.get('year') - secondDate.get('year'),
        month: firstDate.get('month') - secondDate.get('month'),
        date: firstDate.get('date') - secondDate.get('date'),
        hour: firstDate.get('hour') - secondDate.get('hour'),
        minute: firstDate.get('minute') - secondDate.get('minute')
      })
      allDiffs.push(diffDate)
      firstDate.diff(secondDate, 'minute') < 1440
        ? setUntilEvent({ hours: diffDate.get('hour'), minutes: diffDate.get('minute') })
        : setUntilEvent({ years: diffDate.get('year'), months: diffDate.get('month'), days: diffDate.get('date'), hours: diffDate.get('hour'), minutes: diffDate.get('minute') })
      setBeforeAfter(false)
    } else {
      let diffDate = moment().set({
        year: secondDate.get('year') - firstDate.get('year'),
        month: secondDate.get('month') - firstDate.get('month'),
        date: secondDate.get('date') - firstDate.get('date'),
        hour: secondDate.get('hour') - firstDate.get('hour'),
        minute: secondDate.get('minute') - firstDate.get('minute'),
      })
      allDiffs.push(diffDate)
      secondDate.diff(firstDate, 'minute') < 1440
        ? setUntilEvent({ hours: diffDate.get('hour'), minutes: diffDate.get('minute') })
        : setUntilEvent({ years: diffDate.get('year'), months: diffDate.get('month'), days: diffDate.get('date'), hours: diffDate.get('hour'), minutes: diffDate.get('minute') })
      setBeforeAfter(true)
    }
  }


  const onSubmit = (data) => {
    let currentDate = moment(data.currentDate).set({ hour: moment().get('hour'), minute: moment().get('minute') })
    data.events.forEach((i) => {
      let valuableEvent = moment().set({
        year: moment(i.eventDate).get('year'),
        month: moment(i.eventDate).get('month'),
        date: moment(i.eventDate).get('date'),
        hour: i.eventTime.split(":")[0],
        minute: i.eventTime.split(":")[1]
      })
      // console.log(`Current date: ${currentDate}`);
      // console.log(`Event date: ${valuableEvent}`);
      timeCounter(currentDate, valuableEvent)
      // console.log(allDiffs);
      setEventName(i.eventName)
    })
    setAge(diffDates(new Date(data.currentDate), new Date(data.birthDate)))
    setIsSubmited(true)
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
              )) : null;
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
              )) : null;
          }}
        />
        <label htmlFor='valuableEvent'>Events</label>

        {fields.map((item, index) => {
          return (
            <li className='valuableEvent' key={item.id}>
              <input
                {...register(`events.${index}.eventName`)}
                type='text'
                name={`events[${index}].eventName`}
                defaultValue={`${item.eventName}`}
              />
              <input
                {...register(`events.${index}.eventDate`)}
                type='date'
                name={`events[${index}].eventDate`}
                defaultValue={`${item.eventDate}`}
              />
              <input
                {...register(`events.${index}.eventTime`)}
                type='time'
                name={`events[${index}].eventTime`}
                defaultValue={`${item.eventTime}`}
              />
              
            </li>
          );
        })}

        <button
          type="button"
          onClick={() => {
            append({ eventName: "appendEventName", eventDate: "appendEventDate", eventTime: "appendEventTime" });
          }}
        >
          Add Event
        </button>
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
      {isSubmited && <UserInfo age={age} untilEvent={untilEvent} beforeAfter={beforeAfter} eventName={eventName} />}
    </>
  );
}