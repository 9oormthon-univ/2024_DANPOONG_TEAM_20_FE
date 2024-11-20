let ws;

export const initializeWebSocket = (userId) => {
  ws = new WebSocket(`ws://.com:8080?userId=${userId}`);

  ws.onopen = () => {
    console.log("연결 성공");
  };

  ws.onclose = () => {
    console.log("연결 종료");
  };

  ws.onerror = (error) => {
    console.error("오류:", error);
  };

  return ws;
};

export const sendMessage = (message) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  } else {
    console.error("통신에러(닫혀있음)");
  }
};

export const closeWebSocket = () => {
  if (ws) {
    ws.close();
  }
};
