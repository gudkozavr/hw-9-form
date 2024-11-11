import { useState } from "react";
import { set, useForm } from "react-hook-form";
import styles from "./styles.module.css";

export default function DynamicForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [finishSubmitted, setFinishSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm();

  function onSubmit(data) {
    const firstElement = data.firstElement ? data.firstElement.trim() : "";
    const nextElement = data.nextElement ? data.nextElement.trim() : "";
    if (firstElement === "" || firstElement.length < 5) {
      setErrorMessage(
        "поле не должно состоять из пробелов и должно быть больше 5 символов"
      );
      return;
    }

    if (data.nextElement !== undefined) {
      if (nextElement === "" || nextElement.length < 5) {
        setErrorMessage(
          "Поле не должно состоять из пробелов и должно быть не менее 5 символов"
        );
        setIsSuccess(false);

        return;
      }
    }

    setErrorMessage("");
    setIsSubmitted(true);
    setFinishSubmitted(false);
    setIsSuccess(true);
    setValue("firstElement", "");
    setValue("nextElement", "");
  }
  function handleChangeValueFirstInput(e) {
    const value = e.target.value.trim();

    setValue("firstElement", value);
    if (e.target.value.trim() && e.target.value.length >= 5) {
      setIsSubmitted(true);
      setErrorMessage("");
    } else {
      setIsSubmitted(false);
      setFinishSubmitted(false);
      setErrorMessage("");
      setIsSuccess(false);
    }
  }
  function handleChangeNextValueInput(e) {
    const value = e.target.value.trim();

    setValue("nextElement", value);

    if (e.target.value.trim() && e.target.value.length >= 5) {
      setFinishSubmitted(true);
      setErrorMessage(false);
    } else {
      setFinishSubmitted(false);
    }
    if (!value || value.length < 5) {
      setIsSuccess(false);
    }
  }

  function handleBlurFirstInput() {
    const firstElement = watch("firstElement");
    if (firstElement.length < 5) {
      setValue("nextElement", "");
    }
  }
  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <label>
          Первый элемент:
          <input
            {...register("firstElement", {
              required:
                "Поле обязательно для заполнения. Вводите не менее 5 символов",

              onChange: handleChangeValueFirstInput,
              onBlur: handleBlurFirstInput,
            })}
          />
        </label>
        {isSubmitted && (
          <label>
            Следующий элемент:
            <input
              {...register("nextElement", {
                onChange: handleChangeNextValueInput,
              })}
            />
          </label>
        )}
        {errors.firstElement && <p>{errors.firstElement.message}</p>}
        <button type="submit">Go go go</button>
        {isSubmitted && !finishSubmitted && !isSuccess && (
          <p>Мы на финишной прямой! Продолжай заполнять форму!</p>
        )}
        {finishSubmitted && <p>Молодец! Отправь форму :) </p>}
        {errorMessage && <p>{errorMessage}</p>}
        {isSuccess && <p>Ты справился! Форма отправлена!</p>}
      </form>
    </div>
  );
}
