"use client";

import React, { useState, useCallback, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from 'styled-components';

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const CardContainer = styled.div`
  position: relative;
  width: 100%;
  height: 600px;
  margin: 20px auto;
  border: 1px solid #ccc;
  overflow: hidden;
`;

const Card = styled.div`
  position: absolute;
  width: 200px;
  height: 100px;
  background-color: ${props => props.bgcolor || '#ffffff'};
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  padding: 10px;
  cursor: move;
  user-select: none;
`;

const Button = styled.button`
  padding: 10px 15px;
  margin: 5px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const DraggableCard = ({ id, card, moveCard }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'card',
    item: (monitor) => {
      const cardRect = ref.current.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();
      return { 
        id, 
        left: card.left, 
        top: card.top, 
        mouseOffsetX: clientOffset.x - cardRect.left,
        mouseOffsetY: clientOffset.y - cardRect.top,
        width: cardRect.width,
        height: cardRect.height
      };
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [id, card.left, card.top]);

  drag(ref);

  return (
    <Card
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        left: card.left,
        top: card.top,
        zIndex: card.zIndex,
      }}
      bgcolor={card.color}
    >
      <h3>{card.title}</h3>
      <p>{card.content}</p>
    </Card>
  );
};

const StackedCards = ({ cards, moveCard }) => {
  const containerRef = useRef(null);

  const [, drop] = useDrop(() => ({
    accept: 'card',
    drop(item, monitor) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const dropPosition = monitor.getClientOffset();
      
      let left = dropPosition.x - containerRect.left - item.mouseOffsetX;
      let top = dropPosition.y - containerRect.top - item.mouseOffsetY;

      // Constrain the card within the container boundaries
      left = Math.max(0, Math.min(left, containerRect.width - item.width));
      top = Math.max(0, Math.min(top, containerRect.height - item.height));

      moveCard(item.id, left, top);
      return undefined;
    },
  }), [moveCard]);

  return (
    <CardContainer ref={node => { containerRef.current = node; drop(node); }}>
      {cards.map((card) => (
        <DraggableCard
          key={card.id}
          id={card.id}
          card={card}
          moveCard={moveCard}
        />
      ))}
    </CardContainer>
  );
};

const StackedCardsPage = () => {
  const [cards, setCards] = useState([
    { id: 1, title: "Card 1", content: "Draggable Card 1", color: "#ffcccc", left: 0, top: 0, zIndex: 3 },
    { id: 2, title: "Card 2", content: "Draggable Card 2", color: "#ccffcc", left: 20, top: 110, zIndex: 2 },
    { id: 3, title: "Card 3", content: "Draggable Card 3", color: "#ccccff", left: 40, top: 220, zIndex: 1 },
  ]);

  const moveCard = useCallback((id, left, top) => {
    setCards(prevCards => 
      prevCards.map(card => {
        if (card.id === id) {
          return { ...card, left, top, zIndex: Math.max(...prevCards.map(c => c.zIndex)) + 1 };
        }
        return card;
      })
    );
  }, []);

  const addCard = () => {
    const newId = Math.max(...cards.map(c => c.id), 0) + 1;
    setCards(prevCards => [
      ...prevCards,
      {
        id: newId,
        title: `Card ${newId}`,
        content: `New Draggable Card ${newId}`,
        color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`,
        left: Math.random() * 600,
        top: Math.random() * 500,
        zIndex: prevCards.length + 1
      }
    ]);
  };

  const removeLastCard = () => {
    if (cards.length > 1) {
      setCards(prevCards => prevCards.slice(0, -1));
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <PageContainer>
        <h1>Precisely Draggable Cards</h1>
        <Button onClick={addCard}>Add Card</Button>
        <Button onClick={removeLastCard}>Remove Last Card</Button>
        <StackedCards cards={cards} moveCard={moveCard} />
      </PageContainer>
    </DndProvider>
  );
};

export default StackedCardsPage;