import { useCallback, useState } from 'react';
import { useAppMessage, useLocalSessionId, useParticipantProperty } from '@daily-co/daily-react';

import { Arrow } from '../Tray/Icons/index';
import './Chat.css';

export default function Chat({ showChat, toggleChat }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const localSessionId = useLocalSessionId();
  const username = useParticipantProperty(localSessionId, 'user_name');

  const sendAppMessage = useAppMessage({
    // "app-message"イベントが発生すると、onAppMessageフック内のコールバックが実行される
    onAppMessage: useCallback(
      (ev) =>
        setMessages((existingMessages) => [
          ...existingMessages,
          {
            msg: ev.data.msg,
            name: ev.data.name,
          },
        ]),
      [],
    ),
  });

  // 他の参加者へのブロードキャストを呼び出し、送信者のみに対して直接呼び出す
  const sendMessage = useCallback(
    (message) => {
      /* Send the message to all participants in the chat - this does not include ourselves!
       * See https://docs.daily.co/reference/daily-js/events/participant-events#app-message
       */
      sendAppMessage(
        {
          msg: message,
          name: username || 'Guest',
        },
        // 送信先のオブジェクトの 2 番目のエントリはsendAppMessage()文字列 です’*’。これは、会議のすべての参加者にメッセージをブロードキャストすること
        // メッセージの送信者に配信されない
        '*',
      );

      /* Since we don't receive our own messages, we will set our message in the messages array.
       * This way _we_ can also see what we wrote.
      // 既存のmessageを呼び出して手動で追加
       */
      setMessages([
        ...messages,
        {
          msg: message,
          name: username || 'Guest',
        },
      ]);
    },
    [messages, sendAppMessage, username],
  );

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return; // don't allow people to submit empty strings
    sendMessage(inputValue);
    setInputValue('');
  };

  return showChat ? (
    <aside className="chat">
      <button onClick={toggleChat} className="close-chat" type="button">
        Close chat
      </button>
      <ul className="chat-messages">
        {messages.map((message, index) => (
          <li key={`message-${index}`} className="chat-message">
            <span className="chat-message-author">{message?.name}</span>:{' '}
            <p className="chat-message-body">{message?.msg}</p>
          </li>
        ))}
      </ul>
      <div className="add-message">
        <form className="chat-form" onSubmit={handleSubmit}>
          <input
            className="chat-input"
            type="text"
            placeholder="Type your message here.."
            value={inputValue}
            onChange={handleChange}
          />
          <button type="submit" className="chat-submit-button">
            <Arrow />
          </button>
        </form>
      </div>
    </aside>
  ) : null;
}
