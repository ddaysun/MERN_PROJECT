import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <HomeContainer>
      <Title>Niu Bao & Cha Bao</Title>
      <ButtonContainer>
        <NavButton onClick={() => navigate('/memories')}>
          Memory Album
        </NavButton>
        <NavButton onClick={() => navigate('/diary')}>
          Memory Diary
        </NavButton>
      </ButtonContainer>
    </HomeContainer>
  );
};

const HomeContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #000;
  color: #fff;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 2rem;
  text-shadow: 0 0 10px rgba(255, 105, 180, 0.7);
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 2rem;
`;

const NavButton = styled.button`
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background-color: transparent;
  color: #fff;
  border: 2px solid #fff;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 15px rgba(255, 105, 180, 0.5);
    transform: translateY(-3px);
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

export default HomePage;