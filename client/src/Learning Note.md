# MERN Stack Learning Note

## MERN Stack 组成

M - MongoDB: 一个文档型数据库，存储数据
E - Express: 一个后端 Web 应用框架，用于构建 API
R - React: 一个前端 JavaScript 库，用于构建用户界面
N - Node.js: 一个 JavaScript 运行环境，允许在服务器端运行 JavaScript

## project architecture overview
1. 前端 (client 文件夹):
   - 使用 React 构建用户界面
   - 通过 HTTP 请求与后端 API 通信
   - 在浏览器中运行

2. 后端 (server 文件夹):
   - 使用 Node.js 和 Express 构建 API
   - 处理数据库操作
   - 实现业务逻辑
   - 在服务器上运行

3. 数据库:
   - MongoDB 存储应用数据
   - 通过 Mongoose 库与 Node.js 连接

4. 后端放在 ec2上
    - 连接命令： ssh mern-server 

## react learning note
1. 组件 (Components):
   - React 应用由组件构成
   - 组件是可重用的、独立的代码块
   - 组件可以是函数或类
   - 组件返回 JSX (一种类似 HTML 的语法)

2. JSX:
   - JavaScript 的语法扩展
   - 允许在 JavaScript 中编写类似 HTML 的代码
   - 例如: return <div>Hello World</div>;

3. Props:
   - 向组件传递数据的方式
   - 类似于 HTML 属性
   - 例如: <UserProfile name="John" age={25} />

4. State:
   - 组件的内部数据
   - 当 state 改变时，组件会重新渲染
   - 使用 useState 钩子管理 (在函数组件中)

5. 钩子 (Hooks):
   - 特殊的函数，让你在函数组件中使用 React 特性
   - 常用钩子: useState, useEffect, useContext


## file structure explained
/love-diary/
  /client/                    # 前端 React 应用
    /public/                  # 静态文件
      index.html              # HTML 入口文件
      manifest.json           # Web 应用配置
    /src/                     # 源代码
      /components/            # React 组件
      /pages/                 # 页面组件
      App.js                  # 主应用组件
      index.js                # JavaScript 入口文件
      
  /server/                    # 后端 Node.js/Express 应用
    /models/                  # 数据库模型
    /routes/                  # API 路由
    /middleware/              # 中间件
    /config/                  # 配置文件
    server.js                 # 服务器入口文件

## mern stack flow
1. 用户在浏览器中与 React 前端交互
2. React 组件通过 HTTP 请求(使用 axios)向后端 API 发送请求
3. Express 后端接收请求，处理业务逻辑
4. 后端通过 Mongoose 与 MongoDB 数据库交互
5. 数据库返回结果给后端
6. 后端将结果作为 JSON 响应发送回前端
7. React 前端接收数据并更新用户界面

## react component example
``` js
// 一个简单的 React 组件示例

// 1. 导入 React 和钩子
import React, { useState } from 'react';

// 2. 定义一个函数组件
function DiaryEntry({ title, date }) {
  // 使用 useState 钩子创建一个状态变量
  const [likes, setLikes] = useState(0);
  
  // 定义一个处理点赞的函数
  const handleLike = () => {
    setLikes(likes + 1); // 更新状态
  };
  
  // 返回 JSX (组件的视觉表示)
  return (
    <div className="diary-entry">
      <h2>{title}</h2>
      <p>Date: {date}</p>
      <p>Likes: {likes}</p>
      <button onClick={handleLike}>Like</button>
    </div>
  );
}

// 3. 导出组件，使其可以在其他文件中使用
export default DiaryEntry;
```

## how to use component
``` js
// 在 App.js 中使用上面的 DiaryEntry 组件

import React from 'react';
import DiaryEntry from './components/DiaryEntry';

function App() {
  return (
    <div className="App">
      <h1>Our Love Diary</h1>
      
      {/* 使用 DiaryEntry 组件并传递 props */}
      <DiaryEntry 
        title="Our First Date" 
        date="2023-01-15" 
      />
      
      <DiaryEntry 
        title="Trip to Paris" 
        date="2023-06-20" 
      />
    </div>
  );
}

export default App;
```

## fetch data from backend
``` js
// 在 React 组件中获取后端数据的示例

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DiaryList() {
  // 状态用于存储从后端获取的数据
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // useEffect 钩子用于在组件加载时获取数据
  useEffect(() => {
    // 异步函数获取数据
    const fetchEntries = async () => {
      try {
        // 向后端 API 发送 GET 请求
        const response = await axios.get('http://localhost:5000/api/entries');
        // 更新状态，存储获取的数据
        setEntries(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchEntries();
  }, []); // 空数组表示这个效果只在组件挂载时运行一次
  
  // 显示加载状态或数据
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>Our Diary Entries</h1>
      {entries.map(entry => (
        <div key={entry._id}>
          <h2>{entry.title}</h2>
          <p>{entry.content}</p>
        </div>
      ))}
    </div>
  );
}

export default DiaryList;
```

## react learning note
1. 理解基础概念:
   - 先掌握组件、JSX、props 和 state 等基础概念
   - 理解 React 的单向数据流

2. 小步前进:
   - 从简单组件开始
   - 逐步添加复杂功能
   - 一次专注于一个概念

3. 使用官方文档:
   - React 官方文档非常全面: https://react.dev/
   - 官方教程是很好的起点

4. 实践学习:
   - 通过修改现有代码学习
   - 尝试自己实现小功能
   - 使用 React 开发者工具调试

5. 理解 React 生态系统:
   - React Router: 处理页面导航
   - 状态管理: Context API (内置) 或 Redux
   - 样式解决方案: CSS Modules, Styled Components

## suggestions to learn react
1. 理解基础概念:
   - 先掌握组件、JSX、props 和 state 等基础概念
   - 理解 React 的单向数据流

2. 小步前进:
   - 从简单组件开始
   - 逐步添加复杂功能
   - 一次专注于一个概念

3. 使用官方文档:
   - React 官方文档非常全面: https://react.dev/
   - 官方教程是很好的起点

4. 实践学习:
   - 通过修改现有代码学习
   - 尝试自己实现小功能
   - 使用 React 开发者工具调试

5. 理解 React 生态系统:
   - React Router: 处理页面导航
   - 状态管理: Context API (内置) 或 Redux
   - 样式解决方案: CSS Modules, Styled Components

## how to upload local project to EC2


# gasp 