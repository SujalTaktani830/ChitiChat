import {
  EmailOutlined,
  LockOutlined,
  PersonOutline,
} from "@mui/icons-material";
import Link from "next/link";
import React from "react";

const Form = ({ type }) => {
  return (
    <div className="auth">
      <div className="content">
        <form className="form">
          {type == "register" && (
            <div className="input">
              <input
                type="text"
                placeholder="Username"
                className="input-field"
              />
              <PersonOutline />
            </div>
          )}
          <div className="input">
            <input
              type="email"
              placeholder="Email ID"
              className="input-field"
            />
            <EmailOutlined />
          </div>

          <div className="input">
            <input
              type="password"
              placeholder="Password"
              className="input-field"
            />
            <LockOutlined />
          </div>

          <button className="button" type="submit">
            {type === "register" ? "For Free" : "Let's ChitChat"}
          </button>
        </form>

        {type === "register" ? (
          <Link href="/" className="link">
            <p className="text-center">
              Already have an account? Sign In here.
            </p>
          </Link>
        ) : (
          <Link href="/register">
            <p className="text-center">Don't have an account? Register Here.</p>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Form;
