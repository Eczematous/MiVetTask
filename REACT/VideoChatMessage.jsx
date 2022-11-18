import React, { useCallback, useState } from "react";
import {
  useAppMessage,
  useLocalParticipant,
} from "@daily-co/daily-react-hooks";
import { Arrow } from "./videoTrayIcons";
import PropTypes from "prop-types";

function VideoChatMessage({ showChat, toggleChat }) {
  const localParticipant = useLocalParticipant();
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState("");

  const sendAppMessage = useAppMessage({
    onAppMessage: useCallback(
      (evnt) =>
        setMessages((messages) => [
          ...messages,
          { msg: evnt.data.msg, name: evnt.data.name },
        ]),
      []
    ),
  });

  const sendMessage = useCallback(
    (message) => {
      sendAppMessage(
        {
          msg: message,
          name: localParticipant?.user_name || "Guest",
        },
        "*"
      );

      setMessages([
        ...messages,
        {
          msg: message,
          name: localParticipant?.user_name || "Guest",
        },
      ]);
    },
    [localParticipant, messages, sendAppMessage]
  );

  const onChange = (evnt) => {
    setValue(evnt.target.value);
  };

  const onSubmit = (evnt) => {
    evnt.preventDefault();
    if (!value) return;

    sendMessage(value);
    setValue("");
  };

  return showChat ? (
    <aside className="chat">
      <button
        className="button-main button-template close-chat"
        type="button"
        onClick={toggleChat}
      >
        Close Chat
      </button>
      <ul className="chat-messages">
        {messages?.map((message, index) => (
          <li key={`message-${index}}`} className="chat-message">
            <span className="chat-message-author">{message?.name}</span>:{" "}
            <p className="p-centering chat-message-body">{message?.msg}</p>
          </li>
        ))}
      </ul>
      <div className="add-message">
        <form className="chat-form" onSubmit={onSubmit}>
          <input
            className="chat-input"
            type="text"
            placeholder="Type a message here"
            value={value}
            onChange={(evnt) => onChange(evnt)}
          />
          <button
            type="submit"
            className="button-main button-template chat-submit-button"
          >
            <Arrow />
          </button>
        </form>
      </div>
    </aside>
  ) : null;
}
export default VideoChatMessage;

VideoChatMessage.propTypes = {
  showChat: PropTypes.element,
  toggleChat: PropTypes.func,
};
