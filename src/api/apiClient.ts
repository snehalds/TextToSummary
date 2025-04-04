// src/api/apiClient.ts
import axios from 'axios';


const HARDCODED_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NDM2NTk4OTksImV4cCI6MTc0MzY3Nzg5OSwic3ViIjoia2lzdWJAZWcuZGsifQ.XDxuTXUB7Yfc0v8dTcS2t4_dB_z0VzO-y7hxbJpPQtc';

const apiClient = axios.create({
  baseURL: 'http://localhost:8050', 
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${HARDCODED_TOKEN}` 
  }
});

export default apiClient;