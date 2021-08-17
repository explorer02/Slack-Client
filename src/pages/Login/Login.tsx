import React, { FormEvent, useCallback, useState } from "react";

import { AiOutlineMail } from "react-icons/ai";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoLanguageSharp } from "react-icons/io5";

import "./login.css";
import { ajaxClient } from "ajaxClient";
import { useMutation } from "hooks/useMutation";
import { Button } from "components/Button/Button";
import { delayTask } from "utils";
import { useInput } from "hooks/useInput";
import { VALIDATION_UNKNOWN_ERROR } from "constant";
import { Input } from "components/Input/Input";

type LoginProps = {
  onAuthComplete: (id: string) => void;
};

const LOGIN_MODE = "login";
const SIGNUP_MODE = "signup";

const options = {
  [SIGNUP_MODE]: {
    title: "Sign Up",
    url: "/users",
    submitButton: "Sign up",
    switchButton: "Already have an account? Login",
    loadingMessage: "Creating new account...",
    successMessage: "Your account is created...",
  },
  [LOGIN_MODE]: {
    title: "Login",
    url: "/auth/login",
    submitButton: "Log in",
    switchButton: "Create New Account",
    loadingMessage: "Validating credentials...",
    successMessage: "Login validated...",
  },
};

export const Login = (props: LoginProps): JSX.Element => {
  const [id, handleIDChange] = useInput("");
  const [password, handlePasswordChange] = useInput("");
  const [name, handleNameChange] = useInput("");
  const [mode, setMode] = useState<typeof LOGIN_MODE | typeof SIGNUP_MODE>(
    LOGIN_MODE
  );

  const switchMode = (): void =>
    setMode((m) => (m === LOGIN_MODE ? SIGNUP_MODE : LOGIN_MODE));

  const validateAuth = useCallback(
    (id, password, name) => {
      let data = {};
      data = { id, password };
      if (mode === SIGNUP_MODE) data = { user: { id, password, name } };
      return ajaxClient.post(options[mode].url, data);
    },
    [mode]
  );

  const { onAuthComplete } = props;
  const successHandler = useCallback(() => {
    delayTask(() => onAuthComplete(id), 0.3);
  }, [onAuthComplete, id]);

  const mutation = useMutation<boolean>(validateAuth, {
    onSuccess: successHandler,
  });

  let status = "";
  if (mutation.status === "loading") status = options[mode].loadingMessage;
  else if (mutation.status === "error") {
    status = mutation.error?.message || VALIDATION_UNKNOWN_ERROR;
  } else if (mutation.status === "success")
    status = options[mode].successMessage;

  const handleLogin = (ev: FormEvent): void => {
    ev.preventDefault();
    mutation.mutate(id, password, name);
  };

  return (
    <div className="login-container">
      <div className="login-title">{options[mode].title}</div>
      <form className="login-form" onSubmit={handleLogin}>
        <Input
          type="text"
          placeholder="user id"
          Icon={<AiOutlineMail />}
          value={id}
          onChange={handleIDChange}
          minLength={3}
        />
        <Input
          type="password"
          placeholder="password"
          Icon={<RiLockPasswordFill />}
          value={password}
          onChange={handlePasswordChange}
          minLength={3}
        />
        {mode === SIGNUP_MODE && (
          <Input
            type="text"
            placeholder="your name..."
            Icon={<IoLanguageSharp />}
            value={name}
            onChange={handleNameChange}
            minLength={3}
          />
        )}
        <Button text={options[mode].submitButton} type="submit" />
        <p className="login-status">{status}</p>
        <Button
          text={options[mode].switchButton}
          type="button"
          onClick={switchMode}
        />
      </form>
    </div>
  );
};
