import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Photo3DCloud from '../components/Photo3DCloud';
import axios from 'axios';

const MemoryAlbum = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // 获取照片数据
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        // 这里替换为你的API端点
        const response = await axios.get('/api/photos');
        setPhotos(response.data);
        setLoading(false);
      } catch (error) {
        console.error('获取照片失败:', error);
        // 使用示例数据
        setPhotos(samplePhotos);
        setLoading(false);
      }
    };
    
    fetchPhotos();
  }, []);
  
  if (loading) {
    return <Loading>加载中...</Loading>;
  }
  
  return (
    <AlbumContainer>
      <BackButton onClick={() => navigate('/')}>返回首页</BackButton>
      <Photo3DCloud photos={photos} />
    </AlbumContainer>
  );
};

// example data
const samplePhotos = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486',
    caption: '第一次约会',
    description: '在咖啡厅的美好时光',
    date: '2022-02-14'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d',
    caption: '海边漫步',
    description: '夕阳下的浪漫时刻',
    date: '2022-04-22'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9',
    caption: '生日惊喜',
    description: '难忘的生日派对',
    date: '2022-06-10'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf',
    caption: '旅行冒险',
    description: '一起探索新城市',
    date: '2022-08-05'
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8',
    caption: '烛光晚餐',
    description: '纪念我们的周年纪念日',
    date: '2022-10-30'
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1454923634634-bd1614719a7b',
    caption: '冬日漫步',
    description: '雪中的浪漫时刻',
    date: '2022-12-25'
  },
  {
    id: 7,
    url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2',
    caption: '春游野餐',
    description: '阳光明媚的一天',
    date: '2023-03-15'
  },
  {
    id: 8,
    url: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7',
    caption: '音乐会之夜',
    description: '一起欣赏最爱的乐队',
    date: '2023-05-20'
  }
];

const AlbumContainer = styled.div`
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  background-color: #000;
  position: relative;
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

export default MemoryAlbum;

