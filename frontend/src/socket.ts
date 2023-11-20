// import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
import { useMessageStore } from './stores/message-store';

const store = useMessageStore();
const URL = process.env.API + '/ws';

const header = {};

let stompCLient: Stomp.client;

let connectionStatus = false;

export const initSocket = () => {
  return con();
};

export const con = () => {
  const socket = new SockJS(URL);
  stompCLient = Stomp.over(socket);

  const header = {};

  stompCLient.connect(
    header,
    () => {
      connectionStatus = true;
      stompCLient.subscribe('/topic/public', onMessageRecieved, header);
    },
    (err: any) => {
      console.log('error is=>', err);
    }
  );
  return connectionStatus;
};

export const close = () => {
  if (stompCLient) {
    stompCLient.disconnect(() => {
      connectionStatus = false;
    });
  }
};

export const send = (username: string, message: string) => {
  const chatMessage = {
    sender: username,
    content: message,
    type: 'CHAT',
  };
  if (connectionStatus) {
    try {
      stompCLient.send(
        '/app/chat.sendMessage',
        header,
        JSON.stringify(chatMessage)
      );
    } catch (error) {
      con();
    }
  }
};

export const enterToChat = (username: string) => {
  if (connectionStatus) {
    try {
      stompCLient.send(
        '/app/chat.addUser',
        header,
        JSON.stringify({ sender: username, type: 'JOIN' })
      );
    } catch (error) {
      con();
    }
  }
  return connectionStatus;
};

function onMessageRecieved(payload: any) {
  const message = JSON.parse(payload.body);
  if (message.type === 'JOIN') {
    let html = '<li class="row justify-center">';
    html = html + message.sender + ' joined to chat!';
    html += '</li>';
    store.addToContent(html);
  } else if (message.type === 'LEAVE') {
    let html = '<li class="row justify-center">';
    html = html + message.sender + ' left chat!';
    html += '</li>';
    store.addToContent(html);
  } else {
    const sender = message.sender;
    const content = message.content;
    let html = '<li class="row justify-start">';
    html =
      html +
      '<span class="avatar">A</span>' +
      '<div>' +
      '<p>' +
      sender +
      '</p>' +
      '<p>' +
      content +
      '</p>' +
      '</div>';
    html += '</li>';
    store.addToContent(html);
  }
}