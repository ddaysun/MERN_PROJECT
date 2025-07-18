import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const MemoryDiary = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookOpen, setIsBookOpen] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        // 这里替换为你的API端点
        const response = await axios.get('/api/diary');
        setEntries(response.data);
        setLoading(false);
      } catch (error) {
        console.error('获取日记失败:', error);
        // 使用示例数据
        setEntries(sampleEntries);
        setLoading(false);
      }
    };
    
    fetchEntries();
  }, []);
  
  if (loading) {
    return <Loading>加载中...</Loading>;
  }
  
  return (
    <DiaryContainer>
      <BackButton onClick={() => navigate('/')}>返回首页</BackButton>
      
      {!isBookOpen ? (
        <BookCoverContainer>
          <BookCover>
            <BookTitle>Even's diary</BookTitle>
            <BookSubtitle>记录我们的美好时光</BookSubtitle>
          </BookCover>
          <OpenBookButton onClick={() => setIsBookOpen(true)}>
            <BookIcon />
            Open book
          </OpenBookButton>
        </BookCoverContainer>
      ) : (
        <OpenBookContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BookHeader>
            <BookHeaderTitle>Our Love Diary</BookHeaderTitle>
          </BookHeader>
          
          <EntriesList>
            {entries.map(entry => (
              <EntryCard 
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * entry.id }}
              >
                <EntryDate>{entry.date}</EntryDate>
                <EntryTitle>{entry.title}</EntryTitle>
                <EntryContent>{entry.content}</EntryContent>
              </EntryCard>
            ))}
          </EntriesList>
          
          <CloseBookButton onClick={() => setIsBookOpen(false)}>
            关闭日记本
          </CloseBookButton>
        </OpenBookContainer>
      )}
    </DiaryContainer>
  );
};

// 示例数据
const sampleEntries = [
  {
    id: 1,
    title: '第一次见面',
    content: '今天我们第一次见面，感觉很特别...',
    date: '2022-01-15'
  },
  {
    id: 2,
    title: '一起看电影',
    content: '今天我们一起看了《你的名字》，很感动...',
    date: '2022-02-20'
  },
  {
    id: 3,
    title: '周末野餐',
    content: '阳光明媚的一天，我们去公园野餐...',
    date: '2022-03-12'
  },
  {
    id: 4,
    title: '生日惊喜',
    content: '今天是她的生日，我准备了一个惊喜...',
    date: '2022-04-05'
  }
];

const DiaryContainer = styled.div`
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-image: linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.9)), 
                    url('https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
  background-size: cover;
  background-position: center;
`;

const BackButton = styled.button`
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 10;
  background: transparent;
  color: #fff;
  border: 1px solid #fff;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const BookCoverContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
`;

const BookCover = styled.div`
  width: 350px;
  height: 400px;
  background: linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 100%);
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  margin-bottom: 40px;
  position: relative;
  transform: rotateY(5deg);
  transition: transform 0.5s ease;
  
  &:hover {
    transform: rotateY(0deg);
  }
  
  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(90deg, 
      #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8b00ff);
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
`;

const BookTitle = styled.h1`
  font-size: 2.5rem;
  color: white;
  text-align: center;
  margin-bottom: 1rem;
  font-family: 'Playfair Display', serif;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
`;

const BookSubtitle = styled.p`
  font-size: 1rem;
  color: #aaa;
  text-align: center;
`;

const OpenBookButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: white;
  border: 1px solid white;
  border-radius: 30px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
  }
`;

const BookIcon = styled.span`
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M21,5c-1.11-0.35-2.33-0.5-3.5-0.5c-1.95,0-4.05,0.4-5.5,1.5c-1.45-1.1-3.55-1.5-5.5-1.5S2.45,4.9,1,6v14.65c0,0.25,0.25,0.5,0.5,0.5c0.1,0,0.15-0.05,0.25-0.05C3.1,20.45,5.05,20,6.5,20c1.95,0,4.05,0.4,5.5,1.5c1.35-0.85,3.8-1.5,5.5-1.5c1.65,0,3.35,0.3,4.75,1.05c0.1,0.05,0.15,0.05,0.25,0.05c0.25,0,0.5-0.25,0.5-0.5V6C22.4,5.55,21.75,5.25,21,5z M21,18.5c-1.1-0.35-2.3-0.5-3.5-0.5c-1.7,0-4.15,0.65-5.5,1.5V8c1.35-0.85,3.8-1.5,5.5-1.5c1.2,0,2.4,0.15,3.5,0.5V18.5z"/></svg>');
  background-repeat: no-repeat;
  background-position: center;
`;

const OpenBookContainer = styled(motion.div)`
  width: 800px;
  max-width: 90%;
  height: 80vh;
  background: linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 100%);
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const BookHeader = styled.div`
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
`;

const BookHeaderTitle = styled.h2`
  font-size: 1.8rem;
  color: white;
  margin: 0;
  font-family: 'Playfair Display', serif;
`;

const EntriesList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  /* 自定义滚动条 */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const EntryCard = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 20px;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(255, 255, 255, 0.1);
  }
`;

const EntryDate = styled.div`
  font-size: 0.9rem;
  color: #aaa;
  margin-bottom: 8px;
`;

const EntryTitle = styled.h3`
  font-size: 1.5rem;
  color: white;
  margin: 0 0 15px 0;
`;

const EntryContent = styled.p`
  line-height: 1.6;
  color: #ddd;
`;

const CloseBookButton = styled.button`
  margin: 20px auto;
  background: transparent;
  color: white;
  border: 1px solid white;
  border-radius: 20px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background-color: #000;
  color: #fff;
  font-size: 1.5rem;
`;

export default MemoryDiary;
