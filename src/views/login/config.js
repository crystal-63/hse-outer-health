const PHONE_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAjCAYAAAB7NEEmAAAACXBIWXMAAA9gAAAPYAF6eEWNAAAArElEQVRIx+3WsQ3CMBSE4d9WekYgI3gDoPVrYAQmSdjAI8AQr2cE2CRMYBoHAQUE2dDg6yxZn3TVOxNjRERaoCUvg6qeAIz33gFHYEZ+tqq6N977oRA4ZmMLgwCuuXvsMrElsAC4oara54gi0o+o5QupaEUrWtGKVvSv0ObpxObe/UcU6H5d/wKcS6MBWJdGuzQ3J+1UC6xSvXeZT/hzUNVg0pJ2n9R7saQDwBUuaiiAESlQUwAAAABJRU5ErkJggg=="

const QX_CODE = 'data:image/png;base64,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'

export {
  PHONE_URL,
  QX_CODE
}